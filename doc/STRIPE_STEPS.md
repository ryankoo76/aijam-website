# Stripe 실결제 전환 — 내가 할 일 (순서대로)

> 작성일: 2026-06-23
> 기반: `plan.md` / `STRIPE_LIVE_RESEARCH.md`
> 목적: aijam-us.com 실제 $39 결제를 켜기 위해 **Ryan이 순서대로 따라 할 체크리스트**

---

## 전체 흐름 한눈에

```
[1] Ryan   → Stripe 계정 활성화         (대시보드, 심사 있음 → 가장 먼저)
[2] Ryan   → Live Secret Key 발급        (sk_live_...)
[3] Ryan   → Live Webhook 등록 + Secret   (whsec_...)
[4] Claude → 코드 금액 $350 → $39 수정     (승인하면 Claude가 함)
[5] Ryan   → Vercel 환경변수 교체 + 재배포
[6] 함께    → 실결제 $39 테스트 → 확인 → 환불
```

**Ryan이 직접 하는 것: STEP 1, 2, 3, 5 (전부 대시보드 입력)**
**코드(STEP 4)는 Claude가 / 검증(STEP 6)은 함께**

---

## STEP 1 — Stripe 계정 활성화 (Ryan, 가장 먼저)

심사가 걸릴 수 있어 제일 먼저 시작.

1. https://dashboard.stripe.com 로그인
2. 우상단 **테스트 모드 토글 끄기** (라이브 모드로 전환)
3. "Activate account" 안내대로 미국 사업자 정보 입력:
   - 사업자 유형(LLC 등), 법인명, **EIN**, 사업장 주소, 업종, 웹사이트(aijam-us.com)
   - 대표자 이름·생년월일·**SSN**·주소
   - 정산용 미국 은행 **Routing + Account number**

- [ ] ✅ 확인: 상단에 "account is active" 표시

---

## STEP 2 — Live Secret Key 발급 (Ryan)

1. 라이브 모드에서 **Developers → API keys**
2. **Secret key** `sk_live_...` Reveal 해서 복사 → 안전한 곳 임시 보관

- [ ] ✅ 확인: 키가 `sk_test_`가 아니라 **`sk_live_`** 로 시작

> ❗ 시크릿 키는 채팅·문서·깃에 평문으로 남기지 말 것. Vercel 환경변수에만 입력.

---

## STEP 3 — Live Webhook 등록 (Ryan)

1. 라이브 모드에서 **Developers → Webhooks → Add endpoint**
2. URL: `https://www.aijam-us.com/api/webhook`
3. 이벤트: **`checkout.session.completed`** 선택
4. 등록 후 나오는 **Signing secret** `whsec_...` 복사 → 보관

- [ ] ✅ 확인: secret이 **`whsec_`** 로 시작 (라이브 모드에서 등록한 것)

---

## STEP 4 — 코드 금액 변경 $350 → $39 (Claude가 함)

Ryan은 안 해도 됨. Claude에게 "코드 수정해줘" 하면 아래를 처리:

| 파일:라인 | 현재 | 변경 후 |
|-----------|------|---------|
| `app/api/checkout/route.ts:51` | `35000` | `3900` |
| `app/pay/success/page.tsx:78` | `35000` | `3900` |
| `app/api/webhook/route.ts:38` | `35000` | `3900` |
| `app/pay/page.tsx` | `$350`, `Pay $350 Now` | `$39`, `Pay $39 Now` |

- [ ] ✅ 확인: `grep -rn "35000\|\$350" app/` 결과 0건

---

## STEP 5 — Vercel 환경변수 교체 + 재배포 (Ryan)

1. Vercel → 프로젝트 → Settings → Environment Variables
2. 먼저 `STRIPE_SECRET_KEY`가 지금 test인지 확인 → STEP 2의 `sk_live_...` 로 교체
3. `STRIPE_WEBHOOK_SECRET` 항목 **새로 추가** → STEP 3의 `whsec_...`
4. `NEXT_PUBLIC_BASE_URL` = `https://www.aijam-us.com` 유지 확인
5. 저장 후 **Redeploy** (재배포)

- [ ] ✅ 확인: 환경변수에 live 키 + webhook secret 둘 다 존재, 배포 성공

---

## STEP 6 — 실결제 검증 (함께)

1. aijam-us.com/pay 에서 가격 **$39** 표시 확인
2. 본인 실제 카드로 $39 결제
3. Claude와 함께 기록·이메일·webhook 확인:
   - [ ] `/pay/success`에 **$39.00** 표시
   - [ ] Supabase `aijam_payments` 레코드 1건 (`amount=3900`)
   - [ ] Supabase `aijam_registrations.submission_status = paid`
   - [ ] 결제 확인 이메일 수신
   - [ ] Stripe(Live) → Payments에 $39
   - [ ] Stripe → Webhooks 이벤트 **200 OK**
4. 마지막에 Stripe 대시보드에서 그 $39 **환불(Refund)**

- [ ] ✅ 위 전부 체크 → **실결제 전환 완료**

---

## 문제 생기면 (롤백)

- Vercel 환경변수를 이전 값으로 되돌리고 Redeploy → 즉시 테스트 모드 복귀
- 코드는 git revert로 금액 변경 되돌리기 가능

---

*STEP 1·2·3·5는 Ryan이 대시보드에서 직접, 또는 Claude in Chrome으로 함께 진행 가능.
STEP 4는 Claude가, STEP 6은 함께.*
