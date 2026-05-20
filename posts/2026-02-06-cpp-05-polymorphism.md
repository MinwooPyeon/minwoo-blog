---
title: "[C++] 5장. 다형성과 가상 함수"
date: 2026-02-06 09:00:00 +0900
categories: [C++, 객체지향]
tags: [cpp, 다형성, virtual, 순수가상함수, 인터페이스]
author: minwoo
series: "C++ 시리즈"
description: "순수 가상 함수가 하나라도 있으면 추상 클래스 — 객체 직접 생성 불가:"
---

## 가상 함수와 동적 바인딩

```cpp
class Actuator {
public:
    virtual void activate() {
        std::cout << "Actuator 기본 동작\n";
    }
    virtual ~Actuator() {}
};

class LED : public Actuator {
    int pin;
public:
    LED(int p) : pin(p) {}
    void activate() override {
        std::cout << "LED[" << pin << "] ON\n";
    }
};

class Buzzer : public Actuator {
public:
    void activate() override {
        std::cout << "Buzzer BEEP\n";
    }
};

class Motor : public Actuator {
    int speed;
public:
    Motor(int s) : speed(s) {}
    void activate() override {
        std::cout << "Motor 회전 speed=" << speed << "\n";
    }
};

// 기반 클래스 포인터로 파생 클래스 다루기
std::vector<Actuator *> devices = {
    new LED(13),
    new Buzzer(),
    new Motor(200)
};

for (auto *d : devices) {
    d->activate();  // 런타임에 올바른 함수 호출 (동적 바인딩)
}

for (auto *d : devices) delete d;
```

---

## 순수 가상 함수와 추상 클래스

순수 가상 함수가 하나라도 있으면 추상 클래스 — 객체 직접 생성 불가:

```cpp
class ISensor {  // 인터페이스
public:
    virtual float read()  = 0;  // 순수 가상 함수
    virtual void  reset() = 0;
    virtual std::string name() const = 0;
    virtual ~ISensor() {}
};

class AnalogSensor : public ISensor {
    int   adc_pin;
    float scale;
public:
    AnalogSensor(int pin, float scale)
        : adc_pin(pin), scale(scale) {}

    float read() override {
        return analogRead(adc_pin) * scale;
    }
    void reset() override { /* ADC 리셋 */ }
    std::string name() const override { return "AnalogSensor"; }
};

// ISensor s;  // 오류! 추상 클래스는 인스턴스화 불가
ISensor *s = new AnalogSensor(A0, 3.3f / 1023.0f);
std::cout << s->read() << std::endl;
delete s;
```

---

## vtable 동작 원리

가상 함수는 vtable(가상 함수 테이블)을 통해 동작합니다:

```
[LED 객체]
  ├─ vptr ──→ [LED vtable]
  │              ├─ activate → LED::activate()
  │              └─ ~LED    → LED::~LED()
  └─ pin = 13

[Buzzer 객체]
  ├─ vptr ──→ [Buzzer vtable]
  │              ├─ activate → Buzzer::activate()
  │              └─ ~Buzzer  → Buzzer::~Buzzer()
```

이 때문에 기반 클래스 포인터로도 올바른 파생 클래스 함수가 호출됩니다.

---

## dynamic_cast

안전한 다운캐스팅:

```cpp
Actuator *a = new LED(5);

// dynamic_cast: 실패 시 nullptr 반환
LED *led = dynamic_cast<LED *>(a);
if (led != nullptr) {
    std::cout << "LED 타입 맞음\n";
}

// 참조에 dynamic_cast: 실패 시 std::bad_cast 예외
try {
    Motor &m = dynamic_cast<Motor &>(*a);
} catch (const std::bad_cast &e) {
    std::cout << "Motor 아님\n";
}

delete a;
```

---

## 인터페이스 패턴 (임베디드 적용)

```cpp
class ISerialPort {
public:
    virtual bool open(int baud) = 0;
    virtual void write(const uint8_t *buf, size_t len) = 0;
    virtual int  read(uint8_t *buf, size_t max_len) = 0;
    virtual void close() = 0;
    virtual ~ISerialPort() {}
};

class UARTPort : public ISerialPort { /* 실제 UART 구현 */ };
class MockPort : public ISerialPort { /* 테스트용 Mock 구현 */ };

// 함수는 인터페이스에만 의존 → 테스트 용이
void send_data(ISerialPort &port, const uint8_t *data, size_t len) {
    port.write(data, len);
}
```

---

## 정리

- `virtual` 함수 → 동적 바인딩 (런타임 결정)
- 순수 가상 함수(`= 0`)로 인터페이스 정의
- 기반 클래스 소멸자는 반드시 `virtual`
- `dynamic_cast`로 안전한 타입 변환
- 인터페이스 분리로 테스트와 교체가 쉬운 설계
