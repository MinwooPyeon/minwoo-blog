---
title: "[C++] 4장. 상속"
date: 2026-02-05 09:00:00 +0900
categories: [C++, 객체지향]
tags: [cpp, 상속, 기반클래스, 파생클래스, override]
author: minwoo
series: "C++ 시리즈"
---

## 상속 기본

```cpp
// 기반 클래스 (Base)
class Sensor {
protected:
    std::string name;
    float       value;

public:
    Sensor(const std::string &n) : name(n), value(0.0f) {}

    virtual float read() { return value; }
    std::string get_name() const { return name; }
    virtual void print() const {
        std::cout << "[" << name << "] " << value << std::endl;
    }
    virtual ~Sensor() {}  // 가상 소멸자 필수
};

// 파생 클래스 (Derived)
class TemperatureSensor : public Sensor {
    float offset;

public:
    TemperatureSensor(const std::string &n, float offset = 0.0f)
        : Sensor(n), offset(offset) {}

    float read() override {
        value = read_adc() + offset;  // ADC 읽기 + 보정
        return value;
    }

    void print() const override {
        std::cout << "[TEMP:" << name << "] "
                  << value << "°C" << std::endl;
    }

private:
    float read_adc() { return 25.3f; }  // 하드웨어 읽기 (예시)
};
```

---

## 상속 접근 지정자

```cpp
class Base {
public:    int pub;
protected: int prot;
private:   int priv;
};

class DerPub  : public    Base {};  // pub→pub, prot→prot
class DerProt : protected Base {};  // pub→prot, prot→prot
class DerPriv : private   Base {};  // pub→priv, prot→priv
// private 멤버는 어떤 경우에도 파생 클래스에서 접근 불가
```

---

## 생성자 / 소멸자 호출 순서

```cpp
class A {
public:
    A()  { std::cout << "A 생성\n"; }
    ~A() { std::cout << "A 소멸\n"; }
};

class B : public A {
public:
    B()  { std::cout << "B 생성\n"; }
    ~B() { std::cout << "B 소멸\n"; }
};

B b;
// 출력:
// A 생성  ← 기반 먼저
// B 생성
// B 소멸  ← 파생 먼저 (역순)
// A 소멸
```

---

## 기반 클래스 생성자 호출

```cpp
class Device {
    int   id;
    float voltage;

public:
    Device(int id, float v) : id(id), voltage(v) {}
    int   get_id()      const { return id; }
    float get_voltage() const { return voltage; }
};

class WiFiModule : public Device {
    std::string ssid;

public:
    WiFiModule(int id, float v, const std::string &s)
        : Device(id, v), ssid(s) {}  // 기반 클래스 생성자 명시적 호출

    void connect() {
        std::cout << "ID:" << get_id()
                  << " 전압:" << get_voltage()
                  << " SSID:" << ssid << "\n";
    }
};
```

---

## 다중 상속

```cpp
class Serializable {
public:
    virtual std::string serialize() const = 0;
};

class Loggable {
public:
    virtual void log(const std::string &msg) const {
        std::cout << "[LOG] " << msg << std::endl;
    }
};

class SensorData : public Serializable, public Loggable {
    float temp;
public:
    SensorData(float t) : temp(t) {}
    std::string serialize() const override {
        return "temp:" + std::to_string(temp);
    }
};

SensorData d(25.3f);
d.log(d.serialize());
```

---

## using으로 숨겨진 함수 노출

```cpp
class Base {
public:
    void func(int x) { std::cout << "Base::func(int)\n"; }
};

class Derived : public Base {
public:
    using Base::func;          // Base의 func(int) 노출
    void func(float x) {       // 오버로딩 추가
        std::cout << "Derived::func(float)\n";
    }
};

Derived d;
d.func(1);    // Base::func(int)
d.func(1.0f); // Derived::func(float)
```

---

## 정리

- 기반 클래스 소멸자는 반드시 `virtual`로 선언
- 파생 클래스에서 오버라이드 시 `override` 키워드로 오타 방지
- 생성 순서: 기반 → 파생 / 소멸 순서: 파생 → 기반
- 다중 상속은 인터페이스(순수 가상 함수만 있는 클래스) 위주로 사용
