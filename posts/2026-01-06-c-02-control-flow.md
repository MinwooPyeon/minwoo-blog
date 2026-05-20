---
title: "[C언어] 2장. 제어문 — if, switch, 반복문"
date: 2026-01-06 09:00:00 +0900
categories: [C언어, 기초]
tags: [c, if, switch, for, while]
author: minwoo
series: "C언어 시리즈"
description: "간단한 조건 분기에 사용합니다:"
---

## 조건문

### if / else if / else

```c
int temperature = 35;

if (temperature >= 40) {
    printf("위험: 과열\n");
} else if (temperature >= 30) {
    printf("경고: 고온\n");
} else if (temperature >= 20) {
    printf("정상\n");
} else {
    printf("저온\n");
}
```

### 삼항 연산자

간단한 조건 분기에 사용합니다:

```c
int led_state = (sensor_val > 100) ? 1 : 0;
```

### switch

여러 상수값 분기에 if-else보다 가독성이 좋습니다:

```c
typedef enum { MODE_IDLE, MODE_RUN, MODE_ERROR } SystemMode;

SystemMode mode = MODE_RUN;

switch (mode) {
    case MODE_IDLE:
        printf("대기 중\n");
        break;
    case MODE_RUN:
        printf("동작 중\n");
        break;
    case MODE_ERROR:
        printf("오류 발생\n");
        break;
    default:
        printf("알 수 없는 상태\n");
        break;
}
```

> `break` 없으면 다음 케이스로 fall-through 됩니다. 의도적인 경우가 아니면 반드시 `break` 추가.

---

## 반복문

### for

횟수가 정해진 반복:

```c
// 배열 순회
int data[5] = {10, 20, 30, 40, 50};
for (int i = 0; i < 5; i++) {
    printf("data[%d] = %d\n", i, data[i]);
}

// 역순 순회
for (int i = 4; i >= 0; i--) {
    printf("%d ", data[i]);
}
```

### while

조건 기반 반복 (임베디드 메인 루프):

```c
// 임베디드 메인 루프 패턴
while (1) {
    read_sensors();
    process_data();
    send_output();
    delay_ms(100);
}
```

### do-while

최소 1회 실행 보장:

```c
int input;
do {
    printf("1~10 사이 숫자 입력: ");
    scanf("%d", &input);
} while (input < 1 || input > 10);
```

---

## break / continue

```c
// break: 루프 즉시 탈출
for (int i = 0; i < 100; i++) {
    if (i == 5) break;  // i=5에서 종료
    printf("%d ", i);   // 0 1 2 3 4
}

// continue: 현재 이터레이션 건너뜀
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) continue;  // 짝수 건너뜀
    printf("%d ", i);           // 1 3 5 7 9
}
```

---

## 중첩 루프 예제 — 2D 센서 배열 스캔

```c
#define ROWS 3
#define COLS 4

int sensor_grid[ROWS][COLS] = {
    {10, 20, 15, 30},
    {25, 35, 40, 20},
    {5,  10, 55, 45}
};

int max_val = 0;
int max_r = 0, max_c = 0;

for (int r = 0; r < ROWS; r++) {
    for (int c = 0; c < COLS; c++) {
        if (sensor_grid[r][c] > max_val) {
            max_val = sensor_grid[r][c];
            max_r = r;
            max_c = c;
        }
    }
}
printf("최댓값: %d at [%d][%d]\n", max_val, max_r, max_c);
```

---

## 정리

- 임베디드 메인 루프는 `while(1)` 무한 루프가 표준 패턴
- `switch`는 상태 머신 구현에 특히 유용
- 중첩 루프 탈출 시 `goto`보다 플래그 변수 사용 권장
