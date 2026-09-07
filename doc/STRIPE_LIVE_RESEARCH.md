# Stripe 실결제 전환 — Research

> 작성일: 2026-06-23
> 목적: aijam-us.com에서 실제 Stripe 결제($39 USD)를 작동시키기 위한 사전 조사
> 범위: **리서치 전용** — 실제 구현 단계는 별도 `plan.md`에서 진행
> 사업자: 미국 등록 사업자(US business) 기준

---

## 1. 현재 상태 진단 (코드 확인 결과)

2026-06-23 코드/환경 점검 결과:

| 항목 | 현재 값 | 상태 | 의미 |
|------|---------|------|------|
| `STRIPE_SECRET_KEY` | `sk_test_51TB...` | 🔴 테스트 모드 | 실제 카드 결제 불가, 테스트 카드(4242)만 동작 |
| `STRIPE_WEBHOOK_SECRET` | 없음 (MISSING) | 🔴 미설정 | 백업 결제 경로(webhook) 미작동 |
| 코드상 결제 금액 | `35000` cents (= $350) | 🟡 변경 필요 | **등록비 $39로 변경 필요 → `3900` cents** |
| 통화 (currency) | `usd` | ✅ 정상 | 미국 사업자 + USD 적합 |
| 상품명 | `AI-JAM US 2026 — Participation Fee` | ✅ 정상 | — |
| `NEXT_PUBLIC_BASE_URL` | `https://www.aijam-us.com` | ✅ 정상 | success/cancel URL 정상 |

**결론**: 현재는 테스트 모드만 통과한 상태가 맞습니다. 실결제를 위해서는
(1) Stripe 계정 활성화, (2) Live 키 발급, (3) Webhook 등록, (4) 금액 $39 변경,
(5) Vercel 환경변수 교체가 필요합니다.

> ⚠️ 위 점검은 로컬 `.env.local` 기준입니다. Vercel 프로덕션 환경변수도
> 동일하게 테스트 키일 가능성이 높으며, plan 단계에서 Vercel 대시보드에서 재확인 필요.

---

## 2. Stripe 결제가 실제로 작동하는 원리

### 2-1. 테스트 모드 vs 라이브 모드

Stripe는 두 개의 완전히 분리된 환경을 제공합니다.

| | 테스트 모드 | 라이브 모드 |
|--|------------|------------|
| API 키 | `sk_test_...` / `pk_test_...` | `sk_live_...` / `pk_live_...` |
| 카드 | 테스트 카드만 (4242...) | 실제 카드 |
| 돈 이동 | 없음 (가짜) | 실제 정산 |
| Webhook | 테스트용 endpoint/secret | 라이브용 endpoint/secret (별도) |
| 대시보드 데이터 | 분리됨 | 분리됨 |

**핵심**: 테스트와 라이브는 키·webhook·데이터가 전부 별개입니다.
테스트에서 잘 됐다고 라이브가 자동으로 되지 않으며, 라이브 키/웹훅을 따로 발급·등록해야 합니다.

### 2-2. 결제 데이터가 DB에 기록되는 2개 경로

현재 코드는 결제 성공 시 DB(`aijam_payments`, `aijam_registrations`)를 업데이트하는
경로가 **두 개** 있습니다.

```
사용자가 카드 결제 완료
   │
   ├─[경로 A] 브라우저가 /pay/success?session_id=... 로 리디렉트
   │          → app/pay/success/page.tsx (서버 컴포넌트)
   │          → Stripe 세션 조회 → DB 업데이트 + 확인 이메일
   │          → "주 경로" (사용자가 화면을 끝까지 본 경우)
   │
   └─[경로 B] Stripe 서버가 우리 서버로 직접 이벤트 전송
              → app/api/webhook/route.ts
              → checkout.session.completed 수신 → DB 업데이트 + 확인 이메일
              → "백업 경로" (사용자가 결제 직후 탭을 닫아도 안전)
```

- **경로 A만 있으면**: 사용자가 결제 직후 브라우저를 닫으면 DB 반영이 누락됨
- **경로 B(webhook)가 반드시 필요한 이유**: 실제 돈($39)이 빠져나갔는데
  DB에 `paid`로 기록되지 않으면 참가자가 제출(submit) 단계로 못 넘어감
- 두 경로 모두 멱등(idempotent) 처리됨:
  - `aijam_payments`: `onConflict: 'stripe_session_id'` upsert → 중복 안전
  - `aijam_registrations`: 동일 이메일 `update` → 여러 번 실행돼도 결과 동일

→ **현재 webhook secret이 없어 경로 B가 사실상 비활성** 상태. 실결제 전 필수 보완.

### 2-3. Webhook 서명 검증

`app/api/webhook/route.ts`는 `STRIPE_WEBHOOK_SECRET`로 요청 서명을 검증합니다.

```
webhookSecret 있음 → stripe.webhooks.constructEvent(서명 검증, 안전)
webhookSecret 없음 → JSON.parse (검증 생략, 개발용 fallback — 보안 취약)
```

→ 라이브에서는 **반드시 webhook secret을 설정**해야 위조 요청을 막을 수 있음.

---

## 3. 미국 사업자(US Business)로 Stripe 활성화 요건

미국 등록 사업자로 Stripe 계정을 활성화(Activate)할 때 일반적으로 요구되는 정보:

### 3-1. 사업자 정보

| 항목 | 내용 |
|------|------|
| 사업자 유형 | LLC / C-Corp / S-Corp / Sole Proprietor / Non-profit 등 |
| 법인명 (Legal business name) | 등록된 정식 명칭 |
| EIN (Employer Identification Number) | 미국 연방 세금 ID (9자리) |
| 사업장 주소 | 미국 주소 |
| 업종 (Industry / MCC) | 교육/대회/이벤트 등 |
| 웹사이트 | aijam-us.com |

### 3-2. 대표자(Representative) 정보

| 항목 | 내용 |
|------|------|
| 이름 / 생년월일 | 대표자 본인 |
| SSN 뒤 4자리 (또는 전체) | 신원 확인용 |
| 주소 | 미국 주소 |

### 3-3. 정산(Payout) 계좌

| 항목 | 내용 |
|------|------|
| 미국 은행 계좌 | Routing number + Account number |
| 정산 주기 | 기본 일/주 단위 (Stripe 설정에서 변경 가능) |

> 위 정보는 일반적 요건이며, 실제 요구 항목은 Stripe 활성화 화면에서
> 사업자 유형에 따라 달라질 수 있음. (plan 단계에서 화면 따라 입력)

---

## 4. 실결제 전환에 필요한 작업 항목 (개요)

실제 단계별 순서/체크리스트는 `plan.md`에서 다루되, 리서치 차원에서
필요한 작업을 분류하면:

### 4-1. 설정(Config) 작업 — 코드 수정 없음

| 작업 | 위치 | 비고 |
|------|------|------|
| Stripe 계정 활성화 | Stripe 대시보드 | 미국 사업자 정보 입력 (3장 참고) |
| Live Secret Key 발급 | Stripe → Developers → API keys | `sk_live_...` |
| Live Webhook 등록 | Stripe → Developers → Webhooks | URL: `https://www.aijam-us.com/api/webhook`, 이벤트: `checkout.session.completed` |
| Live Webhook Secret 확보 | 위 등록 후 생성 | `whsec_...` |
| Vercel 환경변수 교체 | Vercel → Settings → Env Vars | `STRIPE_SECRET_KEY` 교체 + `STRIPE_WEBHOOK_SECRET` 추가 |
| 재배포 | Vercel | 환경변수 반영 |

### 4-2. 코드 작업 — 금액 변경 ($350 → $39)

현재 코드는 $350(`35000` cents)으로 되어 있어 **$39(`3900` cents)로 변경 필요**.
변경 위치 3곳:

| 파일 | 현재 | 변경 후 |
|------|------|---------|
| `app/api/checkout/route.ts:51` | `unit_amount: 35000` | `unit_amount: 3900` |
| `app/pay/success/page.tsx:78` | `amount_total ?? 35000` | `amount_total ?? 3900` |
| `app/api/webhook/route.ts:38` | `amount_total ?? 35000` | `amount_total ?? 3900` |

추가로 UI 텍스트:

| 파일 | 항목 |
|------|------|
| `app/pay/page.tsx` | 표시 가격 `$350` → `$39`, 버튼 `Pay $350 Now` → `Pay $39 Now` |

> `lib/email.ts`의 결제 확인 이메일은 금액을 동적(`amount/100`)으로 계산하므로
> 코드 수정 불필요 — Stripe 실제 결제액이 자동 반영됨.

---

## 5. 비용 및 정산 (US 기준)

| 항목 | 내용 |
|------|------|
| Stripe 수수료 (미국 카드) | 약 **2.9% + $0.30** / 건 |
| $39 결제 시 수수료 | 약 $0.30 + $1.13 = **약 $1.43** |
| 실수령액 | 약 **$37.57** / 건 |
| 해외 카드 추가 수수료 | 국제 카드 시 약 +1.5% (참가자가 해외인 경우 발생 가능) |
| 통화 변환 | 해외 카드라도 USD로 청구 → 카드사가 환전 (우리 추가 비용 없음) |
| 정산 주기 | 기본 미국 사업자 2일 롤링 (설정 변경 가능) |

> AI-JAM은 국제 대회 → 해외 참가자 카드 사용 빈도 높음.
> 해외 카드 수수료(+1.5%)를 감안하면 건당 실수령 ~$36 수준 예상.

---

## 6. 리스크 및 검토 필요 사항

| 리스크 | 설명 | plan에서 결정할 것 |
|--------|------|-------------------|
| Stripe 활성화 지연 | 사업자 심사에 수 분~수 일 소요 가능 | 활성화 먼저 시작 |
| Webhook 200 응답 확인 | 등록 후 실제 이벤트가 200으로 처리되는지 검증 필요 | Live 테스트 시 Stripe 대시보드에서 확인 |
| Supabase 테이블 정합성 | `aijam_payments` 테이블/컬럼이 코드와 일치하는지 | 컬럼: `stripe_session_id`, `email`, `amount`, `currency`, `status` |
| FROM_EMAIL 도메인 인증 | `team@aijam.org` Resend 인증 안 되면 결제 확인 이메일 미발송 (결제 자체는 됨) | 별도 확인 |
| 테스트→라이브 데이터 분리 | 테스트로 쌓인 데이터는 라이브에 안 넘어옴 | 정상 (분리가 맞음) |
| 실결제 테스트 후 환불 | 본인 카드로 $39 실결제 후 환불 처리 | 검증용 1건 |
| 금액 불일치 잔존 위험 | 3곳 중 1곳이라도 35000 남으면 금액 불일치 | 3곳 + UI 모두 변경 확인 |

---

## 7. 실결제 검증 기준 (Definition of Done)

라이브 전환이 "완료"되었다고 판단하는 기준:

- [ ] Stripe 계정 활성화(Activated) 완료
- [ ] Vercel `STRIPE_SECRET_KEY` = `sk_live_...`
- [ ] Vercel `STRIPE_WEBHOOK_SECRET` = `whsec_...` (라이브용)
- [ ] 코드 금액 3곳 모두 `3900` + UI `$39`
- [ ] 본인 실제 카드로 $39 결제 성공
- [ ] `/pay/success`에 `$39.00` 표시
- [ ] Supabase `aijam_registrations.submission_status` = `paid`
- [ ] Supabase `aijam_payments`에 레코드 1건 생성
- [ ] Stripe 대시보드(Live) → Payments에 $39 표시
- [ ] Stripe → Webhooks → 해당 이벤트 **200 OK**
- [ ] 결제 확인 이메일 수신
- [ ] 검증용 결제 환불(Refund) 처리

---

## 8. 다음 단계

본 리서치 확인 후 → `plan.md` 작성:
- 위 작업들을 **실행 순서대로** 정리 (계정 활성화 → 키 발급 → webhook → 금액 변경 → env → 재배포 → 검증)
- 각 단계별 정확한 클릭 경로 + 확인 방법
- 코드 변경(금액 $39)은 plan 승인 후 실제 수정

*본 문서는 리서치 전용입니다. 코드 변경 및 실행은 plan.md 승인 후 진행합니다.*
