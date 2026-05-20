---
title: "[Python] 4장. 자료구조 — 리스트, 튜플, 딕셔너리, 셋"
date: 2026-03-05 09:00:00 +0900
categories: [Python, 자료구조]
tags: [python, list, dict, tuple, set]
author: minwoo
series: "Python 시리즈"
description: "변경 불가능한 시퀀스 (불변 데이터, 함수 반환값에 적합):"
---

## 리스트

```python
# 생성
data = [10, 20, 30, 40, 50]
mixed = [1, "hello", 3.14, True]

# 인덱싱 / 슬라이싱
print(data[0])      # 10
print(data[-1])     # 50 (뒤에서 첫 번째)
print(data[1:4])    # [20, 30, 40]
print(data[::2])    # [10, 30, 50] (2 간격)
print(data[::-1])   # [50, 40, 30, 20, 10] (역순)

# 수정
data[0] = 99
data[1:3] = [200, 300]

# 주요 메서드
data.append(60)         # 뒤에 추가
data.extend([70, 80])   # 여러 개 추가
data.insert(0, -1)      # 인덱스 0에 삽입
data.remove(300)        # 값으로 제거
popped = data.pop()     # 마지막 제거 + 반환
data.sort()             # 정렬
data.sort(reverse=True) # 역순 정렬
data.reverse()          # 뒤집기
idx = data.index(99)    # 값의 인덱스
cnt = data.count(10)    # 값 개수

# 리스트 복사
shallow = data[:]       # 얕은 복사
import copy
deep = copy.deepcopy(data)  # 깊은 복사 (중첩 구조에 필요)
```

---

## 튜플

변경 불가능한 시퀀스 (불변 데이터, 함수 반환값에 적합):

```python
point  = (3, 4)
config = ("COM4", 9600, "8N1")

# 언패킹
x, y = point
port, baud, mode = config

# named tuple
from collections import namedtuple
SensorReading = namedtuple("SensorReading", ["name", "value", "unit"])
r = SensorReading("DHT22", 25.3, "°C")
print(r.name, r.value, r.unit)

# 단일 원소 튜플 (쉼표 필수!)
single = (42,)
```

---

## 딕셔너리

키-값 쌍 (Python 3.7+ 삽입 순서 유지):

```python
sensor = {
    "name":     "DHT22",
    "pin":      4,
    "interval": 1.0,
    "active":   True
}

# 접근
print(sensor["name"])           # DHT22
print(sensor.get("voltage", 3.3))  # 없으면 기본값 3.3

# 수정 / 추가 / 삭제
sensor["interval"] = 0.5
sensor["unit"] = "°C"
del sensor["active"]

# 순회
for key, val in sensor.items():
    print(f"{key}: {val}")

for key in sensor.keys():   print(key)
for val in sensor.values(): print(val)

# 딕셔너리 합치기 (Python 3.9+)
defaults = {"interval": 1.0, "active": True}
config   = {"interval": 0.5, "pin": 4}
merged   = defaults | config   # config가 우선

# defaultdict (키 없어도 기본값 생성)
from collections import defaultdict
counts = defaultdict(int)
for ch in "hello": counts[ch] += 1
```

---

## 셋 (Set)

중복 없는 집합:

```python
active_pins = {2, 3, 4, 5}
used_pins   = {3, 4, 7, 8}

# 집합 연산
print(active_pins & used_pins)   # 교집합: {3, 4}
print(active_pins | used_pins)   # 합집합: {2, 3, 4, 5, 7, 8}
print(active_pins - used_pins)   # 차집합: {2, 5}
print(active_pins ^ used_pins)   # 대칭차: {2, 5, 7, 8}

# 추가 / 제거
active_pins.add(6)
active_pins.discard(2)   # 없어도 오류 없음
active_pins.remove(3)    # 없으면 KeyError

# 중복 제거
data = [1, 2, 2, 3, 3, 3, 4]
unique = list(set(data))  # [1, 2, 3, 4] (순서 비보장)
```

---

## collections 모듈

```python
from collections import Counter, deque, OrderedDict

# Counter: 빈도 계산
readings = [10, 20, 10, 30, 10, 20]
cnt = Counter(readings)
print(cnt)              # Counter({10: 3, 20: 2, 30: 1})
print(cnt.most_common(2))  # [(10, 3), (20, 2)]

# deque: 양방향 큐 (링 버퍼)
buf = deque(maxlen=5)
for i in range(8):
    buf.append(i)
print(buf)   # deque([3, 4, 5, 6, 7], maxlen=5)

buf.appendleft(99)   # 왼쪽에 추가
buf.popleft()        # 왼쪽에서 제거
```

---

## 정리

| 자료구조 | 순서 | 중복 | 변경 | 특징 |
|---|---|---|---|---|
| list | ✓ | ✓ | ✓ | 범용 시퀀스 |
| tuple | ✓ | ✓ | ✗ | 불변, 빠름 |
| dict | ✓ (3.7+) | key 불가 | ✓ | 키-값 매핑 |
| set | ✗ | ✗ | ✓ | 집합 연산 |
