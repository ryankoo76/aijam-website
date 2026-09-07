# Stripe 실결제 전환 — Plan

> 작성일: 2026-06-23
> 기반: `STRIPE_LIVE_RESEARCH.md` (리서치 검토·코드 대조 완료)
> 목적: aijam-us.com에서 실제 Stripe 결제($39 USD)를 작동시키는 **실행 계획**
> 원칙: 아래 단계는 **순서대로** 진행. 코드 수정은 **이 plan 승인 후** 실제 반영.

---

## 0. 전제 확인 (시작 전 1분)

- [ ] 본 plan을 끝까지 읽고 단계 순서에 동의
- [ ] Stripe 계정 로그인 가능 (미국 사업자 정보 준비 — RESEARCH §3 참고)
- [ ] Vercel 프로젝트 접근 권한 있음
- [ ] 검증용으로 본인 실제 카드 1장 준비 ($39 결제 후 환불 예정)

> ⚠️ **가장 중요한 미확인 변수**: 로컬 `.env.local`은 테스트 키(`sk_test_`)로 확인됨.
> **Vercel 프로덕션 환경변수도 테스트 키인지 STEP 5에서 반드시 재확인.**

---

## 실행 순서 (한눈에)

```
STEP 1  Stripe 계정 활성화 (심사 소요 가능 → 먼저 시작)
STEP 2  Live Secret Key 발급 (sk_live_...)
STEP 3  Live Webhook 등록 + Secret 확보 (whsec_...)
STEP 4  코드: 금액 $350 → $39 (3곳 + UI) — 승인 후 수정
STEP 5  Vercel 환경변수 교체 + 재배포
STEP 6  실결제 검증 ($39 결제 → 확인 → 환불)
```

---

## STEP 1 — Stripe 계정 활성화

심사에 수 분~수 일 걸릴 수 있으므로 **가장 먼저** 시작.

1. https://dashboard.stripe.com 로그인
2. 우상단 **테스트 모드 토글 OFF** (라이브 모드 진입)
3. 활성화 안내(Activate / Complete your account)에 따라 미국 사업자 정보 입력:
   - 사업자 유형(LLC/C-Corp/Sole Proprietor 등), 법인명, **EIN**, 사업장 주소, 업종(MCC), 웹사이트(`aijam-us.com`)
   - 대표자: 이름·생년월일·**SSN**(전체 또는 뒤 4자리)·주소
   - 정산 계좌: 미국 은행 **Routing + Account number**

**확인 방법**: 대시보드 상단에 "Your account is active" / 결제 받기 가능 상태 표시.

> 화면 요구 항목은 사업자 유형에 따라 다를 수 있음 — 화면 안내대로 입력.

---

## STEP 2 — Live Secret Key 발급

1. 라이브 모드 상태에서 **Developers → API keys**
2. **Secret key** `sk_live_...` 확인 (Reveal). 안전한 곳에 임시 보관.
   - Publishable key(`pk_live_...`)는 현재 코드가 서버 결제 방식이라 불필요할 수 있으나, 함께 메모.

**확인 방법**: 키가 `sk_test_`가 아니라 `sk_live_`로 시작하는지.

> ❗ 시크릿 키는 채팅/문서/깃에 평문으로 남기지 말 것. Vercel 환경변수에만 입력.

---

## STEP 3 — Live Webhook 등록 + Secret 확보

1. 라이브 모드에서 **Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://www.aijam-us.com/api/webhook`
3. Events to send: **`checkout.session.completed`** 선택
4. 등록 후 해당 endpoint의 **Signing secret** `whsec_...` 확인 → 임시 보관

**확인 방법**: Webhooks 목록에 라이브 endpoint가 보이고 secret이 `whsec_`로 시작.

> 라이브 webhook은 테스트용과 **별개**. 반드시 라이브 모드에서 등록한 것이어야 함.

---

## STEP 4 — 코드: 금액 $350 → $39 (승인 후 수정)

> 이 STEP은 **plan 승인 후 실제 코드 수정**. 변경 위치는 아래 4곳.

| # | 파일:라인 | 현재 | 변경 후 |
|---|-----------|------|---------|
| 1 | `app/api/checkout/route.ts:51` | `unit_amount: 35000, // $350.00` | `unit_amount: 3900, // $39.00` |
| 2 | `app/pay/success/page.tsx:78` | `session.amount_total ?? 35000` | `session.amount_total ?? 3900` |
| 3 | `app/api/webhook/route.ts:38` | `session.amount_total ?? 35000` | `session.amount_total ?? 3900` |
| 4 | `app/pay/page.tsx` | `$350` (line 92), `Pay $350 Now` (line 183) | `$39`, `Pay $39 Now` |

수정 후 **잔존 검증** (35000이 한 곳도 남으면 안 됨):

```bash
cd aijam-website
grep -rn "35000\|\$350\|Pay \$350" app/   # 결과 0건이어야 정상
```

> `lib/email.ts`는 금액을 `amount/100`으로 동적 계산 → 수정 불필요 (Stripe 실제 결제액 자동 반영).

---

## STEP 5 — Vercel 환경변수 교체 + 재배포

1. **먼저 현재 값 확인**: Vercel → 프로젝트 → Settings → Environment Variables
   - `STRIPE_SECRET_KEY`가 `sk_test_`인지 `sk_live_`인지 확인 (전제의 미확인 변수)
2. `STRIPE_SECRET_KEY` → STEP 2의 `sk_live_...`로 교체 (Production 환경)
3. `STRIPE_WEBHOOK_SECRET` → STEP 3의 `whsec_...` **추가** (없던 변수)
4. `NEXT_PUBLIC_BASE_URL` = `https://www.aijam-us.com` 유지 확인
5. STEP 4 코드 변경 커밋/푸시 → **재배포** (또는 Redeploy로 env 반영)

**확인 방법**: 배포 완료 + 환경변수 목록에 live 키 + webhook secret 존재.

---

## STEP 6 — 실결제 검증 (Definition of Done)

라이브 사이트에서 본인 실제 카드로 1건 결제 후 전 경로 확인.

- [ ] `https://www.aijam-us.com/pay` 에서 가격이 **$39** 표시, 버튼 **Pay $39 Now**
- [ ] 실제 카드로 $39 결제 성공
- [ ] `/pay/success` 화면에 **$39.00** 표시
- [ ] Supabase `aijam_payments`에 레코드 1건 (`stripe_session_id`, `email`, `amount=3900`, `currency=usd`, `status`)
- [ ] Supabase `aijam_registrations.submission_status` = `paid`
- [ ] 결제 확인 이메일 수신 (미수신 시 — 결제는 됨 — `team@aijam.org` Resend 도메인 인증 별도 점검)
- [ ] Stripe 대시보드(**Live**) → Payments에 $39 표시
- [ ] Stripe → Webhooks → 해당 이벤트 **200 OK**
- [ ] 검증용 결제 **환불(Refund)** 처리 (Stripe 대시보드에서)

위 항목 전부 ✅ → **실결제 전환 완료**.

---

## 리스크 대응 (RESEARCH §6 요약)

| 리스크 | 대응 |
|--------|------|
| Stripe 활성화 지연 | STEP 1을 가장 먼저 시작 |
| Vercel env가 실제 테스트 키 | STEP 5에서 교체 전 반드시 확인 |
| 금액 불일치 잔존 | STEP 4 grep 검증 0건 확인 |
| Webhook 미작동 | STEP 6에서 200 OK 확인 |
| 확인 이메일 미발송 | 결제와 무관 — Resend 도메인 인증 별도 점검 |
| FROM_EMAIL/Supabase 컬럼 불일치 | STEP 6 실패 시 컬럼명 대조 |

---

## 롤백 (문제 발생 시)

- Vercel 환경변수를 이전 값으로 되돌리고 Redeploy → 즉시 테스트 모드로 복귀
- 코드는 git revert로 금액 변경 되돌리기 가능

---

*본 plan 승인 후 STEP 4 코드 수정부터 실제 실행합니다. STEP 1~3, 5는 Stripe/Vercel 대시보드 작업으로 Ryan이 직접 진행하거나, Claude in Chrome으로 함께 진행 가능합니다.*
