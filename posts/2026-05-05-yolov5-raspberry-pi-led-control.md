---
title: "YOLOv5 + Raspberry Pi로 사람 감지 LED 제어 시스템 구축하기"
date: 2026-05-05 09:00:00 +0900
categories: [프로젝트, 컴퓨터비전]
tags: [yolov5, raspberry-pi, opencv, serial, python, 캡스톤]
author: minwoo
---

## 프로젝트 개요

캡스톤 디자인 프로젝트로 **YOLOv5 객체 탐지 모델**을 Raspberry Pi에 올려  
사람이 탐지되면 Arduino로 신호를 보내 LED를 제어하는 시스템을 구축했습니다.

```
[카메라] → [Raspberry Pi: YOLOv5 추론] → [Serial] → [Arduino: LED ON/OFF]
```

---

## 시스템 구성

| 컴포넌트 | 사양 |
|---|---|
| MCU | Raspberry Pi 4 |
| 카메라 | USB 웹캠 |
| AI 모델 | YOLOv5s (PyTorch) |
| 통신 | UART Serial (9600 baud) |
| 제어 대상 | Arduino + LED |

---

## 핵심 코드

### 객체 탐지 함수

```python
import torch
import cv2
import serial

seri = serial.Serial(port='/dev/ttyUSB0', baudrate=9600,
                     parity=serial.PARITY_NONE,
                     stopbits=serial.STOPBITS_ONE,
                     bytesize=serial.EIGHTBITS)

model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

def detect_object(image):
    results = model(image)
    detections = results.xyxy[0].cpu().numpy()
    object_classes = []

    for detection in detections:
        class_id = int(detection[5])
        confidence = detection[4]
        if confidence > 0.2:
            object_classes.append(class_id)

    return object_classes
```

### 메인 루프

```python
def main():
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        object_classes = detect_object(frame)

        # class_id 0 = person (COCO dataset)
        if 0 in object_classes:
            send_to_arduino(0)  # LED ON
        else:
            send_to_arduino(1)  # LED OFF

        cv2.imshow('Object Detection', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
```

---

## 겪은 문제와 해결

### 1. 시리얼 포트 경로 오류

`/dev/USB0`로 작성했다가 포트를 열지 못하는 오류 발생.  
Linux USB 시리얼 포트는 `/dev/ttyUSB0`가 올바른 경로입니다.

### 2. YOLOv5에 그레이스케일 이미지 전달 오류

처리 속도를 위해 grayscale로 변환 후 모델에 넘겼더니 에러 발생.  
YOLOv5는 **3채널 BGR 입력**을 요구하므로 원본 frame을 그대로 전달해야 합니다.

### 3. 추론 속도 (Raspberry Pi 4 기준)

YOLOv5s 기준 약 **2~3 FPS** 수준. 실시간 제어보다는  
Threading으로 탐지 루프를 분리해 UI와 추론을 병렬 처리했습니다.

---

## 결과

- 사람이 프레임에 들어오면 0.5초 이내 LED ON
- 다중 플랫폼 지원: PC, Raspberry Pi 4/5, Jetson Nano

---

## 전체 소스코드

[GitHub - Capstone](https://github.com/MinwooPyeon/Capstone)
