---
title: "[Python] 3장. 함수"
date: 2026-03-04 09:00:00 +0900
categories: [Python, 기초]
tags: [python, 함수, 인수, 데코레이터, 타입힌트]
author: minwoo
series: "Python 시리즈"
---

## 함수 기본

```python
def greet(name: str) -> str:
    return f"안녕하세요, {name}님!"

print(greet("편민우"))
```

---

## 매개변수 종류

```python
# 기본값 인수
def connect(host: str, port: int = 8080, timeout: float = 5.0) -> bool:
    print(f"연결: {host}:{port} (timeout={timeout}s)")
    return True

connect("192.168.0.1")            # 기본값 사용
connect("192.168.0.1", 9600)      # port 지정
connect("192.168.0.1", timeout=1.0)  # 키워드 인수

# 가변 인수
def log(*messages: str, level: str = "INFO") -> None:
    for msg in messages:
        print(f"[{level}] {msg}")

log("센서 초기화", "통신 연결", level="DEBUG")

# 키워드 가변 인수
def create_sensor(**kwargs):
    return {k: v for k, v in kwargs.items()}

s = create_sensor(name="DHT22", pin=4, interval=1.0)
print(s)  # {'name': 'DHT22', 'pin': 4, 'interval': 1.0}
```

---

## 반환값

```python
# 여러 값 반환 (tuple)
def read_dht22(pin: int) -> tuple[float, float]:
    temperature = 25.3
    humidity    = 60.1
    return temperature, humidity

temp, hum = read_dht22(4)

# None 반환
def send_uart(data: bytes) -> None:
    serial_port.write(data)
```

---

## 타입 힌트 (Type Hint)

```python
from typing import Optional, Union, List

def process(
    data: List[float],
    threshold: float = 50.0,
    label: Optional[str] = None
) -> dict[str, Union[float, bool]]:
    avg = sum(data) / len(data)
    return {
        "average": avg,
        "exceeded": avg > threshold,
        "label": label or "unnamed"
    }
```

---

## 람다

```python
# 간단한 익명 함수
square = lambda x: x ** 2
add    = lambda a, b: a + b

# 정렬 키로 활용
sensors = [("DHT22", 25.3), ("BMP280", 1013.0), ("MPU6050", 0.1)]
sensors.sort(key=lambda s: s[1])  # 값 기준 정렬
sensors.sort(key=lambda s: s[0])  # 이름 기준 정렬
```

---

## 일급 함수 — 함수를 인수로 전달

```python
def apply(func, data: list) -> list:
    return [func(x) for x in data]

print(apply(lambda x: x ** 2, [1, 2, 3, 4]))  # [1, 4, 9, 16]
print(apply(abs, [-3, -1, 2, -4]))            # [3, 1, 2, 4]

# map / filter / reduce
from functools import reduce

nums = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, nums))
evens   = list(filter(lambda x: x % 2 == 0, nums))
total   = reduce(lambda a, b: a + b, nums)
```

---

## 데코레이터

함수를 감싸서 기능을 추가합니다:

```python
import time
import functools

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} 실행 시간: {elapsed*1000:.2f}ms")
        return result
    return wrapper

def retry(max_attempts: int = 3, delay: float = 0.5):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    print(f"재시도 {attempt + 1}/{max_attempts}: {e}")
                    time.sleep(delay)
        return wrapper
    return decorator

@timer
@retry(max_attempts=3, delay=0.1)
def read_sensor(pin: int) -> float:
    # 센서 읽기 (실패할 수 있음)
    return hardware_read(pin)
```

---

## 정리

- `*args`: 가변 위치 인수, `**kwargs`: 가변 키워드 인수
- 타입 힌트로 코드 가독성과 IDE 지원 향상
- 데코레이터로 로깅, 타이밍, 재시도 등 횡단 관심사 처리
- `functools.wraps`로 원본 함수 메타데이터 보존
