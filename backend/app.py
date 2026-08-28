from deepface import DeepFace
import cv2

# Start webcam
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Cannot open webcam")
    exit()

frame_count = 0
DETECTOR_BACKEND = 'retinaface'

def map_emotion(emotion):
    # Map DeepFace emotions to your 3 categories
    if emotion == 'happy':
        return 'happy'
    elif emotion in ['sad', 'angry', 'fear', 'disgust']:
        return 'sad'
    elif emotion == 'surprise':
        return 'scary'
    else:
        return 'neutral'

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.resize(frame, (640, 480))
    frame_count += 1

    if frame_count % 3 == 0:
        try:
            result = DeepFace.analyze(
                img_path=frame,
                actions=['emotion'],
                enforce_detection=False,
                detector_backend=DETECTOR_BACKEND
            )

            if isinstance(result, list):
                # multiple faces
                face_results = result
            else:
                face_results = [result]

            for res in face_results:
                x, y, w, h = res['region']['x'], res['region']['y'], res['region']['w'], res['region']['h']
                emotion = map_emotion(res['dominant_emotion'])
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0,255,0), 2)
                cv2.putText(frame, emotion, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,0), 2)

        except Exception as e:
            cv2.putText(frame, "No face detected", (50,50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2)

    cv2.imshow("Emotion Detector", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()