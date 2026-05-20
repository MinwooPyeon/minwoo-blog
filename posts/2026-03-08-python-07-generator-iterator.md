---
title: "[Python] 7장. 제너레이터와 이터레이터"
date: 2026-03-08 09:00:00 +0900
categories: [Python, 고급]
tags: [python, generator, iterator, yield, lazy]
author: minwoo
series: "Python 시리즈"
description: "yield로 값을 하나씩 생성 — 메모리 효율적:"
---

## 이터레이터 프로토콜

```python
class CountDown:
    def __init__(self, start: int):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1

for n in CountDown(5):
    print(n, end=" ")  # 5 4 3 2 1
```

---

## 제너레이터 함수

`yield`로 값을 하나씩 생성 — 메모리 효율적:

```python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

gen = fibonacci()
for _ in range(10):
    print(next(gen), end=" ")  # 0 1 1 2 3 5 8 13 21 34

# 유한 제너레이터
def sensor_stream(count: int, interval: float = 0.1):
    import time
    for i in range(count):
        yield read_sensor(), time.time()
        time.sleep(interval)

for value, ts in sensor_stream(10):
    process(value, ts)
```

---

## yield from

제너레이터 위임:

```python
def read_all_sensors(pins: list[int]):
    for pin in pins:
        yield from read_pin_stream(pin)  # 각 핀 스트림 이어붙임

def read_pin_stream(pin: int):
    for _ in range(5):
        yield pin, hardware_read(pin)
```

---

## 제너레이터 표현식

리스트 컴프리헨션과 동일하지만 지연 평가:

```python
# 리스트: 전부 메모리에 올림
squares_list = [x**2 for x in range(1_000_000)]  # ~8MB

# 제너레이터: 필요할 때마다 계산
squares_gen = (x**2 for x in range(1_000_000))   # ~200B

# 대용량 파일 처리
def read_large_file(path: str):
    with open(path) as f:
        yield from f  # 한 줄씩 생성

total = sum(float(line.strip()) for line in read_large_file("data.txt"))
```

---

## itertools — 제너레이터 유틸리티

```python
import itertools

# count: 무한 카운터
for i in itertools.islice(itertools.count(0, 0.5), 5):
    print(i)  # 0, 0.5, 1.0, 1.5, 2.0

# chain: 여러 이터러블 연결
combined = list(itertools.chain([1,2], [3,4], [5,6]))
# [1, 2, 3, 4, 5, 6]

# groupby: 그룹화 (정렬 후 사용)
data = [("temp", 25), ("hum", 60), ("temp", 26), ("hum", 58)]
data.sort(key=lambda x: x[0])
for key, group in itertools.groupby(data, key=lambda x: x[0]):
    print(key, list(group))

# cycle: 순환
modes = itertools.cycle(["READ", "PROCESS", "SEND"])
for _ in range(6):
    print(next(modes), end=" ")  # READ PROCESS SEND READ PROCESS SEND

# batched (Python 3.12+): 배치 처리
for batch in itertools.batched(range(10), 3):
    print(list(batch))  # [0,1,2] [3,4,5] [6,7,8] [9]
```

---

## 양방향 통신 — send()

```python
def accumulator():
    total = 0
    while True:
        value = yield total  # send()로 값 수신
        if value is None:
            break
        total += value

gen = accumulator()
next(gen)          # 제너레이터 초기화
print(gen.send(10))  # 10
print(gen.send(20))  # 30
print(gen.send(5))   # 35
```

---

## 실전 — 센서 데이터 파이프라인

```python
def sensor_producer(pins: list[int]):
    while True:
        for pin in pins:
            yield pin, hardware_read(pin)

def filter_valid(stream, min_val=-100, max_val=200):
    for pin, val in stream:
        if min_val <= val <= max_val:
            yield pin, val

def moving_average(stream, window: int = 5):
    from collections import deque
    buffers: dict[int, deque] = {}
    for pin, val in stream:
        if pin not in buffers:
            buffers[pin] = deque(maxlen=window)
        buffers[pin].append(val)
        yield pin, sum(buffers[pin]) / len(buffers[pin])

# 파이프라인 구성
raw     = sensor_producer([2, 3, 4])
valid   = filter_valid(raw)
smoothed = moving_average(valid)

for pin, avg in itertools.islice(smoothed, 20):
    print(f"GPIO{pin}: {avg:.2f}")
```

---

## 정리

- 제너레이터: `yield`로 값을 하나씩 생성 → 대용량 데이터에 메모리 효율적
- `yield from`으로 제너레이터 위임
- `itertools`로 다양한 제너레이터 유틸리티 활용
- 제너레이터 파이프라인으로 데이터 처리 흐름을 단계적으로 구성
