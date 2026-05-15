---
title: "FreeRTOS Sensor Monitor — ARM Cortex-M3 실시간 센서 펌웨어"
date: 2026-05-07 09:00:00 +0900
categories: [프로젝트, 임베디드]
tags: [freertos, arm, cortex-m3, qemu, cmake, rtos, 펌웨어]
author: minwoo
---

## 프로젝트 개요

ARM Cortex-M3 기반 실시간 센서 모니터링 펌웨어입니다.  
하드웨어 없이 **QEMU 에뮬레이터**로 실행 가능한 임베디드 포트폴리오 프로젝트입니다.

| 항목 | 내용 |
|------|------|
| RTOS | FreeRTOS v11 |
| 타겟 | ARM Cortex-M3 (LM3S6965) |
| 에뮬레이터 | QEMU `lm3s6965evb` |
| 빌드 | CMake + arm-none-eabi-gcc |

---

## 태스크 아키텍처

```
[SensorTask P3] --(SensorQueue)--> [ProcessTask P2] --(LogQueue)--> [UARTTask P1]
                                                                          |
[WatchdogTask P4] <-------------- heartbeat kick -------------------------+
```

| 태스크 | 우선순위 | 역할 |
|--------|----------|------|
| SensorTask | 3 | 500ms 주기로 온도/습도/기압 읽기 → SensorQueue |
| ProcessTask | 2 | 임계값 비교 후 로그 포맷 → LogQueue |
| UARTTask | 1 | Mutex 보호 하에 UART 출력 |
| WatchdogTask | 4 | 태스크 heartbeat 감시, 3초 무응답 시 경고 |

---

## 빌드 및 실행

```bash
# 의존성 설치 (macOS)
brew install --cask gcc-arm-embedded && brew install cmake qemu

# 의존성 설치 (Ubuntu)
sudo apt install gcc-arm-none-eabi cmake qemu-system-arm

# 빌드 및 실행
git clone --recursive https://github.com/MinwooPyeon/freertos-sensor-monitor.git
cd freertos-sensor-monitor
chmod +x scripts/*.sh
./scripts/build.sh
./scripts/run_qemu.sh
```

**예상 출력**

```
[INFO] [    0 ms] TEMP: 25.3 C  HUM: 61.2%  PRES:1013 hPa
[WARN] [ 1000 ms] TEMP: 28.5 C  HUM: 76.3%  PRES:1012 hPa
[WATCHDOG] All tasks healthy at 2000 ms
```

종료: `Ctrl+A` → `X`

---

## GDB 디버깅

```bash
# 터미널 1 — QEMU GDB 서버 시작
qemu-system-arm -machine lm3s6965evb -cpu cortex-m3 \
    -kernel build/freertos-sensor-monitor.elf \
    -serial mon:stdio -nographic -S -gdb tcp::1234

# 터미널 2 — GDB 연결
arm-none-eabi-gdb build/freertos-sensor-monitor.elf \
    -ex "target remote :1234" -ex "break main" -ex "continue"
```

---

## 핵심 구현 포인트

### 선점형 스케줄링

FreeRTOS 선점형 스케줄러로 우선순위 기반 태스크 전환을 구현했습니다.  
WatchdogTask(P4)가 가장 높은 우선순위로 시스템 전체를 감시합니다.

### Queue 기반 데이터 파이프라인

태스크 간 직접 공유 메모리 대신 `xQueueSend` / `xQueueReceive`로 데이터를 전달해  
경쟁 조건 없이 안전한 파이프라인을 구성했습니다.

### Mutex 기반 UART 동기화

여러 태스크가 UART를 동시에 사용하면 출력이 섞입니다.  
`xSemaphoreTake` / `xSemaphoreGive`로 UART 접근을 직렬화했습니다.

### UART 레지스터 직접 제어

HAL 라이브러리 없이 IBRD/FBRD/LCRH/CTL 레지스터를 직접 설정해  
9600bps UART 드라이버를 구현했습니다.

### 링커 스크립트 + 스타트업 코드

벡터 테이블 배치, `.data` 섹션 RAM 복사, `.bss` 섹션 초기화를  
스타트업 코드와 링커 스크립트로 직접 구현했습니다.

---

## 전체 소스코드

[GitHub - freertos-sensor-monitor](https://github.com/MinwooPyeon/freertos-sensor-monitor)
