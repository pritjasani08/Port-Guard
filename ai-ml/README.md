# Port-Guard AI/ML Pipeline 🚀

This repository contains the AI/ML pipeline for training a custom YOLOv8 object detection model on the Port-Guard dataset. The model is specifically trained to detect the following classes:
- Person
- Helmet
- Safety Jacket
- Fire
- Smoke

## 🎥 Demo
[Click here to view the live demo video / link] <!-- Add your demo link here later -->

## 📁 Project Structure

```
ai-ml/
│
├── merged_dataset/       # The combined dataset with images and labels
│   ├── data.yaml         # YOLO configuration file for dataset classes/paths
│   ├── train/            # Training split
│   ├── valid/            # Validation split
│   └── test/             # Test split
│
├── models/
│   ├── pretrained/       # Base models (like yolov8n.pt) are downloaded here
│   └── trained/          # Your final trained custom models are saved here
│
├── src/                  # Source code for the ML pipeline
│   ├── config.py         # Hyperparameters (Epochs, Batch Size, Paths)
│   └── trainer.py        # Core YOLO training logic
│
├── main.py               # Main entry point to start the training pipeline
├── requirements.txt      # Python dependencies
└── .gitignore            # Git ignore rules for datasets and weights
```

## ⚙️ Prerequisites
- Python 3.8+
- An NVIDIA GPU (e.g., RTX 2050) is highly recommended for faster training.

## 🚀 How to Start Training

1. **Install Dependencies**  
   Open your terminal in the `ai-ml` directory and install the required Python libraries:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Pipeline**  
   Start the training process by simply running the main script:
   ```bash
   python main.py
   ```

## 🧠 Model Weights

- **Where is the model downloaded?**  
  You do **not** need to manually download any AI models! When you run `main.py` for the very first time, the pipeline will automatically download the base pretrained model (`yolov8n.pt`) from the internet and save it safely inside the `models/pretrained/` folder.

- **Where is my final model saved?**  
  After the training finishes (30 epochs), your custom fine-tuned model weights will be automatically saved inside:
  `models/trained/custom_yolov8_run/weights/best.pt`
