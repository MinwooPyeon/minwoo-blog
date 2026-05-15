---
title: "[Python] 9장. 모듈과 패키지"
date: 2026-03-10 09:00:00 +0900
categories: [Python, 고급]
tags: [python, 모듈, 패키지, import, 가상환경]
author: minwoo
series: "Python 시리즈"
---

## 모듈

```python
# sensor_utils.py
"""센서 관련 유틸리티 모듈"""

DEFAULT_TIMEOUT = 1.0

def read(pin: int) -> float:
    return hardware_read(pin)

def calibrate(value: float, offset: float = 0.0) -> float:
    return value + offset

class SensorConfig:
    def __init__(self, pin: int, interval: float = 1.0):
        self.pin = pin
        self.interval = interval
```

```python
# main.py
import sensor_utils                      # 모듈 전체
from sensor_utils import read, calibrate # 특정 항목
from sensor_utils import SensorConfig as SC  # 별칭

val = sensor_utils.read(4)
val = read(4)
cfg = SC(pin=4, interval=0.5)

# __name__ 가드
if __name__ == "__main__":
    print("직접 실행")
```

---

## 패키지 구조

```
sensors/
├── __init__.py
├── base.py
├── temperature.py
├── humidity.py
└── utils/
    ├── __init__.py
    └── calibration.py
```

```python
# sensors/__init__.py
from .temperature import TemperatureSensor
from .humidity    import HumiditySensor

__all__ = ["TemperatureSensor", "HumiditySensor"]
__version__ = "1.0.0"
```

```python
# sensors/temperature.py
from .base import BaseSensor

class TemperatureSensor(BaseSensor):
    def read(self) -> float:
        raw = self._hardware_read()
        return self._calibrate(raw)
```

```python
# 사용
from sensors import TemperatureSensor
from sensors.utils.calibration import linear_calibrate
```

---

## 가상환경

프로젝트별 독립적인 패키지 환경:

```bash
# 가상환경 생성
python -m venv .venv

# 활성화 (Mac/Linux)
source .venv/bin/activate

# 활성화 (Windows)
.venv\Scripts\activate

# 패키지 설치
pip install numpy opencv-python pyserial

# 의존성 저장
pip freeze > requirements.txt

# 의존성 설치
pip install -r requirements.txt

# 가상환경 종료
deactivate
```

---

## 주요 표준 라이브러리

```python
import os
import sys
import pathlib
import datetime
import logging
import argparse
import struct
import hashlib

# os: 환경 변수, 파일 시스템
port = os.environ.get("SERIAL_PORT", "/dev/ttyUSB0")
os.makedirs("/tmp/logs", exist_ok=True)

# struct: 바이너리 패킹 (시리얼 통신에 유용)
packed   = struct.pack(">HBf", 0x1234, 0xFF, 3.14)  # big-endian
unpacked = struct.unpack(">HBf", packed)

# logging
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)
logger.info("시스템 시작")
logger.error("센서 오류: %s", "timeout")

# argparse: CLI 인수 처리
parser = argparse.ArgumentParser(description="센서 데이터 수집")
parser.add_argument("--port",     default="/dev/ttyUSB0")
parser.add_argument("--baud",     type=int, default=9600)
parser.add_argument("--interval", type=float, default=1.0)
parser.add_argument("--debug",    action="store_true")
args = parser.parse_args()
```

---

## importlib — 동적 임포트

```python
import importlib

# 플랫폼에 따라 다른 모듈 로드
platform = "raspberry_pi"
driver = importlib.import_module(f"drivers.{platform}")
driver.init()
```

---

## 정리

- 모듈 = `.py` 파일, 패키지 = `__init__.py`가 있는 디렉토리
- `if __name__ == "__main__":` 으로 직접 실행 / 임포트 구분
- 가상환경으로 프로젝트별 의존성 격리 → `requirements.txt`로 공유
- `logging`으로 `print` 대신 레벨별 로그 관리
- `struct`로 시리얼 통신 바이너리 패킷 파싱
