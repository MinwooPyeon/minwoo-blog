---
title: "[C++] 8장. 예외 처리"
date: 2026-02-09 09:00:00 +0900
categories: [C++, 고급]
tags: [cpp, 예외처리, try, catch, throw]
author: minwoo
series: "C++ 시리즈"
---

## 기본 예외 처리

```cpp
#include <stdexcept>

double divide(double a, double b) {
    if (b == 0.0)
        throw std::invalid_argument("0으로 나눌 수 없습니다");
    return a / b;
}

try {
    double result = divide(10.0, 0.0);
    std::cout << result << std::endl;
} catch (const std::invalid_argument &e) {
    std::cerr << "인수 오류: " << e.what() << std::endl;
} catch (const std::exception &e) {
    std::cerr << "예외: " << e.what() << std::endl;
} catch (...) {
    std::cerr << "알 수 없는 예외\n";
}
```

---

## 표준 예외 계층

```
std::exception
├── std::logic_error
│   ├── std::invalid_argument  ← 잘못된 인수
│   ├── std::out_of_range      ← 범위 초과
│   └── std::length_error
├── std::runtime_error
│   ├── std::overflow_error
│   ├── std::underflow_error
│   └── std::range_error
└── std::bad_alloc             ← new 실패 시
```

---

## 사용자 정의 예외

```cpp
class SensorError : public std::runtime_error {
    int error_code;

public:
    SensorError(int code, const std::string &msg)
        : std::runtime_error(msg), error_code(code) {}

    int code() const { return error_code; }
};

float read_sensor(int pin) {
    if (pin < 0 || pin > 15)
        throw SensorError(-1, "유효하지 않은 핀 번호");

    float val = hardware_read(pin);
    if (val < -100.0f || val > 200.0f)
        throw SensorError(-2, "센서값 범위 초과");

    return val;
}

try {
    float t = read_sensor(99);
} catch (const SensorError &e) {
    std::cerr << "센서 오류[" << e.code() << "]: " << e.what() << std::endl;
}
```

---

## noexcept

예외를 던지지 않는 함수에 명시합니다. 성능 최적화에 중요합니다:

```cpp
int add(int a, int b) noexcept { return a + b; }

// 이동 생성자에 noexcept가 없으면 STL이 복사 사용
class Buffer {
public:
    Buffer(Buffer &&other) noexcept { /* ... */ }
};
```

---

## RAII와 예외 안전성

예외 발생 시에도 자원이 안전하게 해제됩니다:

```cpp
void process_file(const std::string &path) {
    std::ifstream file(path);   // 스코프 종료 시 자동 close
    if (!file.is_open())
        throw std::runtime_error("파일 열기 실패: " + path);

    std::string line;
    while (std::getline(file, line)) {
        // 여기서 예외가 발생해도 file은 자동으로 닫힘
        process_line(line);
    }
}  // file 소멸자 자동 호출 → 안전
```

---

## 예외 vs 오류 코드 (임베디드 관점)

임베디드에서 예외는 스택 오버헤드와 비결정적 실행시간 때문에 제한적으로 사용됩니다:

```cpp
// 임베디드 친화적 오류 처리: 오류 코드 반환
enum class Status { OK, ERR_TIMEOUT, ERR_BUSY, ERR_FAULT };

Status i2c_read(uint8_t addr, uint8_t *buf, size_t len) {
    if (!wait_ready(100)) return Status::ERR_TIMEOUT;
    if (!start_transfer(addr)) return Status::ERR_BUSY;
    // ...
    return Status::OK;
}

Status s = i2c_read(0x48, buf, 2);
if (s != Status::OK) {
    handle_error(s);
}
```

---

## 정리

- `try`-`catch`-`throw`로 예외 처리, `catch(...)` 로 모든 예외 잡기
- 사용자 정의 예외는 `std::exception`을 상속
- `noexcept`로 예외 없음을 명시 → STL 최적화에 중요
- 임베디드에서는 예외 대신 오류 코드 + RAII 패턴 권장
