---
title: "[C언어] 6장. 포인터 심화 — 이중 포인터, 함수 포인터"
date: 2026-01-10 09:00:00 +0900
categories: [C언어, 포인터]
tags: [c, 이중포인터, 함수포인터, 콜백]
author: minwoo
series: "C언어 시리즈"
description: "함수도 메모리에 저장되므로 포인터로 가리킬 수 있습니다:"
---

## 이중 포인터 (포인터의 포인터)

```c
int   val = 42;
int  *p   = &val;   // p는 val의 주소
int **pp  = &p;     // pp는 p의 주소

printf("%d\n", val);   // 42
printf("%d\n", *p);    // 42
printf("%d\n", **pp);  // 42

**pp = 100;
printf("%d\n", val);   // 100
```

### 이중 포인터와 문자열 배열

```c
const char *langs[] = {"C", "C++", "Python"};
const char **ptr = langs;

for (int i = 0; i < 3; i++) {
    printf("%s\n", ptr[i]);
}
```

### 함수 내에서 포인터 자체를 변경

```c
void allocate(int **pp, int size) {
    *pp = (int *)malloc(size * sizeof(int));
}

int *buf = NULL;
allocate(&buf, 10);  // buf가 가리키는 주소를 함수 내에서 변경
```

---

## 포인터 배열 vs 배열 포인터

```c
int a = 1, b = 2, c = 3;

// 포인터 배열: int*를 담는 배열
int *arr_of_ptr[3] = {&a, &b, &c};
printf("%d\n", *arr_of_ptr[1]);  // 2

// 배열 포인터: int[3]을 가리키는 포인터
int matrix[2][3] = {{1,2,3},{4,5,6}};
int (*ptr_to_arr)[3] = matrix;
printf("%d\n", ptr_to_arr[1][2]);  // 6
```

---

## 함수 포인터

함수도 메모리에 저장되므로 포인터로 가리킬 수 있습니다:

```c
int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

// 함수 포인터 선언: 반환타입 (*이름)(매개변수타입들)
int (*op)(int, int);

op = add;
printf("%d\n", op(10, 3));  // 13

op = sub;
printf("%d\n", op(10, 3));  // 7
```

### typedef로 가독성 향상

```c
typedef int (*MathOp)(int, int);

MathOp ops[] = {add, sub};
printf("%d\n", ops[0](10, 3));  // 13
printf("%d\n", ops[1](10, 3));  // 7
```

---

## 콜백 함수 패턴

함수 포인터를 매개변수로 넘겨 동작을 외부에서 주입합니다. 임베디드 인터럽트 핸들러, RTOS 태스크 등록에 널리 쓰입니다:

```c
typedef void (*ISR_Handler)(void);

void register_isr(int irq_num, ISR_Handler handler) {
    isr_table[irq_num] = handler;
}

// 인터럽트 발생 시 호출될 함수
void uart_rx_isr(void) {
    char c = UART_RX_REG;
    ring_buffer_push(&rx_buf, c);
}

register_isr(IRQ_UART, uart_rx_isr);
```

### qsort와 함수 포인터

```c
#include <stdlib.h>

int cmp_asc(const void *a, const void *b) {
    return (*(int*)a - *(int*)b);
}

int cmp_desc(const void *a, const void *b) {
    return (*(int*)b - *(int*)a);
}

int data[] = {5, 2, 8, 1, 9, 3};
int n = sizeof(data) / sizeof(data[0]);

qsort(data, n, sizeof(int), cmp_asc);
// {1, 2, 3, 5, 8, 9}

qsort(data, n, sizeof(int), cmp_desc);
// {9, 8, 5, 3, 2, 1}
```

---

## void 포인터 — 제네릭 포인터

타입에 관계없이 주소를 저장할 수 있습니다:

```c
void print_value(void *ptr, char type) {
    switch (type) {
        case 'i': printf("%d\n",   *(int *)ptr);   break;
        case 'f': printf("%.2f\n", *(float *)ptr); break;
        case 'c': printf("%c\n",   *(char *)ptr);  break;
    }
}

int   i = 42;
float f = 3.14f;
char  c = 'A';

print_value(&i, 'i');
print_value(&f, 'f');
print_value(&c, 'c');
```

---

## 정리

- 이중 포인터: 함수 내에서 포인터 자체를 수정하거나 2D 문자열 배열 처리에 활용
- 함수 포인터: 콜백, 상태 머신, 인터럽트 핸들러 등록에 핵심
- `typedef`로 함수 포인터 타입을 선언하면 가독성 크게 향상
- `void *`는 타입 독립적인 제네릭 처리에 사용
