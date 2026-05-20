---
title: "[Python] 2장. 제어문과 반복문"
date: 2026-03-03 09:00:00 +0900
categories: [Python, 기초]
tags: [python, if, for, while, comprehension]
author: minwoo
series: "Python 시리즈"
description: "- range(start, stop, step)으로 다양한 숫자 시퀀스 생성 - enumerate로 인덱스 + 값 동시에, zip으로 두 시퀀스 병렬 순회 - 리스트 컴프리헨션으로 간결하고 빠른 리스트 생성 - for-else는 검색 루프에서 '못 찾은 경우' 처..."
---

## 조건문

```python
temperature = 35

if temperature >= 40:
    print("위험: 과열")
elif temperature >= 30:
    print("경고: 고온")
elif temperature >= 20:
    print("정상")
else:
    print("저온")

# 한 줄 삼항
status = "HIGH" if temperature >= 30 else "NORMAL"

# match-case (Python 3.10+)
match temperature:
    case t if t >= 40:
        print("과열")
    case t if t >= 20:
        print("정상")
    case _:
        print("저온")
```

---

## for 반복문

```python
# range
for i in range(5):          # 0~4
    print(i, end=" ")

for i in range(2, 10, 2):  # 2, 4, 6, 8
    print(i, end=" ")

for i in range(10, 0, -1): # 10~1 역순
    print(i, end=" ")

# 시퀀스 순회
sensors = ["DHT22", "BMP280", "MPU6050"]
for sensor in sensors:
    print(f"센서: {sensor}")

# enumerate: 인덱스 + 값
for i, sensor in enumerate(sensors, start=1):
    print(f"{i}. {sensor}")

# zip: 두 시퀀스 동시 순회
pins  = [2, 3, 4]
modes = ["INPUT", "OUTPUT", "OUTPUT"]
for pin, mode in zip(pins, modes):
    print(f"GPIO{pin}: {mode}")
```

---

## while 반복문

```python
# 기본
count = 0
while count < 5:
    print(count)
    count += 1

# 임베디드 메인 루프 패턴
import time

def main_loop():
    while True:
        data = read_sensors()
        process(data)
        send_uart(data)
        time.sleep(0.1)   # 100ms 대기
```

---

## break / continue / else

```python
# break
for i in range(10):
    if i == 5:
        break
    print(i, end=" ")   # 0 1 2 3 4

# continue
for i in range(10):
    if i % 2 == 0:
        continue
    print(i, end=" ")   # 1 3 5 7 9

# for-else: 루프가 break 없이 정상 종료 시 실행
target = 7
for i in range(10):
    if i == target:
        print(f"{target} 찾음")
        break
else:
    print("못 찾음")
```

---

## 리스트 컴프리헨션

```python
# 기본
squares = [x ** 2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 조건 필터
evens = [x for x in range(20) if x % 2 == 0]
# [0, 2, 4, ..., 18]

# 중첩
matrix = [[i * j for j in range(4)] for i in range(3)]
# [[0,0,0,0],[0,1,2,3],[0,2,4,6]]

# 딕셔너리 컴프리헨션
sensor_map = {f"GPIO{i}": 0 for i in range(8)}
# {'GPIO0': 0, 'GPIO1': 0, ..., 'GPIO7': 0}

# 셋 컴프리헨션
unique = {x % 5 for x in range(20)}
# {0, 1, 2, 3, 4}

# 제너레이터 표현식 (메모리 효율)
total = sum(x ** 2 for x in range(1000))
```

---

## 중첩 루프 — 2D 센서 그리드

```python
grid = [
    [10, 20, 15],
    [25, 35, 40],
    [ 5, 10, 55]
]

# 최댓값 찾기
max_val = 0
max_pos = (0, 0)

for r, row in enumerate(grid):
    for c, val in enumerate(row):
        if val > max_val:
            max_val = val
            max_pos = (r, c)

print(f"최댓값 {max_val}은 위치 {max_pos}")
```

---

## 정리

- `range(start, stop, step)`으로 다양한 숫자 시퀀스 생성
- `enumerate`로 인덱스 + 값 동시에, `zip`으로 두 시퀀스 병렬 순회
- 리스트 컴프리헨션으로 간결하고 빠른 리스트 생성
- `for-else`는 검색 루프에서 "못 찾은 경우" 처리에 유용
