# backend/deepface/face_compare.py
from deepface import DeepFace
import sys
import json

def compare_faces(img1_path, img2_path):
    try:
        result = DeepFace.verify(img1_path, img2_path)
        similarity = (1 - result['distance']) * 100
        return {"similarity": similarity, "verified": result['verified']}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    img1 = sys.argv[1]
    img2 = sys.argv[2]
    result = compare_faces(img1, img2)
    print(json.dumps(result))
