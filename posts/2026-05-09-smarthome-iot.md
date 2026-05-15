---
title: "EEUM 스마트홈 IoT — ESP32 IR 제어 + 음성 인식 + AI 자동 제어"
date: 2026-05-09 09:00:00 +0900
categories: [프로젝트, 임베디드]
tags: [esp32, freertos, mqtt, ir, esp-idf, raspberry-pi, android, 스마트홈]
author: minwoo
---

## 프로젝트 개요

IoT 미지원 레거시 가전에 IR 제어를 적용해 스마트홈 환경을 구축하는 통합 솔루션입니다.  
음성 명령, 평면도 기반 디바이스 관리, 루틴 자동화, AI 자동 제어를 하나의 앱에서 제공합니다.

| 항목 | 내용 |
|------|------|
| 개발 기간 | 2025.08.25 ~ 2025.10.02 (6주) |
| 팀원 | 6명 |
| 담당 역할 | **임베디드** — ESP32 IR 송신, FreeRTOS, NVS, MQTT, WiFi, TLS |
| 주요 특징 | 음성 인식(웨이크워드+STT+NLU), IR 레거시 제어, AI 자동 제어, 평면도 시각화 |

---

## 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Android App                          │
│    (Jetpack Compose, Voice AI, Naver Map, CameraX)      │
└──────────────────────────┬──────────────────────────────┘
                           │ REST API / MQTT
┌──────────────────────────▼──────────────────────────────┐
│                 Backend (Spring Boot)                   │
│      (Device/Routine API, MQTT Broker, Scheduler)       │
└──────────────────────────┬──────────────────────────────┘
                           │ MQTT (TLS)
┌──────────────────────────▼──────────────────────────────┐
│               RPi Hub (C++, mosquitto)                  │
│    (DHT11, IR Receiver, Analyzer, CSV Logger)           │
└──────────────────────────┬──────────────────────────────┘
                           │ UART / MQTT
┌──────────────────────────▼──────────────────────────────┐
│         ESP32 IR Remote (C++, FreeRTOS)                 │
│       (IR Send/Receive, NVS, WiFi, TLS MQTT)            │
└─────────────────────────────────────────────────────────┘
```

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Embedded | C++ STL, ESP-IDF, FreeRTOS, NVS Flash, RMT, UART |
| Android | Kotlin, Jetpack Compose, Coroutine, Hilt |
| Voice AI | Picovoice (웨이크워드), Android STT, Regex NLU |
| Backend | Spring Boot, MQTT, PostgreSQL, Redis |
| Infra | EC2, Docker Compose, Jenkins, Nginx |
| AI | Python, LightGBM, Scikit-learn, PMV/PPD Model |

---

## 임베디드 구현 (담당 파트)

### ESP32 IR Remote Controller

```
header/
  core/        — Config (NVS 영구 저장), Platform 추상화, Security (TLS/인증)
  hardware/    — IR 송신(RMT), IR 수신(FreeRTOS 큐), 가전 제어, IR 학습
  network/     — MQTT Client (TLS), Serial Controller (JSON 명령어)
src/
  main.cpp     — NVS → 설정 로드 → WiFi → 하드웨어 → FreeRTOS 태스크 생성
```

| 모듈 | 내용 |
|------|------|
| IR 송신 | RMT 채널 1, 38kHz 캐리어, NEC 프로토콜 68개 타이밍 배열 |
| IR 수신 | RMT 채널 0, FreeRTOS 큐 20개, NEC 자동 디코딩 |
| MQTT | PubSubClient, TLS 8883, QoS 1, 자동 재연결 |
| WiFi | WPA2, 연결 실패 시 30초 간격 3회 재시도 |
| 시리얼 | UART 115200bps, JSON 명령어 40종, Rate Limiting |
| FreeRTOS | MQTT(8KB), IR 수신(4KB), PIR(4KB) 태스크, 우선순위 1~5 |
| 설정 | NVS Flash 영구 저장, ArduinoJson 직렬화 |

### RMT 기반 IR 제어 — 단순 루프 대비 50μs → 1μs

ESP32 RMT(Remote Control Transceiver) 모듈로 IR 신호의 타이밍을 하드웨어 레벨에서 정밀 제어했습니다.  
소프트웨어 루프로 38kHz를 만들면 인터럽트 등의 영향으로 지터가 발생하지만,  
RMT는 전용 하드웨어 큐에 타이밍 배열을 넣으면 CPU 개입 없이 정확하게 출력합니다.

```cpp
// RMT 아이템 구성 (NEC 프로토콜 예시)
rmt_item32_t items[68];
items[0] = {9000, 1, 4500, 0};  // 리더: 9ms HIGH, 4.5ms LOW
for (int i = 0; i < 32; i++) {
    items[i + 1] = encode_bit(data_bit[i]);  // 560μs 단위 인코딩
}
rmt_write_items(RMT_CHANNEL_1, items, 68, true);
```

### NVS Flash 영구 저장

ESP32 NVS(Non-Volatile Storage)를 사용해 WiFi SSID/PW, MQTT 브로커 주소, IR 학습 코드를  
재부팅 후에도 유지되도록 저장합니다.

```cpp
nvs_handle_t handle;
nvs_open("storage", NVS_READWRITE, &handle);
nvs_set_str(handle, "ssid", wifi_config.ssid);
nvs_set_blob(handle, "ir_code", ir_data, sizeof(ir_data));
nvs_commit(handle);
```

### RPi Hub (EEUM Hub)

라즈베리파이에서 DHT11 환경 샘플 수집, IR 프레임 캡처, 열쾌적 지표 산출, MQTT 송수신, CSV 비동기 로깅을 담당합니다.

```
actuator/     — DHT11 (pigpio 정밀 타이밍, 재시도/쿨다운), IR 수신 (gap 기반 프레임 분리)
analyzer/     — 이슬점/열지수/절대습도/WBGT/PMV/PPD 계산
manager/      — DataManager (스레드 안전 버퍼), CsvManager (비동기 배치 플러시),
                MqttManager (연결/구독/동적 라우팅)
```

---

## 주요 기능

### 규칙 기반 음성 인식

- Picovoice Porcupine 웨이크워드("제니야") 감지 → Google STT 전환
- `Grammar.yml → RuleCompiler → Regex` 기반 Intent/Slot 매핑
- **31개 의도**, **79만 가지 발화 조합** 지원
- 다절 분리(예: "에어컨 켜고 불 꺼") + 컨텍스트 상속

### 보안 아키텍처

- WPA2 기반 WiFi + MQTT TLS 8883 암호화 채널
- ACL 토픽 제한으로 허가된 클라이언트만 브로커 접속
- 시리얼 통신 토큰 인증, Rate Limiting (초당 10개 메시지 제한)

### AI 자동 제어

- 온습도 센서 → WBGT, PMV, PPD, 이슬점, 절대습도 6가지 열쾌적 지표 산출
- **LightGBM Regressor**로 20분 뒤 PMV 예측 (n_estimators=800)
- 목적 함수 `J = α·PPD + β·PowerProxy + γ·ΔSetpointPenalty` 최소화로 최적 풍량/세트포인트 추천

---

## 전체 소스코드

[GitHub - Smarthome_IoT](https://github.com/MinwooPyeon/Smarthome_IoT)
