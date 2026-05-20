---
title: "[C언어] 8장. 동적 메모리 할당"
date: 2026-01-12 09:00:00 +0900
categories: [C언어, 메모리]
tags: [c, malloc, free, 메모리누수, 동적할당]
author: minwoo
series: "C언어 시리즈"
description: "임베디드에서 malloc은 여러 이유로 주의가 필요합니다:"
---

## 정적 vs 동적 메모리

| 구분 | 정적 할당 | 동적 할당 |
|---|---|---|
| 시점 | 컴파일 타임 | 런타임 |
| 위치 | 스택(Stack) | 힙(Heap) |
| 크기 | 컴파일 시 고정 | 실행 중 결정 |
| 해제 | 자동 | 수동 (`free`) |

---

## malloc / calloc / realloc / free

```c
#include <stdlib.h>

// malloc: 초기화 없이 할당
int *arr = (int *)malloc(10 * sizeof(int));

// calloc: 0으로 초기화하여 할당
int *arr2 = (int *)calloc(10, sizeof(int));

// 항상 NULL 체크
if (arr == NULL) {
    fprintf(stderr, "메모리 할당 실패\n");
    return -1;
}

// 사용
for (int i = 0; i < 10; i++) {
    arr[i] = i * 2;
}

// realloc: 크기 변경
arr = (int *)realloc(arr, 20 * sizeof(int));

// 반드시 해제
free(arr);
arr = NULL;  // dangling pointer 방지
```

---

## 메모리 누수 (Memory Leak)

```c
// 나쁜 예: 할당 후 free 없음
void bad_function(void) {
    int *p = (int *)malloc(100 * sizeof(int));
    // ... 사용 후 free 없이 반환
    // 함수가 끝나도 힙 메모리는 해제되지 않음!
}

// 좋은 예
void good_function(void) {
    int *p = (int *)malloc(100 * sizeof(int));
    if (p == NULL) return;

    // 사용
    p[0] = 42;

    free(p);    // 반드시 해제
    p = NULL;
}
```

---

## 동적 2D 배열

```c
int rows = 3, cols = 4;

// int* 배열 할당 후 각 행 할당
int **matrix = (int **)malloc(rows * sizeof(int *));
for (int i = 0; i < rows; i++) {
    matrix[i] = (int *)malloc(cols * sizeof(int));
}

// 사용
matrix[1][2] = 99;

// 해제: 역순으로
for (int i = 0; i < rows; i++) {
    free(matrix[i]);
}
free(matrix);
matrix = NULL;
```

---

## 동적 구조체

```c
typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node *create_node(int val) {
    Node *node = (Node *)malloc(sizeof(Node));
    if (node == NULL) return NULL;
    node->data = val;
    node->next = NULL;
    return node;
}

// 연결 리스트 생성
Node *head = create_node(1);
head->next = create_node(2);
head->next->next = create_node(3);

// 순회 및 해제
Node *cur = head;
while (cur != NULL) {
    Node *tmp = cur->next;
    printf("%d ", cur->data);
    free(cur);
    cur = tmp;
}
```

---

## 임베디드에서 동적 메모리

임베디드에서 `malloc`은 여러 이유로 주의가 필요합니다:

```c
// 문제점
// 1. 힙 단편화 (Heap Fragmentation)
// 2. 비결정적 실행 시간 (RTOS에서 문제)
// 3. 실패 시 처리가 어려움

// 대안: 정적 메모리 풀 (Memory Pool)
#define POOL_SIZE 16

typedef struct {
    uint8_t buf[64];
    int     in_use;
} Block;

static Block pool[POOL_SIZE];

Block *pool_alloc(void) {
    for (int i = 0; i < POOL_SIZE; i++) {
        if (!pool[i].in_use) {
            pool[i].in_use = 1;
            return &pool[i];
        }
    }
    return NULL;  // 풀 소진
}

void pool_free(Block *b) {
    b->in_use = 0;
}
```

---

## 정리

- `malloc` → `NULL` 체크 → 사용 → `free` → `NULL` 대입: 필수 패턴
- `calloc`은 0 초기화가 필요할 때 사용
- 동적 2D 배열은 행 포인터 배열 + 각 행 별도 할당
- 임베디드에서는 동적 할당 대신 **정적 메모리 풀** 패턴 권장
