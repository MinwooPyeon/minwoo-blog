---
title: "내눈 키오스크+ — 안과 검진 통합 키오스크 (Android)"
date: 2026-05-08 09:00:00 +0900
categories: [프로젝트, 안드로이드]
tags: [android, kotlin, jetpack-compose, ml-kit, tflite, mvi, 키오스크]
author: minwoo
description: "안과 검진 및 바이탈 측정을 통합한 키오스크 솔루션입니다. 시력, 황반변성, 사시, 노안조절력 등 다양한 안과 검사와 혈압, 악력, 치매 검사까지 하나의 키오스크에서 수행합니다. 실버계층의 건강 관리 접근성 향상을 목표로 기획했습니다."
---

## 프로젝트 개요

안과 검진 및 바이탈 측정을 통합한 키오스크 솔루션입니다.  
시력, 황반변성, 사시, 노안조절력 등 다양한 안과 검사와 혈압, 악력, 치매 검사까지 하나의 키오스크에서 수행합니다.  
실버계층의 건강 관리 접근성 향상을 목표로 기획했습니다.

| 항목 | 내용 |
|------|------|
| 개발 기간 | 2025.10 ~ 2025.11 |
| 팀원 | 6명 |
| 담당 역할 | **Android, AI** (얼굴 인식, ML Kit 연동) |
| 주요 특징 | 얼굴 인식 로그인, 음성 안내(TTS), 프린터 연동, 다국어 지원 |

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Language | Kotlin 2.1.12, Java 17 |
| UI | Jetpack Compose, Material 3 |
| Architecture | MVI (Orbit), Clean Architecture |
| AI | ML Kit (얼굴 인식, 시선 감지), TFLite |
| 음성 | Android TTS |

---

## 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                   │
│       (Compose UI, ViewModel, Orbit MVI, Navigation)    │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                      Domain Layer                       │
│                (Business Logic, Contracts)               │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                       Data Layer                        │
│        (Repository, DataSource, API, Local Storage)     │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                    External Services                    │
│       (Camera, ML Kit, Bluetooth, Printer, TTS)         │
└─────────────────────────────────────────────────────────┘
```

---

## 주요 기능

### 얼굴 인식 로그인

ML Kit Face Detection으로 카메라 프레임에서 얼굴을 실시간 감지합니다.  
등록된 얼굴과 매칭해 비밀번호 없이 로그인할 수 있습니다.

### 안과 검사

- **시력 검사**: 근거리/원거리 시력을 단계별 시표로 측정
- **황반변성 검사**: Amsler Grid 기반 왜곡 감지
- **사시 검사**: 시선 고정 패턴 분석 (ML Kit Eye Contour)
- **노안조절력 검사**: 초점 거리 변화 추적

### 바이탈 측정 연동

혈압계(BPBIO SDK), 악력계, 치매 검사 모듈을 Bluetooth/USB로 연동합니다.

### 프린터 출력

NemonicSdk(신형) / nemonic.aar(구형) 프린터 SDK 연동으로  
검사 결과를 현장에서 즉시 출력합니다.

### 음성 안내 (TTS)

Android TTS로 검사 진행 안내를 음성으로 제공합니다.  
실버계층을 위해 화면 전환마다 자동 안내가 나옵니다.

---

## MVI 아키텍처 적용 포인트

Orbit MVI 라이브러리로 상태 관리를 단방향 데이터 흐름으로 설계했습니다.

```kotlin
// Intent → Reducer → State 단방향 흐름
sealed class VisionTestIntent {
    data class StartTest(val type: VisionTestType) : VisionTestIntent()
    data class RecordResult(val value: Float) : VisionTestIntent()
    object FinishTest : VisionTestIntent()
}

data class VisionTestState(
    val isLoading: Boolean = false,
    val currentStep: Int = 0,
    val result: VisionResult? = null
)
```

---

## 전체 소스코드

[GitHub - Kiosk](https://github.com/MinwooPyeon/Kiosk)
