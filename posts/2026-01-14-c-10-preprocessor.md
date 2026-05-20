---
title: "[C언어] 10장. 전처리기와 매크로"
date: 2026-01-14 09:00:00 +0900
categories: [C언어, 고급]
tags: [c, 전처리기, 매크로, define, ifdef]
author: minwoo
series: "C언어 시리즈"
description: "컴파일 전에 소스코드를 텍스트 변환하는 단계입니다. #으로 시작하는 지시어를 처리합니다."
---

## 전처리기란?

컴파일 전에 소스코드를 텍스트 변환하는 단계입니다. `#`으로 시작하는 지시어를 처리합니다.

```
소스코드 → [전처리기] → 전처리된 코드 → [컴파일러] → 오브젝트 파일
```

---

## #define

### 상수 정의

```c
#define MAX_SENSORS   8
#define PI            3.14159265f
#define BAUD_RATE     9600
#define GPIO_PIN_LED  13

int data[MAX_SENSORS];
float area = PI * r * r;
```

### 함수형 매크로

```c
#define MAX(a, b)       ((a) > (b) ? (a) : (b))
#define MIN(a, b)       ((a) < (b) ? (a) : (b))
#define ABS(x)          ((x) < 0 ? -(x) : (x))
#define ARRAY_SIZE(arr) (sizeof(arr) / sizeof((arr)[0]))

// 비트 조작 매크로
#define BIT_SET(reg, bit)    ((reg) |=  (1U << (bit)))
#define BIT_CLR(reg, bit)    ((reg) &= ~(1U << (bit)))
#define BIT_TGL(reg, bit)    ((reg) ^=  (1U << (bit)))
#define BIT_CHK(reg, bit)    ((reg) &   (1U << (bit)))
```

> 매크로 인수는 반드시 괄호로 감싸세요. `MAX(x+1, y)` → `((x+1) > (y) ...)` 이 돼야 합니다.

---

## 조건부 컴파일

플랫폼별, 디버그/릴리즈별 코드 분기에 사용합니다:

```c
// 디버그 로그
#ifdef DEBUG
    #define LOG(fmt, ...) printf("[DBG] " fmt "\n", ##__VA_ARGS__)
#else
    #define LOG(fmt, ...)  // 릴리즈에서는 빈 매크로
#endif

LOG("센서값: %d", sensor_val);  // DEBUG 정의 시에만 출력
```

```c
// 플랫폼 분기
#if defined(PLATFORM_RASPBERRY_PI)
    #define SERIAL_PORT "/dev/ttyUSB0"
#elif defined(PLATFORM_PC)
    #define SERIAL_PORT "COM4"
#else
    #error "PLATFORM이 정의되지 않았습니다"
#endif
```

---

## 헤더 가드 (Include Guard)

중복 포함 방지:

```c
// sensor.h
#ifndef SENSOR_H   // 처음 포함될 때만 처리
#define SENSOR_H

typedef struct { ... } SensorData;
void sensor_init(void);

#endif  // SENSOR_H

// 또는 #pragma once (비표준이지만 대부분 컴파일러 지원)
#pragma once
```

---

## 사전 정의 매크로

```c
printf("파일: %s\n",     __FILE__);   // 현재 파일명
printf("라인: %d\n",     __LINE__);   // 현재 줄 번호
printf("함수: %s\n",     __func__);   // 현재 함수명
printf("날짜: %s\n",     __DATE__);   // 컴파일 날짜
printf("시간: %s\n",     __TIME__);   // 컴파일 시간

// 에러 추적 매크로
#define ASSERT(expr) \
    do { \
        if (!(expr)) { \
            fprintf(stderr, "ASSERT 실패: %s (%s:%d)\n", \
                    #expr, __FILE__, __LINE__); \
            while(1); \
        } \
    } while(0)
```

---

## do-while(0) 패턴

여러 문장 매크로를 안전하게 감쌉니다:

```c
// 나쁜 예
#define INIT_LED(pin) \
    gpio_set_mode(pin, OUTPUT); \
    gpio_write(pin, LOW);

// if 조건에서 오동작
if (flag)
    INIT_LED(13);  // gpio_write는 항상 실행됨!

// 좋은 예: do-while(0)
#define INIT_LED(pin) \
    do { \
        gpio_set_mode(pin, OUTPUT); \
        gpio_write(pin, LOW); \
    } while(0)
```

---

## X-Macro 패턴 (고급)

반복 코드를 자동 생성합니다:

```c
// 오류 코드 목록 한 번만 정의
#define ERROR_LIST \
    X(ERR_OK,      0, "정상") \
    X(ERR_TIMEOUT, 1, "타임아웃") \
    X(ERR_BUSY,    2, "장치 사용 중") \
    X(ERR_FAULT,   3, "하드웨어 오류")

// enum 자동 생성
typedef enum {
#define X(name, val, str) name = val,
    ERROR_LIST
#undef X
} ErrorCode;

// 문자열 배열 자동 생성
const char *error_strings[] = {
#define X(name, val, str) str,
    ERROR_LIST
#undef X
};

printf("%s\n", error_strings[ERR_TIMEOUT]);  // "타임아웃"
```

---

## 정리

- 상수는 `#define` 또는 `const` 중 상황에 맞게 선택 (`const`가 타입 안전)
- 함수형 매크로는 인수를 괄호로 감싸고 `do-while(0)` 패턴 사용
- `#ifdef DEBUG`로 디버그/릴리즈 코드를 분리
- 헤더 파일에는 항상 include guard 추가
