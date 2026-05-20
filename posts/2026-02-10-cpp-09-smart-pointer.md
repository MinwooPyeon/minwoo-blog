---
title: "[C++] 9장. 스마트 포인터"
date: 2026-02-10 09:00:00 +0900
categories: [C++, 메모리]
tags: [cpp, unique_ptr, shared_ptr, 스마트포인터, RAII]
author: minwoo
series: "C++ 시리즈"
description: "여러 포인터가 같은 객체를 공유합니다 (참조 카운팅):"
---

## 왜 스마트 포인터인가?

```cpp
// 나쁜 예: 수동 메모리 관리
void bad() {
    int *p = new int(42);
    if (some_condition()) return;  // 메모리 누수!
    delete p;
}

// 좋은 예: 스마트 포인터
void good() {
    auto p = std::make_unique<int>(42);
    if (some_condition()) return;  // 자동 해제
}
```

---

## unique_ptr — 단독 소유권

```cpp
#include <memory>

// 생성 (make_unique 권장)
auto p = std::make_unique<int>(42);
std::cout << *p << std::endl;  // 42

// 배열
auto arr = std::make_unique<float[]>(10);
arr[0] = 3.14f;

// 소유권 이전 (복사 불가, 이동만 가능)
auto q = std::move(p);   // p → q로 소유권 이전
// p는 이제 nullptr

// 커스텀 deleter
auto gpio = std::unique_ptr<GPIO, decltype(&gpio_close)>(
    gpio_open(13), gpio_close);

// 클래스에서 사용
class Robot {
    std::unique_ptr<Motor>  motor;
    std::unique_ptr<Sensor> sensor;
public:
    Robot()
        : motor(std::make_unique<Motor>(255))
        , sensor(std::make_unique<TemperatureSensor>("DHT22")) {}
};
```

---

## shared_ptr — 공유 소유권

여러 포인터가 같은 객체를 공유합니다 (참조 카운팅):

```cpp
auto a = std::make_shared<int>(100);
auto b = a;  // 복사 — 참조 카운트 2

std::cout << a.use_count() << std::endl;  // 2
std::cout << *b << std::endl;  // 100

{
    auto c = a;  // 참조 카운트 3
    std::cout << a.use_count() << std::endl;  // 3
}  // c 소멸 → 참조 카운트 2

// 마지막 shared_ptr 소멸 시 자동 delete
```

### weak_ptr — 순환 참조 방지

```cpp
class Node {
public:
    std::shared_ptr<Node> next;
    std::weak_ptr<Node>   prev;  // weak_ptr로 순환 방지
    int data;
    Node(int d) : data(d) {}
};

auto n1 = std::make_shared<Node>(1);
auto n2 = std::make_shared<Node>(2);

n1->next = n2;
n2->prev = n1;  // weak_ptr이므로 순환 참조 없음

// weak_ptr 사용
if (auto locked = n2->prev.lock()) {  // 객체 살아있는지 확인
    std::cout << locked->data << std::endl;  // 1
}
```

---

## unique_ptr vs shared_ptr 선택

| | `unique_ptr` | `shared_ptr` |
|---|---|---|
| 소유자 | 1개 | 여러 개 |
| 오버헤드 | 없음 | 참조 카운팅 |
| 복사 | 불가 | 가능 |
| 용도 | 일반적 단독 소유 | 여러 객체 공유 |

**기본적으로 `unique_ptr`을 사용하고, 공유가 필요할 때만 `shared_ptr`**

---

## 팩토리 패턴과 unique_ptr

```cpp
class ISensor { public: virtual ~ISensor() {} };
class TempSensor  : public ISensor {};
class HumidSensor : public ISensor {};

std::unique_ptr<ISensor> create_sensor(const std::string &type) {
    if (type == "temp")  return std::make_unique<TempSensor>();
    if (type == "humid") return std::make_unique<HumidSensor>();
    return nullptr;
}

auto sensor = create_sensor("temp");
// sensor 스코프 종료 시 자동 소멸
```

---

## 정리

- `unique_ptr`: 단독 소유, 오버헤드 없음 → 기본 선택
- `shared_ptr`: 공유 소유, 참조 카운팅 오버헤드 있음
- `weak_ptr`: 순환 참조 방지, `lock()`으로 임시 소유
- `make_unique` / `make_shared` 사용 → 예외 안전 + 효율적
- Rule of Zero: 스마트 포인터 사용 시 소멸자/복사/이동 직접 구현 불필요
