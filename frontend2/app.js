// ==========================================================================
// Port-Guard AI Vision Frontend Logic
// ==========================================================================

// Auto-detect API: If loaded directly via FastAPI (port 8000), use origin; if opened via Live Server (port 5500) or file://, point to port 8000
const API_BASE = (window.location.port === "8000") 
  ? window.location.origin 
  : "http://127.0.0.1:8000";

let currentMode = "image"; // 'image' | 'video'
let selectedFile = null;
let currentResult = null;

// DOM Elements
const serverStatusBadge = document.getElementById("server-status");
const statusText = document.getElementById("status-text");
const fileInput = document.getElementById("file-input");
const dropzone = document.getElementById("dropzone");
const filePreviewStrip = document.getElementById("file-preview-strip");
const selectedFileName = document.getElementById("selected-file-name");
const selectedFileSize = document.getElementById("selected-file-size");
const fileHint = document.getElementById("file-hint");
const detectBtn = document.getElementById("detect-btn");
const confSlider = document.getElementById("conf-slider");
const confVal = document.getElementById("conf-val");
const iouSlider = document.getElementById("iou-slider");
const iouVal = document.getElementById("iou-val");
const iouGroup = document.getElementById("iou-group");

const processingView = document.getElementById("processing-view");
const processingStatusText = document.getElementById("processing-status-text");
const resultsView = document.getElementById("results-view");
const metaStats = document.getElementById("meta-stats");

const annotatedImage = document.getElementById("annotated-image");
const originalImage = document.getElementById("original-image");
const imageVisualizer = document.getElementById("image-visualizer");
const videoVisualizer = document.getElementById("video-visualizer");
const processedVideo = document.getElementById("processed-video");

const countHelmet = document.getElementById("count-helmet");
const countJacket = document.getElementById("count-jacket");
const countFire = document.getElementById("count-fire");
const countSmoke = document.getElementById("count-smoke");
const countPerson = document.getElementById("count-person");
const detectionTableBody = document.getElementById("detection-table-body");

// -------------------------------------------------------------
// 1. Initialize & Server Health Check
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  checkServerHealth();
  setupSliders();
  setupDropzone();
});

async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/info`);
    if (res.ok) {
      const data = await res.json();
      serverStatusBadge.className = "status-badge online";
      statusText.textContent = `Online • ${data.device}`;
      statusText.title = `Model: ${data.model_file} | GPU: ${data.gpu_name}`;
    } else {
      throw new Error();
    }
  } catch (err) {
    serverStatusBadge.className = "status-badge offline";
    statusText.textContent = "Server Offline (Start with uvicorn)";
  }
}

// -------------------------------------------------------------
// 2. Tab Mode Switching (Image vs. Video)
// -------------------------------------------------------------
function switchMode(mode) {
  currentMode = mode;
  document.getElementById("tab-image").classList.toggle("active", mode === "image");
  document.getElementById("tab-video").classList.toggle("active", mode === "video");

  clearSelectedFile();
  resultsView.classList.add("hidden");

  if (mode === "image") {
    fileInput.accept = "image/*";
    fileHint.textContent = "Supports JPG, PNG, WEBP (Photo Mode)";
    iouGroup.style.display = "flex";
  } else {
    fileInput.accept = "video/mp4,video/quicktime,video/avi";
    fileHint.textContent = "Supports MP4, MOV, AVI (Video Mode - max 300 frames)";
    iouGroup.style.display = "none";
  }
}

// -------------------------------------------------------------
// 3. Slider Controls
// -------------------------------------------------------------
function setupSliders() {
  confSlider.addEventListener("input", (e) => {
    confVal.textContent = `${Math.round(e.target.value * 100)}%`;
  });
  iouSlider.addEventListener("input", (e) => {
    iouVal.textContent = `${Math.round(e.target.value * 100)}%`;
  });
}

// -------------------------------------------------------------
// 4. File Dropzone & Selection Handling
// -------------------------------------------------------------
function setupDropzone() {
  ["dragenter", "dragover"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove("dragover");
    });
  });

  dropzone.addEventListener("drop", (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  });
}

function triggerFileInput() {
  fileInput.click();
}

function handleFileSelected(file) {
  selectedFile = file;
  selectedFileName.textContent = file.name;
  selectedFileSize.textContent = formatBytes(file.size);
  filePreviewStrip.classList.remove("hidden");
  detectBtn.disabled = false;

  // Pre-load original image preview if image
  if (currentMode === "image" && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function clearSelectedFile() {
  selectedFile = null;
  fileInput.value = "";
  filePreviewStrip.classList.add("hidden");
  detectBtn.disabled = true;
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

// -------------------------------------------------------------
// 5. Run AI Detection Execution
// -------------------------------------------------------------
async function runDetection() {
  if (!selectedFile) return;

  // UI state
  detectBtn.disabled = true;
  processingView.classList.remove("hidden");
  resultsView.classList.add("hidden");

  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("conf", parseFloat(confSlider.value));

  try {
    if (currentMode === "image") {
      formData.append("iou", parseFloat(iouSlider.value));
      processingStatusText.textContent = "Running YOLOv8n inference on your RTX 2050...";

      const response = await fetch(`${API_BASE}/predict/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Prediction failed");
      }

      const data = await response.json();
      currentResult = data;
      renderImageResults(data);
    } else {
      processingStatusText.textContent = "Processing video frames through YOLOv8n (RTX 2050)...";

      const response = await fetch(`${API_BASE}/predict/video`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Video prediction failed");
      }

      const data = await response.json();
      currentResult = data;
      renderVideoResults(data);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    processingView.classList.add("hidden");
    detectBtn.disabled = false;
  }
}

// -------------------------------------------------------------
// 6. Render Results
// -------------------------------------------------------------
function renderImageResults(data) {
  imageVisualizer.classList.remove("hidden");
  videoVisualizer.classList.add("hidden");
  resultsView.classList.remove("hidden");

  // Meta stats
  metaStats.textContent = `⚡ Inference: ${data.inference_time_ms} ms | Image Size: ${data.image_size.width}x${data.image_size.height} | Detections: ${data.total_detections}`;

  // KPI counts
  countHelmet.textContent = data.counts["helmet"] || 0;
  countJacket.textContent = data.counts["safety_jacket"] || 0;
  countFire.textContent = data.counts["fire"] || 0;
  countSmoke.textContent = data.counts["smoke"] || 0;
  countPerson.textContent = data.counts["person"] || 0;

  // Annotated Image
  annotatedImage.src = data.annotated_image;
  toggleViewer("annotated");

  // Populate Table
  detectionTableBody.innerHTML = "";
  if (data.detections.length === 0) {
    detectionTableBody.innerHTML = `<tr><td colspan="4" class="empty-table">No objects detected above ${Math.round(confSlider.value * 100)}% confidence threshold.</td></tr>`;
  } else {
    data.detections.forEach((det, idx) => {
      const tr = document.createElement("tr");
      const tagClass = `tag-${det.class_name}`;
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><span class="tag-badge ${tagClass}">${det.class_name}</span></td>
        <td><strong>${(det.confidence * 100).toFixed(1)}%</strong></td>
        <td><code>[${det.bbox.join(", ")}]</code></td>
      `;
      detectionTableBody.appendChild(tr);
    });
  }

  // Smooth scroll to results
  resultsView.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderVideoResults(data) {
  imageVisualizer.classList.add("hidden");
  videoVisualizer.classList.remove("hidden");
  resultsView.classList.remove("hidden");

  metaStats.textContent = `⚡ Processed ${data.processed_frames} frames in ${data.processing_time_sec}s (${data.fps} FPS) | Total Objects: ${data.total_detections}`;

  countHelmet.textContent = data.class_counts["helmet"] || 0;
  countJacket.textContent = data.class_counts["safety_jacket"] || 0;
  countFire.textContent = data.class_counts["fire"] || 0;
  countSmoke.textContent = data.class_counts["smoke"] || 0;
  countPerson.textContent = data.class_counts["person"] || 0;

  // Set video source
  const videoSrc = `${API_BASE}${data.video_url}`;
  processedVideo.src = videoSrc;
  processedVideo.load();
  processedVideo.play().catch((e) => console.log("Autoplay prevented:", e));

  // Render Keyframe Snapshots
  const snapshotsContainer = document.getElementById("video-snapshots-container");
  const snapshotsGrid = document.getElementById("snapshots-grid");
  snapshotsGrid.innerHTML = "";

  if (data.snapshots && data.snapshots.length > 0) {
    snapshotsContainer.classList.remove("hidden");
    data.snapshots.forEach((snap) => {
      const card = document.createElement("div");
      card.className = "snapshot-card";
      card.title = `Click to jump to ${snap.time_sec}s in video`;
      card.onclick = () => {
        processedVideo.currentTime = snap.time_sec;
        processedVideo.play().catch(() => {});
      };

      card.innerHTML = `
        <div class="snapshot-img-wrap">
          <img src="${snap.image_base64}" alt="Frame ${snap.frame}" class="snapshot-img">
          <span class="snapshot-time-badge">⏱️ ${snap.time_sec}s</span>
        </div>
        <div class="snapshot-details">
          <span class="snapshot-count">${snap.detected_count} detected</span>
          <span class="snapshot-classes">${snap.classes || ""}</span>
        </div>
      `;
      snapshotsGrid.appendChild(card);
    });
  } else {
    snapshotsContainer.classList.add("hidden");
  }

  // Populate Detection Log Table
  detectionTableBody.innerHTML = "";
  if (data.detection_log && data.detection_log.length > 0) {
    data.detection_log.forEach((det, idx) => {
      const tr = document.createElement("tr");
      const tagClass = `tag-${det.class_name}`;
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><span class="tag-badge ${tagClass}">${det.class_name}</span> <small style="color:var(--text-dim)">@${det.time_sec}s</small></td>
        <td><strong>${(det.confidence * 100).toFixed(1)}%</strong></td>
        <td><code>[${det.bbox.join(", ")}]</code></td>
      `;
      detectionTableBody.appendChild(tr);
    });
  } else {
    detectionTableBody.innerHTML = `<tr><td colspan="4" class="empty-table">No detections recorded above confidence threshold.</td></tr>`;
  }

  resultsView.scrollIntoView({ behavior: "smooth", block: "start" });
}

function toggleViewer(type) {
  const tabs = document.querySelectorAll(".viewer-tab");
  tabs[0].classList.toggle("active", type === "annotated");
  tabs[1].classList.toggle("active", type === "original");

  annotatedImage.classList.toggle("hidden", type !== "annotated");
  originalImage.classList.toggle("hidden", type !== "original");
}

function downloadResult() {
  if (!currentResult) return;
  const a = document.createElement("a");
  if (currentMode === "image") {
    a.href = currentResult.annotated_image;
    a.download = `port_guard_detected_${Date.now()}.jpg`;
  } else {
    a.href = `${API_BASE}${currentResult.video_url}`;
    a.download = `port_guard_detected_${Date.now()}.mp4`;
  }
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
