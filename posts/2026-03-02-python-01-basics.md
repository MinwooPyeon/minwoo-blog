---
title: "[Python] 1장. 기초 문법 — 자료형, 변수, 연산자"
date: 2026-03-02 09:00:00 +0900
categories: [Python, 기초]
tags: [python, 자료형, 변수, 연산자]
author: minwoo
series: "Python 시리즈"
---

## Python의 특징

- 동적 타이핑: 변수 선언 시 타입 지정 불필요
- 들여쓰기로 블록 구분 (중괄호 없음)
- GIL(Global Interpreter Lock)로 멀티스레딩 제한
- 임베디드 상위 소프트웨어, AI/CV 분야에 널리 사용

---

## 기본 자료형

```python
# 정수
x = 42
big = 1_000_000  # 가독성을 위한 언더스코어

# 실수
pi = 3.14159
sci = 1.5e-3  # 0.0015

# 불리언
is_active = True
is_error  = False

# 문자열
name = "편민우"
msg  = '임베디드 개발자'
multi = """여러 줄
문자열"""

# None (값 없음)
result = None

# 타입 확인
print(type(x))      # <class 'int'>
print(type(pi))     # <class 'float'>
print(type(name))   # <class 'str'>
```

---

## 타입 변환

```python
# 명시적 변환
i = int("42")        # 42
f = float("3.14")    # 3.14
s = str(255)         # "255"
b = bool(0)          # False (0, "", None, [], {} → False)

# 진수 변환
print(bin(255))   # '0b11111111'
print(hex(255))   # '0xff'
print(oct(255))   # '0o377'

# int에서 다른 진수
print(int("ff", 16))   # 255
print(int("1010", 2))  # 10
```

---

## 연산자

```python
# 산술
print(10 // 3)   # 3   (정수 나눗셈)
print(10 %  3)   # 1   (나머지)
print(2  ** 8)   # 256 (거듭제곱)

# 비교 (연속 비교 가능!)
x = 5
print(1 < x < 10)   # True
print(0 <= x <= 5)  # True

# 논리
print(True  and False)  # False
print(True  or  False)  # True
print(not   True)       # False

# 비트 (임베디드 레지스터 제어)
reg = 0b00000000
reg |=  (1 << 3)   # 비트 SET    → 0b00001000
reg &= ~(1 << 3)   # 비트 CLEAR  → 0b00000000
reg ^=  (1 << 3)   # 비트 TOGGLE
print(f"reg = {reg:#010b}")

# 멤버십 / 동일성
lst = [1, 2, 3]
print(2 in lst)       # True
print(5 not in lst)   # True

a = None
print(a is None)      # True (동일 객체 비교)
```

---

## 변수와 할당

```python
# 다중 할당
a, b, c = 1, 2, 3
x = y = z = 0

# 값 교환 (임시 변수 불필요!)
a, b = b, a

# 증감 (++, -- 없음)
x += 1
x -= 1
x *= 2
x //= 3

# 언패킹
first, *rest = [1, 2, 3, 4, 5]
print(first)  # 1
print(rest)   # [2, 3, 4, 5]
```

---

## 문자열 포맷팅

```python
name  = "편민우"
temp  = 25.3
hum   = 60

# f-string (Python 3.6+, 권장)
print(f"이름: {name}, 온도: {temp:.1f}°C, 습도: {hum}%")

# format()
print("온도: {:.2f}, 습도: {:d}".format(temp, hum))

# % 포맷 (구식)
print("온도: %.1f" % temp)

# 자릿수 맞추기
print(f"{42:08b}")      # 00101010 (8자리 2진수)
print(f"{255:#010x}")   # 0x000000ff
print(f"{name:>10}")    # 오른쪽 정렬
```

---

## 정리

- Python은 동적 타이핑 — 자료형이 자동으로 결정
- `//`: 정수 나눗셈, `**`: 거듭제곱, `%`: 나머지
- 연속 비교 `1 < x < 10` 지원
- f-string이 가장 간결하고 빠른 문자열 포맷팅 방법
- 비트 연산자는 C와 동일 (`|`, `&`, `^`, `~`, `<<`, `>>`)
