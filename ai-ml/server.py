import os
import io
import time
import base64
import tempfile
from pathlib import Path
from typing import Optional

import cv2
import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import imageio_ffmpeg

# -------------------------------------------------------------
# Configuration & Paths
# -------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
FRONTEND2_DIR = PROJECT_ROOT / "frontend2"
MODEL_PATH = BASE_DIR / "models" / "trained" / "custom_yolov8_run" / "weights" / "best.pt"

# Fallback if best.pt is not in expected run path
if not MODEL_PATH.exists():
    alt_path = BASE_DIR / "models" / "pretrained" / "yolov8n.pt"
    if alt_path.exists():
        MODEL_PATH = alt_path

TEMP_VIDEO_DIR = BASE_DIR / "temp_outputs"
TEMP_VIDEO_DIR.mkdir(parents=True, exist_ok=True)

# -------------------------------------------------------------
# FastAPI App Initialization
# -------------------------------------------------------------
app = FastAPI(
    title="Port-Guard AI Vision API",
    description="High-Speed Industrial Object Detection Server for Port Safety (Helmet, Jacket, Person, Fire, Smoke)",
    version="1.0.0"
)

# Enable CORS for frontend flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# Load Trained YOLO Model
# -------------------------------------------------------------
print(f"Loading trained model from: {MODEL_PATH}")
try:
    # Use GPU 0 if available, else CPU
    import torch
    device = 0 if torch.cuda.is_available() else "cpu"
    model = YOLO(str(MODEL_PATH))
    print(f"✅ Model loaded successfully on device: {device} (Classes: {model.names})")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# Class color palette for consistent rendering (BGR format for OpenCV)
CLASS_COLORS = {
    0: (255, 140, 0),    # person: Deep Sky Blue / Orange
    1: (0, 215, 255),    # helmet: Bright Yellow
    2: (0, 255, 127),    # safety_jacket: Spring Green
    3: (0, 69, 255),     # fire: Bright Red-Orange
    4: (169, 169, 169),  # smoke: Gray
}

# -------------------------------------------------------------
# API Endpoints
# -------------------------------------------------------------
@app.get("/api/info")
def get_model_info():
    """Returns model health, classes, and device status."""
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded")
    return {
        "status": "online",
        "model_file": MODEL_PATH.name,
        "classes": model.names,
        "device": "NVIDIA GPU (CUDA)" if torch.cuda.is_available() else "CPU",
        "gpu_name": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "None"
    }

@app.post("/predict/image")
async def predict_image(
    file: UploadFile = File(...),
    conf: float = Form(0.25),
    iou: float = Form(0.45)
):
    """
    Accepts an uploaded image, runs YOLO detection with best.pt,
    and returns detected objects, summary counts, and the annotated image in Base64.
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded")

    start_time = time.time()
    contents = await file.read()
    
    # Decode image
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is None:
        raise HTTPException(status_code=400, detail="Invalid image file format")

    orig_h, orig_w = image.shape[:2]

    # Run inference
    results = model.predict(source=image, conf=conf, iou=iou, device=device)
    res = results[0]

    detections = []
    counts = {name: 0 for name in model.names.values()}

    # Plot custom clean annotations
    annotated_img = image.copy()

    for box in res.boxes:
        cls_id = int(box.cls[0].item())
        cls_name = model.names.get(cls_id, f"class_{cls_id}")
        confidence = float(box.conf[0].item())
        xyxy = box.xyxy[0].tolist()  # [x1, y1, x2, y2]
        
        counts[cls_name] = counts.get(cls_name, 0) + 1

        detections.append({
            "class_id": cls_id,
            "class_name": cls_name,
            "confidence": round(confidence, 4),
            "bbox": [round(coord, 1) for coord in xyxy]
        })

        # Draw box on annotated image
        x1, y1, x2, y2 = map(int, xyxy)
        color = CLASS_COLORS.get(cls_id, (0, 255, 0))
        cv2.rectangle(annotated_img, (x1, y1), (x2, y2), color, 2)
        
        # Label banner
        label = f"{cls_name} {confidence:.0%}"
        (w_text, h_text), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
        cv2.rectangle(annotated_img, (x1, max(0, y1 - h_text - 6)), (x1 + w_text + 4, y1), color, -1)
        cv2.putText(annotated_img, label, (x1 + 2, max(h_text + 2, y1 - 4)), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2, cv2.LINE_AA)

    inference_ms = round((time.time() - start_time) * 1000, 2)

    # Encode annotated image to JPEG base64
    _, buffer = cv2.imencode(".jpg", annotated_img, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
    base64_str = "data:image/jpeg;base64," + base64.b64encode(buffer).decode("utf-8")

    return {
        "success": True,
        "filename": file.filename,
        "image_size": {"width": orig_w, "height": orig_h},
        "total_detections": len(detections),
        "counts": counts,
        "detections": detections,
        "inference_time_ms": inference_ms,
        "annotated_image": base64_str
    }

@app.post("/predict/video")
async def predict_video(
    file: UploadFile = File(...),
    conf: float = Form(0.25)
):
    """
    Accepts an uploaded video file, processes frames with the trained model,
    encodes with web-compatible H.264 (libx264/yuv420p), and returns summary stats,
    keyframe snapshot highlights, and playback URL.
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded")

    suffix = Path(file.filename).suffix or ".mp4"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_in:
        tmp_in.write(await file.read())
        in_path = tmp_in.name

    cap = cv2.VideoCapture(in_path)
    if not cap.isOpened():
        raise HTTPException(status_code=400, detail="Could not read video file")

    orig_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    orig_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    if fps <= 0 or np.isnan(fps):
        fps = 25.0

    # Resize if resolution is very large to speed up processing
    target_w = orig_w
    target_h = orig_h
    if target_w > 1280:
        scale = 1280.0 / target_w
        target_w = 1280
        target_h = int(orig_h * scale)

    # Ensure even dimensions (mandatory for H.264 libx264)
    target_w = target_w - (target_w % 2)
    target_h = target_h - (target_h % 2)

    out_filename = f"processed_{int(time.time())}.mp4"
    out_path = TEMP_VIDEO_DIR / out_filename

    # Initialize true browser-compatible H.264 encoder
    writer = imageio_ffmpeg.write_frames(
        str(out_path),
        (target_w, target_h),
        fps=fps,
        codec="libx264",
        pix_fmt_in="bgr24",
        pix_fmt_out="yuv420p",
        ffmpeg_log_level="warning"
    )
    writer.send(None)  # initialize generator

    frame_count = 0
    total_detections_across_frames = 0
    class_occurrence = {name: 0 for name in model.names.values()}
    keyframe_snapshots = []
    detection_log = []

    start_time = time.time()
    MAX_FRAMES = 600

    try:
        while cap.isOpened() and frame_count < MAX_FRAMES:
            ret, frame = cap.read()
            if not ret:
                break

            if frame.shape[1] != target_w or frame.shape[0] != target_h:
                frame = cv2.resize(frame, (target_w, target_h))

            # Run YOLO model inference
            results = model.predict(source=frame, conf=conf, device=device, verbose=False)
            res = results[0]

            # Use Ultralytics plot() for high-visibility bounding boxes
            annotated_frame = res.plot(line_width=2, font_size=1.0)

            boxes_in_frame = len(res.boxes)
            if boxes_in_frame > 0:
                total_detections_across_frames += boxes_in_frame
                frame_classes = []
                for box in res.boxes:
                    cls_id = int(box.cls[0].item())
                    cls_name = model.names.get(cls_id, f"class_{cls_id}")
                    confidence = float(box.conf[0].item())
                    xyxy = box.xyxy[0].tolist()
                    class_occurrence[cls_name] = class_occurrence.get(cls_name, 0) + 1
                    frame_classes.append(f"{cls_name} ({confidence:.0%})")

                # Capture up to 8 snapshot highlights evenly spaced across detections
                if len(keyframe_snapshots) < 8 and (frame_count % max(1, int(fps / 2)) == 0):
                    _, thumb_buf = cv2.imencode(".jpg", annotated_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
                    thumb_b64 = "data:image/jpeg;base64," + base64.b64encode(thumb_buf).decode("utf-8")
                    time_sec = round(frame_count / fps, 1)
                    keyframe_snapshots.append({
                        "frame": frame_count,
                        "time_sec": time_sec,
                        "detected_count": boxes_in_frame,
                        "classes": ", ".join(frame_classes[:4]),
                        "image_base64": thumb_b64
                    })

                if len(detection_log) < 50:
                    time_sec = round(frame_count / fps, 2)
                    for box in res.boxes:
                        cls_id = int(box.cls[0].item())
                        cls_name = model.names.get(cls_id, f"class_{cls_id}")
                        confidence = float(box.conf[0].item())
                        detection_log.append({
                            "time_sec": time_sec,
                            "class_name": cls_name,
                            "confidence": round(confidence, 3),
                            "bbox": [round(c, 1) for c in box.xyxy[0].tolist()]
                        })

            writer.send(annotated_frame)
            frame_count += 1
    finally:
        cap.release()
        writer.close()
        try:
            os.remove(in_path)
        except:
            pass

    total_proc_time = round(time.time() - start_time, 2)

    return {
        "success": True,
        "filename": file.filename,
        "processed_frames": frame_count,
        "fps": round(fps, 1),
        "total_detections": total_detections_across_frames,
        "class_counts": class_occurrence,
        "processing_time_sec": total_proc_time,
        "video_url": f"/api/video/{out_filename}",
        "snapshots": keyframe_snapshots,
        "detection_log": detection_log
    }

@app.get("/api/video/{filename}")
def get_processed_video(filename: str):
    video_path = TEMP_VIDEO_DIR / filename
    if not video_path.exists():
        raise HTTPException(status_code=404, detail="Processed video not found")
    return FileResponse(
        str(video_path),
        media_type="video/mp4",
        headers={
            "Accept-Ranges": "bytes",
            "Content-Disposition": f'inline; filename="{filename}"'
        }
    )

# -------------------------------------------------------------
# Mount Frontend 2 as Static Files & Root Route
# -------------------------------------------------------------
if FRONTEND2_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND2_DIR)), name="static")
    app.mount("/", StaticFiles(directory=str(FRONTEND2_DIR), html=True), name="frontend2")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
