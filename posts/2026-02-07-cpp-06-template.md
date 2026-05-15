---
title: "[C++] 6장. 템플릿"
date: 2026-02-07 09:00:00 +0900
categories: [C++, 제네릭]
tags: [cpp, template, 제네릭, 함수템플릿, 클래스템플릿]
author: minwoo
series: "C++ 시리즈"
---

## 함수 템플릿

타입에 관계없이 동작하는 제네릭 함수:

```cpp
template <typename T>
T max_val(T a, T b) {
    return (a > b) ? a : b;
}

std::cout << max_val(3, 7)        << std::endl;  // 7 (int)
std::cout << max_val(3.14, 2.71)  << std::endl;  // 3.14 (double)
std::cout << max_val('a', 'z')    << std::endl;  // z (char)

// 명시적 타입 지정
std::cout << max_val<float>(3, 7) << std::endl;  // 7.0 (float)
```

```cpp
// 배열 합계 (타입 + 크기 템플릿)
template <typename T, size_t N>
T sum(const T (&arr)[N]) {
    T total = T{};
    for (const auto &v : arr) total += v;
    return total;
}

int   i[] = {1, 2, 3, 4, 5};
float f[] = {1.1f, 2.2f, 3.3f};
std::cout << sum(i) << std::endl;  // 15
std::cout << sum(f) << std::endl;  // 6.6
```

---

## 클래스 템플릿

```cpp
template <typename T, size_t N>
class RingBuffer {
    T      data[N];
    size_t head = 0;
    size_t tail = 0;
    size_t count = 0;

public:
    bool push(const T &val) {
        if (count == N) return false;  // 가득 참
        data[tail] = val;
        tail = (tail + 1) % N;
        count++;
        return true;
    }

    bool pop(T &val) {
        if (count == 0) return false;  // 비어 있음
        val  = data[head];
        head = (head + 1) % N;
        count--;
        return true;
    }

    size_t size()  const { return count; }
    bool   empty() const { return count == 0; }
    bool   full()  const { return count == N; }
};

// 사용 예
RingBuffer<int, 8>    int_buf;
RingBuffer<uint8_t, 64> uart_rx_buf;

int_buf.push(10);
int_buf.push(20);

int val;
int_buf.pop(val);
std::cout << val << std::endl;  // 10
```

---

## 템플릿 특수화

특정 타입에 대한 별도 구현:

```cpp
template <typename T>
class Printer {
public:
    void print(const T &v) {
        std::cout << v << std::endl;
    }
};

// bool 타입 특수화
template <>
class Printer<bool> {
public:
    void print(const bool &v) {
        std::cout << (v ? "true" : "false") << std::endl;
    }
};

Printer<int>  pi; pi.print(42);     // 42
Printer<bool> pb; pb.print(true);   // true
```

---

## 가변 인자 템플릿 (Variadic Template)

```cpp
// 재귀 종료
void log() { std::cout << std::endl; }

// 가변 인자 로그
template <typename T, typename... Args>
void log(T first, Args... rest) {
    std::cout << first << " ";
    log(rest...);
}

log("센서값:", 25.3f, "습도:", 60, "%");
// 출력: 센서값: 25.3 습도: 60 %
```

---

## type_traits 활용

```cpp
#include <type_traits>

template <typename T>
void process(T val) {
    if constexpr (std::is_integral_v<T>) {
        std::cout << "정수: " << val << std::endl;
    } else if constexpr (std::is_floating_point_v<T>) {
        std::cout << "실수: " << std::fixed << val << std::endl;
    } else {
        std::cout << "기타 타입\n";
    }
}

process(42);    // 정수: 42
process(3.14);  // 실수: 3.140000
```

---

## 정리

- 함수 템플릿으로 타입 중복 코드 제거
- 클래스 템플릿으로 자료구조 제네릭화 (RingBuffer, Queue, Stack 등)
- `if constexpr`로 컴파일 타임 분기 (런타임 오버헤드 없음)
- 임베디드에서 크기 고정 컨테이너(`template <size_t N>`)로 동적 할당 없이 제네릭 자료구조 구현
