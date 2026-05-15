---
title: "LSTM으로 센서 데이터에서 잔여 수명 예측"
date: 2026-05-14 09:00:00 +0900
categories: [프로젝트, AI]
tags: [lstm, pytorch, python, nasa-cmapss, rul, 예지보전, 시계열]
author: minwoo
---

## 프로젝트 개요

NASA CMAPSS 제트엔진 시뮬레이션 데이터를 활용해  
**잔여 수명(RUL, Remaining Useful Life)** 을 예측하는 LSTM 모델을 구현했습니다.

센서값의 시계열 패턴을 학습해 "이 엔진이 앞으로 몇 사이클 뒤에 고장 나는가"를 예측합니다.  
산업 현장에서 장비를 미리 교체하는 **예지보전(PdM, Predictive Maintenance)** 의 핵심 기술입니다.

| 항목 | 내용 |
|------|------|
| 데이터셋 | NASA CMAPSS (FD001 ~ FD004) |
| 모델 | LSTM + FC |
| 최종 RMSE | **14.1 cycles** (FD001 기준) |
| NASA Score | 11,234 |

---

## 데이터셋

NASA CMAPSS는 제트엔진의 센서값을 사이클 단위로 기록한 시뮬레이션 데이터입니다.

```
엔진1, 사이클1,  운전조건 3개,  센서값 21개
엔진1, 사이클2,  운전조건 3개,  센서값 21개
...
엔진1, 사이클200  ← 고장
엔진2, 사이클1,  ...
```

- 100개 엔진, 각 엔진마다 수명이 다름
- 분산이 0인 센서 6개 제거 → **18개 피처** 사용
- RUL 레이블: `max_cycle - current_cycle` (최대 125 클리핑)

---

## 전체 파이프라인

```
[원시 센서 데이터]
        ↓
[슬라이딩 윈도우 (30 사이클)]
        ↓
[MinMaxScaler 정규화 + RUL 0~1 정규화]
        ↓
[LSTM (128 hidden, 2 layers)]
        ↓
[FC Layer → RUL 예측값]
        ↓
[역정규화 → 사이클 단위 출력]
```

---

## 핵심 구현

### 슬라이딩 윈도우

```python
def _make_windows(self, df):
    X, y = [], []
    for _, group in df.groupby("unit_id"):
        feats  = group[FEATURE_COLS].values
        labels = group["rul"].values
        for i in range(len(feats) - self.window + 1):
            X.append(feats[i : i + self.window])   # 30사이클 묶음
            y.append(labels[i + self.window - 1])  # 마지막 시점 RUL
    return np.array(X, dtype=np.float32), np.array(y, dtype=np.float32)
```

### LSTM 모델

```python
class LSTMPredictor(nn.Module):
    def __init__(self, input_dim, hidden_dim=128, num_layers=2, dropout=0.2):
        super().__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim,
                            num_layers=num_layers,
                            batch_first=True, dropout=dropout)
        self.fc = nn.Sequential(
            nn.Linear(hidden_dim, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
        )

    def forward(self, x):
        out, _ = self.lstm(x)
        return self.fc(out[:, -1, :]).squeeze(-1)  # 마지막 타임스텝만 사용
```

### 학습 핵심 설정

```python
optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
scheduler = ReduceLROnPlateau(optimizer, factor=0.5, patience=5)

# 그래디언트 클리핑 — 학습 안정화
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
```

---

## 삽질 기록 — RMSE 41 → 14

처음에 RMSE가 41이 나왔습니다. 모델이 **평균값만 예측**하는 상태였습니다.

### 문제 1: 레이블 스케일

RUL이 0~125 범위인 채로 MSE를 계산하면 손실값이 수천 단위로 커집니다.  
그래디언트 신호가 약해져 모델이 평균만 예측하게 됩니다.

```python
# 전: RUL 그대로 사용 → MSE ~1750
y_train = rul_values

# 후: 0~1로 정규화
y_train = rul_values / 125.0
```

### 문제 2: 데이터 누출

`train_test_split`으로 랜덤 분할하면 같은 엔진 데이터가 학습/검증에 동시에 들어갑니다.  
엔진 ID 기준으로 분할해야 실제 성능을 제대로 측정할 수 있습니다.

```python
# 전: 랜덤 분할 (데이터 누출)
X_train, X_val = train_test_split(X, test_size=0.2)

# 후: 엔진 단위 분할
val_units  = set(units[:n_val])    # 검증용 엔진 20개
train_units = set(units[n_val:])   # 학습용 엔진 80개
```

### 문제 3: 학습률

lr=1e-3은 손실이 로컬 미니멈에 빠져 epoch 4 이후 전혀 개선되지 않았습니다.  
lr=1e-4로 낮추고 `ReduceLROnPlateau` 스케줄러를 추가해서 해결했습니다.

---

## 최종 결과

| 지표 | 값 |
|------|------|
| RMSE | **14.1 cycles** |
| NASA Score | **11,234** |
| 학습 에포크 | 48 (Early Stopping) |

논문 기준 FD001 RMSE 평균이 13~17 수준이므로 충분히 경쟁력 있는 결과입니다.

---

## 실행 방법

```bash
git clone https://github.com/MinwooPyeon/sensor-fault-predictor.git
cd sensor-fault-predictor

python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# data/ 폴더에 train_FD001.txt 배치 후
python scripts/train.py --dataset FD001 --epochs 100 --window 30 --hidden 128 --lr 1e-4
```

---

## 전체 소스코드

[GitHub - sensor-fault-predictor](https://github.com/MinwooPyeon/sensor-fault-predictor)
