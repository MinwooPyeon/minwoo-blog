---
title: "[Python] 10장. 임베디드 연동 라이브러리 — serial, OpenCV, NumPy"
date: 2026-03-11 09:00:00 +0900
categories: [Python, 임베디드]
tags: [python, pyserial, opencv, numpy, 임베디드]
author: minwoo
series: "Python 시리즈"
description: "Python은 임베디드 상위 소프트웨어(HMI, 데이터 처리, AI 추론)에서 C/C++과 시리얼로 연동하는 구조가 일반적입니다."
---

## pyserial — 시리얼 통신

```python
import serial
import time

# 포트 열기
ser = serial.Serial(
    port     = "/dev/ttyUSB0",  # Windows: "COM4"
    baudrate = 9600,
    parity   = serial.PARITY_NONE,
    stopbits = serial.STOPBITS_ONE,
    bytesize = serial.EIGHTBITS,
    timeout  = 1.0
)

# 데이터 송신
def send_command(cmd: str):
    data = (cmd + "\n").encode("ascii")
    ser.write(data)
    print(f"송신: {cmd}")

# 데이터 수신 (줄 단위)
def read_line() -> str | None:
    if ser.in_waiting:
        return ser.readline().decode("ascii").strip()
    return None

# 사용
send_command("LED0")          # Arduino에 LED ON 명령
time.sleep(0.1)
response = read_line()        # 응답 읽기
print(f"수신: {response}")

ser.close()
```

### 컨텍스트 매니저로 안전하게

```python
with serial.Serial("/dev/ttyUSB0", 9600, timeout=1) as ser:
    ser.write(b"STATUS\n")
    resp = ser.readline()
    print(resp.decode().strip())
```

---

## NumPy — 수치 연산

```python
import numpy as np

# 배열 생성
arr = np.array([1, 2, 3, 4, 5], dtype=np.float32)
mat = np.zeros((3, 4), dtype=np.uint8)
rng = np.arange(0, 10, 0.5)    # 0~9.5, step=0.5
lin = np.linspace(0, 1, 100)   # 0~1을 100등분

# 브로드캐스팅 — 벡터 연산
sensor_vals = np.array([25.3, 26.1, 24.8, 25.9])
normalized  = (sensor_vals - sensor_vals.mean()) / sensor_vals.std()

# 통계
print(sensor_vals.mean())   # 평균
print(sensor_vals.std())    # 표준편차
print(sensor_vals.max())    # 최댓값
print(np.percentile(sensor_vals, 95))  # 95 백분위수

# 이동 평균 (센서 노이즈 제거)
def moving_average(data: np.ndarray, window: int) -> np.ndarray:
    kernel = np.ones(window) / window
    return np.convolve(data, kernel, mode="valid")

raw   = np.random.normal(25, 2, 100)  # 노이즈 있는 데이터
smooth = moving_average(raw, window=5)

# FFT — 주파수 분석
signal = np.sin(2 * np.pi * 10 * np.linspace(0, 1, 1000))
freqs  = np.fft.fftfreq(len(signal), d=1/1000)
fft    = np.abs(np.fft.fft(signal))
dominant_freq = freqs[np.argmax(fft[:len(fft)//2])]
print(f"주파수: {dominant_freq:.1f} Hz")
```

---

## OpenCV — 컴퓨터 비전

```python
import cv2
import numpy as np

# 카메라 열기
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret: break

    # 색공간 변환
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    hsv  = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # 가우시안 블러 (노이즈 제거)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # 엣지 검출
    edges = cv2.Canny(blurred, 100, 200)

    # 이진화 (임계값)
    _, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

    # 컨투어 찾기
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL,
                                    cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > 500:
            x, y, w, h = cv2.boundingRect(cnt)
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

    # 텍스트 오버레이
    cv2.putText(frame, f"Objects: {len(contours)}", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow("Camera", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
```

---

## YOLOv5 + pyserial 연동 (Capstone 패턴)

```python
import torch
import cv2
import serial

model = torch.hub.load("ultralytics/yolov5", "yolov5s")
ser   = serial.Serial("/dev/ttyUSB0", 9600, timeout=1)

def detect_and_control(frame: np.ndarray) -> list[int]:
    results = model(frame)
    detections = results.xyxy[0].cpu().numpy()
    classes = [int(d[5]) for d in detections if d[4] > 0.2]
    return classes

cap = cv2.VideoCapture(0)
while True:
    ret, frame = cap.read()
    if not ret: break

    classes = detect_and_control(frame)

    cmd = "LED0\n" if 0 in classes else "LED1\n"  # 0=person
    ser.write(cmd.encode("ascii"))

    cv2.imshow("Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
ser.close()
```

---

## 정리

| 라이브러리 | 용도 |
|---|---|
| `pyserial` | UART 시리얼 통신 (Arduino, MCU) |
| `numpy` | 수치 연산, 신호 처리, FFT |
| `opencv-python` | 이미지/영상 처리, 컴퓨터 비전 |
| `torch` / `torchvision` | 딥러닝 모델 추론 |
| `RPi.GPIO` | Raspberry Pi GPIO 제어 |
| `smbus2` | I2C 통신 (Raspberry Pi) |

Python은 임베디드 상위 소프트웨어(HMI, 데이터 처리, AI 추론)에서 C/C++과 시리얼로 연동하는 구조가 일반적입니다.
