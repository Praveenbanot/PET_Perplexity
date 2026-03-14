
# PET Bottle Analysis System

An end-to-end system for detecting and analyzing PET bottles in images.

The project consists of:
- **API Service (Node.js + Express)** for image uploads, ML orchestration, and analytics
- **ML Service (FastAPI + YOLOv8)** for detection and bottle property estimation
- **Frontend (React + Vite)** for uploads, visualization, and analytics

---

## Architecture

The system is composed of three services:

### 1. API Service (`api-service/`)
- Express server exposing `/api/*` endpoints
- Accepts image uploads via Multer
- Calls the ML service:
  - `/infer`
  - `/colorpet`
  - `/wtestimate` (in parallel)
- Merges ML responses per detection
- Computes summary analytics

### 2. ML Service (`ml-service/`)
- FastAPI application powered by Ultralytics YOLOv8
- Responsibilities:
  - Object detection
  - Color & PET classification
  - Length and weight estimation

### 3. Frontend (`frontend/`)
- React + Vite + TailwindCSS
- Image upload UI
- Detection overlays and tables
- Summary analytics and distributions

---

## Data Flow

1. Client uploads an image to the API (`/api/upload`)
2. API forwards the image to ML service `/infer`
3. API sends detection JSON to `/colorpet` and `/wtestimate` in parallel
4. API merges results per detection
5. API computes analytics and returns results to the client

---

## API

**Base URL:** `http://localhost:3000/api`

### Endpoints

- `GET /health` — health check
- `POST /upload` — single image upload  
  - `multipart/form-data`, field: `image`
- `POST /batch` — multiple image upload  
  - `multipart/form-data`, field: `images` (repeat per file)

### Response (single upload)

```json
{
  "success": true,
  "result": [BottleDetection],
  "analytics": Analytics
}
````

---

## BottleDetection (Merged)

```json
{
  "bbox_xyxy": [615, 165, 917, 350],
  "class_id": 2,
  "class_name": "bottle-dark",
  "confidence": 0.9861,
  "color": "black",
  "is_pet": true,
  "estimated_length_cm": 25.76,
  "estimated_weight_g": 16.75
}
```

---

## Analytics

```json
{
  "total_bottles": 5,
  "pet_count": 3,
  "non_pet_count": 2,
  "class_distribution": {
    "bottle-dark": 2,
    "bottle-transp-full": 3
  },
  "color_distribution": {
    "black": 2,
    "transparent": 3
  },
  "avg_confidence": 0.9567,
  "total_weight_g": 79.2,
  "avg_weight_g": 15.84,
  "avg_length_cm": 24.3
}
```

---

## ML Service Contract

The ML service is expected to expose the following endpoints:

* `POST /infer`
  Returns:

  ```json
  [
    { "bbox_xyxy": [], "class_id": 0, "class_name": "", "confidence": 0.0 }
  ]
  ```

* `POST /colorpet`
  Input: `/infer` output
  Returns:

  ```json
  [{ "color": "", "is_pet": true }]
  ```

* `POST /wtestimate`
  Input: `/infer` output
  Returns:

  ```json
  {
    "num_detections": 1,
    "results": [
      {
        "bbox_xyxy": [],
        "estimated_length_cm": 0,
        "estimated_weight_g": 0
      }
    ]
  }
  ```

Merging is performed by matching `bbox_xyxy` (with index fallback).

---

## Setup & Run

### Prerequisites

* Node.js 18+
* Python 3.10+

### 1. ML Service

```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn ultralytics python-multipart pillow

uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. API Service

```bash
cd api-service
cp .env.example .env
npm install
npm run dev
```

`.env`:

```env
PORT=3000
ML_SERVICE_URL=http://localhost:8000
MAX_FILE_SIZE=10485760
REQUEST_TIMEOUT=30000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Usage

### Single Image

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "image=@/path/to/image.jpg"
```

### Batch Upload

```bash
curl -X POST http://localhost:3000/api/batch \
  -F "images=@/path/to/a.jpg" \
  -F "images=@/path/to/b.jpg"
```

---

## Project Structure

```
api-service/
  src/
    controllers/
    routes/
    services/
    middleware/

frontend/
  src/
    pages/
    components/
    services/
```

---
