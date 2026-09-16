import os
import shutil
from pathlib import Path
from ultralytics import YOLO

from src.config import (
    DATA_YAML_PATH, 
    PRETRAINED_DIR, 
    TRAINED_DIR, 
    BASE_MODEL_NAME, 
    EPOCHS,
    BATCH_SIZE,
    IMG_SIZE
)

class ModelTrainer:
    def __init__(self):
        self._ensure_directories()
        
    def _ensure_directories(self):
        """Creates the required folders if they don't exist yet."""
        PRETRAINED_DIR.mkdir(parents=True, exist_ok=True)
        TRAINED_DIR.mkdir(parents=True, exist_ok=True)
        
    def train(self):
        """Starts the YOLO AI training pipeline."""
        print("="*50)
        print("🚀 STARTING AI/ML PIPELINE")
        print("="*50)
        print(f"Dataset config: {DATA_YAML_PATH}")
        print(f"Training for {EPOCHS} epochs with batch size {BATCH_SIZE} on your GPU.")
        
        # 1. Download/Initialize Pretrained YOLO model
        print(f"\n[1] Preparing base model ({BASE_MODEL_NAME})...")
        print("    (If this is your first time, Ultralytics will automatically download it from HuggingFace/Ultralytics servers!)")
        
        # We temporarily change the directory so Ultralytics downloads the model file into the pretrained folder
        original_cwd = os.getcwd()
        os.chdir(PRETRAINED_DIR)
        
        try:
            model = YOLO(BASE_MODEL_NAME)
        finally:
            # Always switch back to the original root folder
            os.chdir(original_cwd)
        
        # 2. Train the model using your custom dataset
        print(f"\n[2] Starting Training Phase...")
        print(f"    Results and weights will be saved to: {TRAINED_DIR}")
        
        results = model.train(
            data=str(DATA_YAML_PATH),
            epochs=EPOCHS,
            batch=BATCH_SIZE,
            imgsz=IMG_SIZE,
            project=str(TRAINED_DIR),
            name="custom_yolov8_run",
            exist_ok=True, # overwrite the same folder if we run it multiple times
            device=0       # Forces it to use your RTX 2050 (GPU 0)
        )
        
        print("\n" + "="*50)
        print("✅ TRAINING COMPLETE!")
        print("="*50)
        print(f"Your final trained AI model is saved at:")
        print(f"--> {TRAINED_DIR / 'custom_yolov8_run' / 'weights' / 'best.pt'}")
        
        return results
