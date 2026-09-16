import os
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_YAML_PATH = BASE_DIR / "merged_dataset" / "data.yaml"

# Output Paths for Models
MODELS_DIR = BASE_DIR / "models"
PRETRAINED_DIR = MODELS_DIR / "pretrained"
TRAINED_DIR = MODELS_DIR / "trained"

# YOLO Base Model
# yolov8n.pt is the Nano model - it's fast and lightweight, perfect for an RTX 2050
BASE_MODEL_NAME = "yolov8n.pt"
BASE_MODEL_PATH = PRETRAINED_DIR / BASE_MODEL_NAME

# Training Hyperparameters
EPOCHS = 30
BATCH_SIZE = 8  # Safe batch size for 4GB VRAM (RTX 2050)
IMG_SIZE = 640  # Standard YOLO image size
