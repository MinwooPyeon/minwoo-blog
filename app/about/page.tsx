import type { Metadata } from "next";

export const metadata: Metadata = { title: "소개" };

export default function AboutPage() {
  return (
    <div>
      <h1 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>소개</h1>

      <section style={{ marginBottom: "2rem" }}>
        <p style={{ marginBottom: "0.5rem", fontWeight: 600 }}>편민우 (Minwoo Pyeon)</p>
        <p style={{ color: "#444" }}>
          임베디드 시스템, AI, 안드로이드 앱 개발에 관심이 많은 개발자입니다.
          FreeRTOS 기반 펌웨어, 딥러닝 모델 훈련, 안드로이드 앱 개발 등 다양한 분야를
          공부하며 프로젝트 기록을 이 블로그에 남기고 있습니다.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>관심 분야</p>
        <ul style={{ color: "#444" }}>
          <li>임베디드 시스템 — FreeRTOS, STM32, Raspberry Pi</li>
          <li>AI / 머신러닝 — LSTM, YOLOv5, 시계열 예측</li>
          <li>안드로이드 개발 — Kotlin, Jetpack Compose</li>
        </ul>
      </section>

      <section>
        <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>연락처</p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", color: "#444" }}>
          <a href="mailto:jh06041@naver.com">jh06041@naver.com</a>
          <a href="https://github.com/MinwooPyeon" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </section>
    </div>
  );
}
