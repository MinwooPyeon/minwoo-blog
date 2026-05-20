---
title: "[C++] 3장. 생성자와 소멸자"
date: 2026-02-04 09:00:00 +0900
categories: [C++, 객체지향]
tags: [cpp, 생성자, 소멸자, 복사생성자, RAII]
author: minwoo
series: "C++ 시리즈"
description: "생성자 본문보다 초기화 리스트를 사용하는 것이 효율적입니다:"
---

## 생성자 종류

```cpp
class Buffer {
    uint8_t *data;
    size_t   size;

public:
    // 기본 생성자
    Buffer() : data(nullptr), size(0) {}

    // 매개변수 생성자
    explicit Buffer(size_t sz)
        : data(new uint8_t[sz]()), size(sz) {}

    // 복사 생성자
    Buffer(const Buffer &other)
        : data(new uint8_t[other.size]), size(other.size) {
        memcpy(data, other.data, size);
    }

    // 이동 생성자 (C++11)
    Buffer(Buffer &&other) noexcept
        : data(other.data), size(other.size) {
        other.data = nullptr;
        other.size = 0;
    }

    // 소멸자
    ~Buffer() {
        delete[] data;
    }
};
```

---

## 초기화 리스트

생성자 본문보다 초기화 리스트를 사용하는 것이 효율적입니다:

```cpp
class Sensor {
    const int   pin;   // const는 초기화 리스트에서만 설정 가능
    std::string name;
    float       value;

public:
    // 좋은 예: 초기화 리스트
    Sensor(int p, std::string n)
        : pin(p), name(std::move(n)), value(0.0f) {}

    // 나쁜 예: 본문에서 대입 (name이 기본 생성 후 대입)
    Sensor(int p, std::string n) {
        // pin = p;  // 오류! const 멤버는 대입 불가
        name  = n;  // 기본 생성 + 복사 대입 = 비효율
        value = 0.0f;
    }
};
```

---

## explicit 키워드

암시적 변환 방지:

```cpp
class Voltage {
    float volts;
public:
    explicit Voltage(float v) : volts(v) {}
    float get() const { return volts; }
};

void process(Voltage v) { /* ... */ }

process(3.3f);          // 오류! 암시적 변환 불가
process(Voltage(3.3f)); // OK
```

---

## RAII (Resource Acquisition Is Initialization)

C++의 핵심 자원 관리 패턴입니다. 생성자에서 자원 획득, 소멸자에서 자원 해제:

```cpp
class FileHandle {
    FILE *fp;

public:
    explicit FileHandle(const char *path, const char *mode)
        : fp(fopen(path, mode)) {
        if (!fp) throw std::runtime_error("파일 열기 실패");
    }

    ~FileHandle() {
        if (fp) fclose(fp);  // 예외 발생 시에도 자동 해제
    }

    FILE *get() const { return fp; }

    // 복사 금지
    FileHandle(const FileHandle &) = delete;
    FileHandle &operator=(const FileHandle &) = delete;
};

void read_config() {
    FileHandle f("config.txt", "r");  // 스코프 종료 시 자동 fclose
    // 예외가 발생해도 소멸자가 호출됨
}
```

---

## 복사 / 이동 시맨틱

```cpp
Buffer a(100);         // 생성자
Buffer b = a;          // 복사 생성자 (깊은 복사)
Buffer c = std::move(a); // 이동 생성자 (a의 자원 탈취, a는 빈 상태)

// a는 이제 사용 불가 (data == nullptr)
```

---

## Rule of Five (C++11)

소멸자를 정의했다면 나머지 4개도 정의해야 합니다:

```cpp
class Resource {
public:
    ~Resource();                             // 소멸자
    Resource(const Resource &);              // 복사 생성자
    Resource &operator=(const Resource &);   // 복사 대입
    Resource(Resource &&) noexcept;          // 이동 생성자
    Resource &operator=(Resource &&) noexcept; // 이동 대입
};
```

단, 스마트 포인터를 사용하면 이 5가지를 직접 구현할 필요가 없습니다 (**Rule of Zero**).

---

## 정리

- `explicit` 생성자로 의도치 않은 암시적 변환 방지
- 초기화 리스트 사용으로 `const` 멤버 초기화 및 성능 향상
- RAII 패턴으로 자원 누수 없는 안전한 코드 작성
- 동적 자원을 관리한다면 Rule of Five 구현 필수
