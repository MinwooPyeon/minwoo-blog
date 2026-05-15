---
title: "[C언어] 4장. 배열과 문자열"
date: 2026-01-08 09:00:00 +0900
categories: [C언어, 기초]
tags: [c, 배열, 문자열, string.h]
author: minwoo
series: "C언어 시리즈"
---

## 1차원 배열

```c
// 선언과 초기화
int scores[5] = {90, 85, 78, 92, 88};

// 크기를 자동으로 결정
int data[] = {1, 2, 3, 4, 5};  // 크기 5

// 배열 크기 구하기
int size = sizeof(data) / sizeof(data[0]);  // 5

// 순회
for (int i = 0; i < size; i++) {
    printf("data[%d] = %d\n", i, data[i]);
}
```

> 배열은 0-indexed. `data[size]`는 범위를 벗어난 접근으로 미정의 동작(UB)입니다.

---

## 2차원 배열

```c
// 3행 4열 행렬
int matrix[3][4] = {
    {1, 2,  3,  4},
    {5, 6,  7,  8},
    {9, 10, 11, 12}
};

// 행 우선(row-major) 저장
printf("%d\n", matrix[1][2]);  // 7

// 2D 배열 순회
for (int r = 0; r < 3; r++) {
    for (int c = 0; c < 4; c++) {
        printf("%3d ", matrix[r][c]);
    }
    printf("\n");
}
```

임베디드 활용 예 — 이미지 픽셀 버퍼:

```c
#define WIDTH  320
#define HEIGHT 240

uint8_t frame_buf[HEIGHT][WIDTH];

// 특정 영역 클리어
for (int y = 0; y < HEIGHT; y++) {
    for (int x = 0; x < WIDTH; x++) {
        frame_buf[y][x] = 0;
    }
}
```

---

## 문자열

C에서 문자열은 `char` 배열이며, 끝에 null 문자(`'\0'`)가 있습니다:

```c
char name[] = "Minwoo";    // {'M','i','n','w','o','o','\0'}
char buf[20] = {0};        // 20바이트, 전부 0으로 초기화

printf("길이: %zu\n", sizeof(name) - 1);  // 6 (null 제외)
```

---

## string.h 주요 함수

```c
#include <string.h>

char src[] = "Hello";
char dst[20];

// 복사
strcpy(dst, src);           // dst = "Hello"
strncpy(dst, src, 3);       // dst = "Hel" (안전한 복사)

// 이어 붙이기
strcat(dst, " World");      // "Hello World"

// 길이
size_t len = strlen(src);   // 5

// 비교 (같으면 0)
if (strcmp(src, "Hello") == 0) {
    printf("같음\n");
}

// 검색
char *pos = strchr(src, 'l');   // 'l'의 첫 위치 포인터
char *sub = strstr(src, "ell"); // 부분 문자열 위치
```

---

## sprintf / snprintf

문자열 포맷팅 (임베디드 LCD, UART 출력에 유용):

```c
char buf[64];
float temp = 25.3f;
int   hum  = 60;

// snprintf: 버퍼 오버플로 방지 (크기 지정)
snprintf(buf, sizeof(buf), "Temp: %.1f C, Hum: %d%%", temp, hum);
uart_send(buf);
```

---

## 배열을 함수에 전달

```c
// 배열의 합 계산
int sum_array(const int *arr, int size) {
    int total = 0;
    for (int i = 0; i < size; i++) {
        total += arr[i];
    }
    return total;
}

int nums[] = {1, 2, 3, 4, 5};
printf("합: %d\n", sum_array(nums, 5));  // 15
```

---

## 정리

- C 문자열은 null-terminated `char` 배열
- `strcpy` 대신 `strncpy`, `sprintf` 대신 `snprintf` 사용 (버퍼 오버플로 방지)
- 2D 배열은 row-major 순서로 메모리에 연속 저장
- 배열을 함수에 넘길 때 크기 정보를 항상 함께 전달
