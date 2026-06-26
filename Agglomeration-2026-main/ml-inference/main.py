from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import cv2
from ultralytics import YOLO
import uvicorn
import math

# -------------------- INIT --------------------

app = FastAPI()

model = YOLO("best.pt")
class_names = model.names

# -------------------- RULES --------------------

BOTTLE_COLOR = {
    "bottle-blue": "blue",
    "bottle-blue-full": "blue",
    "bottle-blue5l": "blue",
    "bottle-blue5l-full": "blue",
    "bottle-green": "green",
    "bottle-green-full": "green",
    "bottle-transp": "transparent",
    "bottle-transp-full": "transparent",
    "bottle-dark": "black",
    "bottle-dark-full": "black",
    "bottle-milk": "white",
    "bottle-milk-full": "white",
    "bottle-multicolor": "unknown",
    "bottle-multicolorv-full": "unknown",
    "bottle-oil": "transparent",
    "bottle-oil-full": "transparent",
    "bottle-yogurt": "unknown",
}

BOTTLE_PET = {
    "bottle-blue": True,
    "bottle-blue-full": True,
    "bottle-blue5l": True,
    "bottle-blue5l-full": True,
    "bottle-green": True,
    "bottle-green-full": True,
    "bottle-transp": True,
    "bottle-transp-full": True,
    "bottle-dark": True,
    "bottle-dark-full": True,
    "bottle-oil": True,
    "bottle-oil-full": True,
    "bottle-milk": False,
    "bottle-milk-full": False,
    "bottle-yogurt": False,
    "bottle-multicolor": False,
    "bottle-multicolorv-full": False,
}

# -------------------- SCHEMA --------------------

class Detection(BaseModel):
    bbox_xyxy: List[int]
    class_id: int
    class_name: str
    confidence: float


# -------------------- HEALTH --------------------

@app.get("/health")
def health():
    return {"status": "OK"}


# -------------------- INFERENCE --------------------

@app.post("/infer", response_model=List[Detection])
async def infer(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image_np = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    if image is None:
        return []

    results = model.predict(image, conf=0.25, verbose=False)

    detections: List[Detection] = []

    for r in results:
        if r.boxes is None:
            continue

        for box in r.boxes:
            cls_id = int(box.cls[0])
            detections.append(
                Detection(
                    bbox_xyxy=box.xyxy[0].cpu().numpy().astype(int).tolist(),
                    class_id=cls_id,
                    class_name=class_names[cls_id],
                    confidence=float(box.conf[0]),
                )
            )

    return detections


# -------------------- COLOR + PET --------------------

@app.post("/colorpet")
def color_pet(detections: List[Detection]):
    out = []

    for d in detections:
        cls = d.class_name
        out.append({
            **d.dict(),
            "color": BOTTLE_COLOR.get(cls, "unknown"),
            "is_pet": BOTTLE_PET.get(cls, False),
        })

    return out


# -------------------- ESTIMATE WEIGHT --------------------

@app.post("/wtestimate")
def estimate_weight(detections: List[Detection]):
    results = []

    for det in detections:
        x1, y1, x2, y2 = det.bbox_xyxy

        diagonal_px = math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)/11

        # fixed assumptions (PLACEHOLDERS)
        length_cm = diagonal_px * 0.8
        diameter_cm = 6.0
        area_density = 0.0345

        lateral_area_cm2 = math.pi * diameter_cm * length_cm
        weight_g = lateral_area_cm2 * area_density

        results.append({
            "class_id": det.class_id,
            "class_name": det.class_name,
            "confidence": det.confidence,
            "bbox_xyxy": det.bbox_xyxy,
            "estimated_length_cm": length_cm,
            "estimated_weight_g": weight_g,
        })

    return {
        "num_detections": len(results),
        "results": results,
    }


# -------------------- SERVER --------------------

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False
    )
