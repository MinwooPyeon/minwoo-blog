---
title: "[Python] 8장. 멀티스레딩과 동시성"
date: 2026-03-09 09:00:00 +0900
categories: [Python, 동시성]
tags: [python, threading, queue, asyncio, concurrent]
author: minwoo
series: "Python 시리즈"
description: "Python의 GIL(Global Interpreter Lock)으로 인해 CPU 집약적 작업은 멀티스레딩으로 속도 향상이 안 됩니다:"
---

## threading 기본

```python
import threading
import time

def read_sensor(pin: int, interval: float, stop_event: threading.Event):
    while not stop_event.is_set():
        val = hardware_read(pin)
        print(f"[{threading.current_thread().name}] GPIO{pin}: {val:.2f}")
        time.sleep(interval)

stop = threading.Event()

t1 = threading.Thread(target=read_sensor, args=(4, 1.0, stop), name="TempSensor")
t2 = threading.Thread(target=read_sensor, args=(5, 0.5, stop), name="HumSensor", daemon=True)

t1.start()
t2.start()

time.sleep(5)
stop.set()    # 종료 신호
t1.join()     # t1 종료 대기
```

---

## GIL과 멀티스레딩

Python의 GIL(Global Interpreter Lock)으로 인해 CPU 집약적 작업은 멀티스레딩으로 속도 향상이 안 됩니다:

| 작업 유형 | 멀티스레딩 | 멀티프로세싱 |
|---|---|---|
| I/O 대기 (파일, 네트워크, 시리얼) | ✓ 효과적 | 오버헤드 |
| CPU 집약 (계산, 이미지처리) | ✗ GIL | ✓ 효과적 |

---

## Thread-safe Queue

```python
import queue

data_queue: queue.Queue[tuple[int, float]] = queue.Queue(maxsize=100)

def producer():
    for pin in [4, 5, 6]:
        val = hardware_read(pin)
        data_queue.put((pin, val))  # block until space available

def consumer():
    while True:
        try:
            pin, val = data_queue.get(timeout=1.0)
            process(pin, val)
            data_queue.task_done()
        except queue.Empty:
            break

t_prod = threading.Thread(target=producer)
t_cons = threading.Thread(target=consumer)

t_prod.start()
t_cons.start()
t_prod.join()
data_queue.join()  # 모든 항목 처리 대기
```

---

## Lock — 경쟁 조건 방지

```python
class SharedBuffer:
    def __init__(self):
        self._data: list[float] = []
        self._lock = threading.Lock()

    def add(self, val: float):
        with self._lock:   # 자동 acquire/release
            self._data.append(val)

    def get_all(self) -> list[float]:
        with self._lock:
            return self._data.copy()

buf = SharedBuffer()
```

---

## concurrent.futures

고수준 API:

```python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import requests

# I/O 작업 — ThreadPoolExecutor
urls = ["http://api.example.com/sensor/1",
        "http://api.example.com/sensor/2"]

with ThreadPoolExecutor(max_workers=4) as executor:
    futures = [executor.submit(requests.get, url) for url in urls]
    results = [f.result() for f in futures]

# CPU 작업 — ProcessPoolExecutor
import numpy as np

def compute_fft(data: list) -> list:
    return np.fft.fft(data).tolist()

datasets = [list(range(1024)) for _ in range(8)]

with ProcessPoolExecutor() as executor:
    ffts = list(executor.map(compute_fft, datasets))
```

---

## asyncio — 비동기 I/O

```python
import asyncio
import aiofiles

async def read_sensor_async(pin: int) -> tuple[int, float]:
    await asyncio.sleep(0.01)   # 비동기 대기
    return pin, hardware_read(pin)

async def fetch_all():
    tasks = [read_sensor_async(p) for p in [4, 5, 6]]
    results = await asyncio.gather(*tasks)  # 동시 실행
    for pin, val in results:
        print(f"GPIO{pin}: {val:.2f}")

asyncio.run(fetch_all())

# 비동기 파일 쓰기
async def log_data(filename: str, data: str):
    async with aiofiles.open(filename, "a") as f:
        await f.write(data + "\n")
```

---

## 실전 — 임베디드 센서 + 통신 병렬 처리

```python
import threading, queue, serial, time

class SensorSystem:
    def __init__(self, port: str):
        self._queue: queue.Queue = queue.Queue()
        self._serial = serial.Serial(port, 9600)
        self._stop = threading.Event()

    def _reader_thread(self):
        while not self._stop.is_set():
            val = read_all_sensors()
            self._queue.put(val)
            time.sleep(0.1)

    def _writer_thread(self):
        while not self._stop.is_set():
            try:
                data = self._queue.get(timeout=1.0)
                self._serial.write(str(data).encode())
            except queue.Empty:
                continue

    def start(self):
        threading.Thread(target=self._reader_thread, daemon=True).start()
        threading.Thread(target=self._writer_thread, daemon=True).start()

    def stop(self):
        self._stop.set()
```

---

## 정리

- I/O 대기 작업: `threading` 또는 `asyncio`
- CPU 집약 작업: `multiprocessing`
- 스레드 간 데이터 공유: `queue.Queue` (thread-safe)
- `Lock`으로 공유 자원 보호, `Event`로 스레드 종료 신호
