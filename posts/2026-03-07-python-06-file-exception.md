---
title: "[Python] 6장. 파일 입출력과 예외 처리"
date: 2026-03-07 09:00:00 +0900
categories: [Python, 파일]
tags: [python, 파일, 예외처리, json, csv]
author: minwoo
series: "Python 시리즈"
description: "설정 파일, 센서 데이터 직렬화에 활용:"
---

## 예외 처리

```python
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"오류: {e}")
except (TypeError, ValueError) as e:
    print(f"타입/값 오류: {e}")
except Exception as e:
    print(f"기타 오류: {type(e).__name__}: {e}")
else:
    print("예외 없이 성공")   # try가 성공했을 때만 실행
finally:
    print("항상 실행")        # 예외 여부 무관

# 예외 발생
def read_pin(pin: int) -> float:
    if not 0 <= pin <= 27:
        raise ValueError(f"유효하지 않은 핀 번호: {pin}")
    return hardware_read(pin)
```

### 사용자 정의 예외

```python
class SensorError(Exception):
    def __init__(self, code: int, msg: str):
        super().__init__(msg)
        self.code = code

class TimeoutError(SensorError):
    pass

try:
    raise TimeoutError(-1, "I2C 타임아웃")
except SensorError as e:
    print(f"[{e.code}] {e}")
```

---

## 파일 입출력

```python
# with 구문: 자동으로 close() 호출 (RAII)
with open("log.txt", "w", encoding="utf-8") as f:
    f.write("온도: 25.3°C\n")
    f.write("습도: 60%\n")

# 읽기
with open("log.txt", "r", encoding="utf-8") as f:
    content = f.read()         # 전체 읽기
    # lines = f.readlines()    # 줄 리스트
    # line  = f.readline()     # 한 줄

# 줄 단위 순회
with open("log.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())

# 파일에 추가
with open("log.txt", "a") as f:
    f.write("압력: 1013hPa\n")
```

---

## JSON

설정 파일, 센서 데이터 직렬화에 활용:

```python
import json

# 쓰기
config = {
    "device": "Raspberry Pi 4",
    "sensors": [
        {"name": "DHT22", "pin": 4, "interval": 1.0},
        {"name": "BMP280", "pin": "I2C", "interval": 0.5}
    ],
    "debug": False
}

with open("config.json", "w") as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

# 읽기
with open("config.json", "r") as f:
    loaded = json.load(f)

print(loaded["sensors"][0]["name"])  # DHT22

# 문자열 직렬화/역직렬화
json_str = json.dumps(config, ensure_ascii=False)
data = json.loads(json_str)
```

---

## CSV

```python
import csv

# 쓰기
rows = [
    ["timestamp", "temperature", "humidity"],
    [1000, 25.3, 60.1],
    [2000, 26.0, 58.5],
    [3000, 24.8, 62.3]
]

with open("sensor_log.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(rows)

# 읽기
with open("sensor_log.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(f"온도: {row['temperature']} 습도: {row['humidity']}")
```

---

## pathlib

파일 경로를 객체지향으로 처리:

```python
from pathlib import Path

base = Path("/home/pi/logs")
log_file = base / "sensor.log"

# 파일 존재 확인
if not log_file.exists():
    log_file.parent.mkdir(parents=True, exist_ok=True)
    log_file.touch()

# 읽기/쓰기
log_file.write_text("데이터\n", encoding="utf-8")
content = log_file.read_text(encoding="utf-8")

# 파일 목록
for f in base.glob("*.log"):
    print(f.name, f.stat().st_size)
```

---

## 정리

- `with open(...)` 으로 항상 자동 close (RAII)
- `try-except-else-finally` 4단계로 완전한 예외 처리
- JSON은 설정 파일, CSV는 센서 로그에 적합
- `pathlib.Path`로 경로 처리를 안전하게 (문자열 조작 없이)
