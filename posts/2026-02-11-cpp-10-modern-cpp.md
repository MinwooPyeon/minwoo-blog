---
title: "[C++] 10장. 모던 C++ — 람다, 범위, 구조적 바인딩"
date: 2026-02-11 09:00:00 +0900
categories: [C++, 모던C++]
tags: [cpp, lambda, c++17, c++20, 범위for]
author: minwoo
series: "C++ 시리즈"
---

## 람다 표현식

```cpp
// 기본 형태: [캡처](매개변수) -> 반환타입 { 본문 }
auto add = [](int a, int b) -> int { return a + b; };
std::cout << add(3, 4) << std::endl;  // 7

// 반환 타입 추론 (단순한 경우 생략 가능)
auto square = [](double x) { return x * x; };

// 캡처
int threshold = 50;

// [=]: 값으로 모두 캡처
auto is_over = [=](int v) { return v > threshold; };

// [&]: 참조로 모두 캡처
int count = 0;
auto count_over = [&](int v) { if (v > threshold) count++; };

// [threshold]: 특정 변수만 값으로 캡처
auto check = [threshold](int v) { return v > threshold; };

std::vector<int> data = {30, 60, 45, 80, 20};
std::for_each(data.begin(), data.end(), count_over);
std::cout << "임계값 초과 개수: " << count << std::endl;  // 2
```

---

## 람다 + STL 알고리즘

```cpp
std::vector<SensorData> sensors = { /* ... */ };

// 특정 조건 정렬
std::sort(sensors.begin(), sensors.end(),
    [](const SensorData &a, const SensorData &b) {
        return a.value > b.value;  // 내림차순
    });

// 조건 검색
auto it = std::find_if(sensors.begin(), sensors.end(),
    [](const SensorData &s) { return s.value > 100.0f; });

// 변환
std::vector<float> values;
std::transform(sensors.begin(), sensors.end(),
               std::back_inserter(values),
               [](const SensorData &s) { return s.value; });

// 조건 필터 (C++20 ranges)
auto high_vals = sensors | std::views::filter(
    [](const SensorData &s) { return s.value > 50.0f; });
```

---

## 구조적 바인딩 (C++17)

```cpp
// pair / tuple 분해
std::pair<int, std::string> p = {1, "sensor_a"};
auto [id, name] = p;
std::cout << id << " " << name << std::endl;

// map 순회
std::map<std::string, float> readings = {
    {"temp", 25.3f}, {"humid", 60.0f}
};
for (const auto &[key, val] : readings) {
    std::cout << key << ": " << val << std::endl;
}

// 함수에서 여러 값 반환
std::pair<float, float> get_min_max(const std::vector<float> &v) {
    auto [mn, mx] = std::minmax_element(v.begin(), v.end());
    return {*mn, *mx};
}

auto [min_val, max_val] = get_min_max({1.0f, 5.0f, 3.0f});
```

---

## std::optional (C++17)

값이 없을 수 있는 상황:

```cpp
#include <optional>

std::optional<float> read_sensor(int pin) {
    if (pin < 0 || pin > 15) return std::nullopt;
    return hardware_read(pin);
}

if (auto val = read_sensor(5)) {
    std::cout << "센서값: " << *val << std::endl;
} else {
    std::cout << "읽기 실패\n";
}

// 기본값 제공
float v = read_sensor(99).value_or(0.0f);
```

---

## constexpr — 컴파일 타임 계산

```cpp
constexpr int    BAUD_RATE = 9600;
constexpr double PI        = 3.14159265;

constexpr int factorial(int n) {
    return (n <= 1) ? 1 : n * factorial(n - 1);
}

constexpr int fact5 = factorial(5);  // 컴파일 타임 계산 → 120
static_assert(fact5 == 120);         // 컴파일 타임 검증

// constexpr if (C++17)
template <typename T>
constexpr auto to_bytes(T val) {
    if constexpr (sizeof(T) == 1) return val;
    else return __builtin_bswap32(val);
}
```

---

## std::variant (C++17)

타입 안전한 union:

```cpp
#include <variant>

using SensorValue = std::variant<int, float, std::string>;

SensorValue v = 25.3f;

std::visit([](auto &&val) {
    std::cout << val << std::endl;
}, v);

v = "error";
if (std::holds_alternative<std::string>(v)) {
    std::cout << "오류: " << std::get<std::string>(v) << std::endl;
}
```

---

## 정리

- 람다 + STL 알고리즘 조합이 현대 C++ 핵심 스타일
- 구조적 바인딩으로 pair/tuple/map 순회 간결화
- `std::optional`로 null 반환을 타입 안전하게 표현
- `constexpr`로 컴파일 타임 상수 및 함수 정의
- `std::variant`로 타입 안전한 union 대체
