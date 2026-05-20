---
title: "[C언어] 5장. 포인터 기초"
date: 2026-01-09 09:00:00 +0900
categories: [C언어, 포인터]
tags: [c, 포인터, 메모리, 주소]
author: minwoo
series: "C언어 시리즈"
description: "포인터는 다른 변수의 메모리 주소를 저장하는 변수입니다. 임베디드에서 레지스터 직접 접근, 동적 메모리 관리 등에 필수입니다."
---

## 포인터란?

포인터는 **다른 변수의 메모리 주소를 저장하는 변수**입니다. 임베디드에서 레지스터 직접 접근, 동적 메모리 관리 등에 필수입니다.

```c
int  val = 42;
int *ptr = &val;   // ptr은 val의 주소를 담음

printf("val의 값:  %d\n",  val);    // 42
printf("val의 주소: %p\n", &val);   // 0x7fff...
printf("ptr이 담은 주소: %p\n", ptr);   // 동일 주소
printf("ptr이 가리키는 값: %d\n", *ptr); // 42 (역참조)
```

---

## 선언 문법

```c
int  *p;    // int를 가리키는 포인터
char *cp;   // char를 가리키는 포인터
float *fp;  // float를 가리키는 포인터
void  *vp;  // 아무 타입이나 가리킬 수 있는 포인터
```

---

## & 연산자와 * 연산자

```c
int x = 10;
int *p = &x;   // & : 주소 연산자 (address-of)

*p = 20;       // * : 역참조 연산자 (dereference)
printf("%d\n", x);  // 20 — p를 통해 x 값 변경됨
```

---

## 포인터와 함수 — 값 교환

```c
void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int x = 3, y = 7;
swap(&x, &y);
printf("x=%d, y=%d\n", x, y);  // x=7, y=3
```

---

## 포인터와 배열

배열 이름은 첫 번째 원소의 주소입니다:

```c
int arr[] = {10, 20, 30, 40, 50};
int *p = arr;      // &arr[0]과 동일

printf("%d\n", *p);      // 10
printf("%d\n", *(p+1));  // 20
printf("%d\n", *(p+2));  // 30

// 포인터로 배열 순회
for (int i = 0; i < 5; i++) {
    printf("%d ", *(p + i));
}
```

---

## 포인터 타입과 크기

```c
int    *pi; // 4바이트 단위 이동
char   *pc; // 1바이트 단위 이동
double *pd; // 8바이트 단위 이동

int arr[] = {1, 2, 3};
int *p = arr;
p++;  // 주소 += sizeof(int) = 4바이트 이동
```

---

## const 포인터

```c
int x = 10, y = 20;

const int *p1 = &x;  // 값 변경 불가 (읽기 전용)
// *p1 = 30;         // 오류!
p1 = &y;             // 주소 변경은 가능

int *const p2 = &x;  // 주소 변경 불가
*p2 = 30;            // 값 변경은 가능
// p2 = &y;          // 오류!

const int *const p3 = &x;  // 둘 다 불가
```

함수 매개변수에서 `const int *` 는 "이 값은 수정하지 않겠다"는 계약입니다:

```c
void print_array(const int *arr, int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
}
```

---

## NULL 포인터

```c
int *p = NULL;  // 아무 곳도 가리키지 않음

// 역참조 전 항상 NULL 체크
if (p != NULL) {
    printf("%d\n", *p);
}
```

> NULL 포인터를 역참조하면 즉시 프로그램이 충돌합니다(Segmentation Fault). 임베디드에서는 시스템 리셋으로 이어집니다.

---

## 임베디드 활용 — 레지스터 직접 접근

```c
// 특정 메모리 주소를 포인터로 접근 (MMIO)
#define GPIO_BASE  0x40020C00
#define GPIO_ODR   (*(volatile uint32_t *)(GPIO_BASE + 0x14))

GPIO_ODR |= (1 << 5);   // 5번 핀 HIGH
GPIO_ODR &= ~(1 << 5);  // 5번 핀 LOW
```

---

## 정리

- `&`: 주소 가져오기, `*`: 역참조 (값 가져오기)
- 배열 이름 = 첫 번째 원소 주소
- `const int *` 은 값 보호, `int *const` 는 주소 고정
- 역참조 전 항상 NULL 체크
- 임베디드에서 MMIO 레지스터 접근에 `volatile` 포인터 사용
