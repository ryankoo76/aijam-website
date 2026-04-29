# aijam-website 프로젝트 현황 보고

> 최종 업데이트: 2026-04-29  
> 작성자: ryan.koo@headstartsv.com  
> 저장소: https://github.com/ryankoo76/aijam-website (private)  
> 배포 URL: https://www.aijam-us.com

---

## 1. 완료된 기능 전체 목록

### PHASE 1 — 기반 인프라 & 등록 시스템

| # | 기능 | 상태 |
|---|------|------|
| 1 | 전체 UI 폰트 리마스터 (globals.css + 컴포넌트 인라인) | ✅ |
| 2 | `AIJAM_Guidebook_2026.pdf` → `public/` 추가, 다운로드 버튼 연결 | ✅ |
| 3 | `lib/supabase.ts` — supabaseAdmin 서버사이드 클라이언트 | ✅ |
| 4 | `lib/email.ts` — 참가자 등록 확인 + 관리자 알림 이메일 | ✅ |
| 5 | `app/api/register/route.ts` — 등록 POST API (Supabase + Resend) | ✅ |
| 6 | `components/PageRegister.tsx` — 실제 API 호출, 로딩/성공/에러 상태 | ✅ |
| 7 | ChatWidget FAQ — 가이드북 링크 실제 URL 연결 | ✅ |

### PHASE 3 — 프로젝트 제출 시스템

| # | 기능 | 상태 |
|---|------|------|
| 8 | `app/submit/page.tsx` — 이메일 입력 게이트, 결제 상태 체크, 기제출 안내 | ✅ |
| 9 | `app/submit/resubmit/page.tsx` — 재제출 페이지 (already-submitted 우회) | ✅ |
| 10 | `components/SubmitForm.tsx` — 4섹션 제출 폼 (15개 필수 필드) | ✅ |
| 11 | `app/api/submit/route.ts` — 제출 POST API (검증 → DB 저장 → 상태 업데이트 → 확인 이메일) | ✅ |
| 12 | DB 컬럼 정합성 — `shipping_*` 프리픽스, `slides_link` | ✅ |
| 13 | Section A 전체 필수화 — teamMembers, keyFeatures, socialImpact, marketability | ✅ |
| 14 | Section D 재구성 — apt (선택) + shippingState (필수) 추가, 2열 그리드 | ✅ |
| 15 | `canSubmit` 15개 필드 게이트, disabled 힌트 체인 | ✅ |
| 16 | 제출 확인 이메일 — `sendSubmissionConfirmation()` (async IIFE + result.error 체크) | ✅ |
| 17 | Resend 에러 진단 로그 — `result.error` 명시적 체크 (`void IIFE` 패턴) | ✅ |

### PHASE 4 — 이메일 자동화 (Vercel Cron)

| # | 기능 | 상태 |
|---|------|------|
| 18 | `sendSequenceDay1` — 가이드북 PDF 다운로드 안내 | ✅ |
| 19 | `sendSequenceDay2` — 제출 폼 오픈 + 5가지 제출 팁 | ✅ |
| 20 | `sendSequenceDay3` — 카테고리별 예시 프로젝트 5개 소개 | ✅ |
| 21 | `sendSequenceDay5` — 마감일 리마인더 (August 30, 2026) + 체크리스트 | ✅ |
| 22 | `sendSequenceDay7` — 결제 독촉 이메일 (미결제자 `registered` 전용) | ✅ |
| 23 | `app/api/cron/route.ts` — 일일 cron 핸들러 (CRON_SECRET 인증, day 분기, 카운터 증가) | ✅ |
| 24 | `vercel.json` — Vercel Cron 설정 (매일 09:00 UTC) | ✅ |

### PHASE 5 — Stripe 결제 시스템

| # | 기능 | 상태 |
|---|------|------|
| 25 | `app/pay/page.tsx` — 결제 페이지 (이메일 파라미터 게이트) | ✅ |
| 26 | `app/pay/success/page.tsx` — 결제 완료 페이지 | ✅ |
| 27 | `app/api/checkout/route.ts` — Stripe Checkout 세션 생성 API | ✅ |
| 28 | `app/api/webhook/route.ts` — Stripe 웹훅 처리 (`payment_intent.succeeded` → `submission_status = 'paid'`) | ✅ |
| 29 | 결제 완료 후 `aijam_payments` 테이블 기록 | ✅ |
| 30 | 결제 확인 이메일 — `sendPaymentConfirmation()` | ✅ |

---

## 2. 현재 파일/폴더 구조

```
aijam-website/
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.ts          ← POST: Stripe Checkout 세션 생성
│   │   ├── cron/
│   │   │   └── route.ts          ← GET: 일일 이메일 시퀀스 cron (PHASE 4)
│   │   ├── register/
│   │   │   └── route.ts          ← POST: 참가자 등록 처리
│   │   ├── submit/
│   │   │   └── route.ts          ← POST: 프로젝트 제출 처리
│   │   └── webhook/
│   │       └── route.ts          ← POST: Stripe 웹훅 처리
│   ├── pay/
│   │   ├── page.tsx              ← 결제 페이지 (/pay?email=...)
│   │   └── success/
│   │       └── page.tsx          ← 결제 완료 페이지
│   ├── submit/
│   │   ├── page.tsx              ← 제출 게이트 + SubmitForm
│   │   └── resubmit/
│   │       └── page.tsx          ← 재제출 페이지 (기제출자 우회)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  ← SPA 메인 (5탭)
├── components/
│   ├── ChatWidget.tsx
│   ├── Footer.tsx
│   ├── Nav.tsx
│   ├── PageAbout.tsx
│   ├── PageAsia.tsx
│   ├── PageHome.tsx
│   ├── PageRegister.tsx          ← 등록 폼 (API 연동)
│   ├── PageWinners.tsx
│   └── SubmitForm.tsx            ← 4섹션 제출 폼 (Client Component)
├── lib/
│   ├── email.ts                  ← Resend 이메일 함수 전체 (7종)
│   └── supabase.ts               ← supabaseAdmin 클라이언트
├── public/
│   └── AIJAM_Guidebook_2026.pdf
├── doc/
│   ├── PROJECT_STATUS.md         ← 이 문서
│   └── IMPLEMENTATION_PLAN.md
├── .env.local                    ← 환경변수 (gitignored ✓)
├── next.config.js
├── package.json
├── tsconfig.json
└── vercel.json                   ← Vercel Cron 설정 (PHASE 4)
```

### `lib/email.ts` 이메일 함수 목록 (7종)

| 함수명 | 트리거 | 수신자 |
|--------|--------|--------|
| `sendRegistrationConfirmed` | 등록 완료 | 참가자 |
| `sendAdminNotification` | 등록 완료 | team@aijam.org |
| `sendPaymentConfirmation` | 결제 완료 | 참가자 |
| `sendSubmissionConfirmation` | 제출 완료 | 참가자 |
| `sendSequenceDay1` | Cron Day 1 | 참가자 |
| `sendSequenceDay2` | Cron Day 2 | 참가자 |
| `sendSequenceDay3` | Cron Day 3 | 참가자 |
| `sendSequenceDay5` | Cron Day 5 | 참가자 |
| `sendSequenceDay7` | Cron Day 7 | 미결제 참가자만 |

---

## 3. Supabase 테이블 구조

### 3-1. `aijam_registrations`

| 컬럼명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `id` | uuid PK | gen_random_uuid() | 자동 생성 |
| `created_at` | timestamptz | now() | 자동 생성 |
| `first_name` | text | — | 필수 |
| `last_name` | text | '' | 선택 |
| `email` | text | — | 필수, unique |
| `country` | text | — | 필수 |
| `school` | text | — | 필수 |
| `participant_type` | text | — | 'Student — Individual' / 'Student Team (2–5 members)' / 'Teacher / School' |
| `is_teacher` | boolean | false | 교사 여부 |
| `submission_status` | text | 'registered' | 'registered' → 'paid' → 'submitted' |
| `email_sequence_day` | int | 0 | 이메일 시퀀스 진행 일차 (Cron이 매일 +1) |

```sql
CREATE TABLE aijam_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  first_name text NOT NULL,
  last_name text DEFAULT '',
  email text NOT NULL UNIQUE,
  country text NOT NULL,
  school text NOT NULL,
  participant_type text NOT NULL,
  is_teacher boolean DEFAULT false,
  submission_status text DEFAULT 'registered',
  email_sequence_day int DEFAULT 0
);
```

> ⚠️ `email_sequence_day` 컬럼이 없으면 Cron이 실패합니다. 기존 테이블에 컬럼이 없다면 아래 SQL 실행:
> ```sql
> ALTER TABLE aijam_registrations ADD COLUMN email_sequence_day INT NOT NULL DEFAULT 0;
> ```

### 3-2. `aijam_payments`

| 컬럼명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `id` | uuid PK | gen_random_uuid() | 자동 생성 |
| `created_at` | timestamptz | now() | 자동 생성 |
| `email` | text | — | 참가자 이메일 (FK 역할) |
| `stripe_session_id` | text | — | Stripe Checkout 세션 ID |
| `stripe_payment_intent` | text | — | Stripe PaymentIntent ID |
| `amount` | int | — | 결제 금액 (cents) |
| `currency` | text | — | 통화 (예: 'usd') |
| `status` | text | — | 결제 상태 |

```sql
CREATE TABLE aijam_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  email text NOT NULL,
  stripe_session_id text,
  stripe_payment_intent text,
  amount int,
  currency text,
  status text
);
```

### 3-3. `aijam_submissions`

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| `id` | uuid PK | 자동 생성 |
| `created_at` | timestamptz | 자동 생성 |
| `email` | text | 제출자 이메일 |
| `category` | text | 프로젝트 카테고리 |
| `project_title` | text | 프로젝트 제목 |
| `team_members` | text | 팀원 이름 (콤마 구분) |
| `abstract` | text | 프로젝트 소개 |
| `key_features` | text | 주요 기능 |
| `social_impact` | text | 사회적 영향 |
| `marketability` | text | 시장성 |
| `video_url` | text | 30초 영상 URL |
| `slides_link` | text | 슬라이드 링크 (선택) |
| `inspiration` | text | 팀 스토리 — 동기 (선택) |
| `biggest_challenge` | text | 팀 스토리 — 가장 큰 도전 (선택) |
| `ai_role` | text | 팀 스토리 — AI 역할 (선택) |
| `future_plans` | text | 팀 스토리 — 미래 계획 (선택) |
| `shipping_name` | text | 수령인 이름 |
| `shipping_address` | text | 도로명 주소 |
| `shipping_apt` | text | 동/호수 (선택) |
| `shipping_city` | text | 도시 |
| `shipping_state` | text | 주/도 |
| `shipping_postal` | text | 우편번호 |
| `shipping_country` | text | 국가 |

```sql
CREATE TABLE aijam_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  email text NOT NULL,
  category text NOT NULL,
  project_title text NOT NULL,
  team_members text NOT NULL,
  abstract text NOT NULL,
  key_features text NOT NULL,
  social_impact text NOT NULL,
  marketability text NOT NULL,
  video_url text NOT NULL,
  slides_link text,
  inspiration text,
  biggest_challenge text,
  ai_role text,
  future_plans text,
  shipping_name text NOT NULL,
  shipping_address text NOT NULL,
  shipping_apt text,
  shipping_city text NOT NULL,
  shipping_state text NOT NULL,
  shipping_postal text NOT NULL,
  shipping_country text NOT NULL
);
```

### 3-4. Storage — `submissions` 버킷

- 버킷명: `submissions`
- 용도: 슬라이드 PDF 업로드 (현재 코드에서는 링크 방식으로 대체됨, 버킷 예약만)
- 접근: Service Role Key로만 접근

---

## 4. Vercel 환경변수 목록

| 키 이름 | 설명 | 필수 |
|---------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) 키 | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role 키 (서버사이드 전용) | ✅ |
| `STRIPE_SECRET_KEY` | Stripe 비밀 키 (현재 test 모드) | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe 웹훅 서명 검증용 secret | ✅ |
| `RESEND_API_KEY` | Resend 이메일 발송 API 키 | ✅ |
| `FROM_EMAIL` | 발신 이메일 주소 (예: `AI-JAM US <team@aijam.org>`) | ⚠️ 미설정 |
| `NEXT_PUBLIC_BASE_URL` | 사이트 기본 URL (예: `https://www.aijam-us.com`) | ✅ |
| `CRON_SECRET` | Cron API 인증용 Bearer 토큰 | ⚠️ 미설정 |

> ⚠️ `FROM_EMAIL` 과 `CRON_SECRET` 은 아직 Vercel에 설정되지 않아 각각 fallback 동작 중입니다.
> - `FROM_EMAIL` 미설정 → `team@aijam.org` fallback 사용 (Resend 도메인 인증 필요)
> - `CRON_SECRET` 미설정 → `/api/cron` 엔드포인트가 500 오류 반환

---

## 5. 전체 사용자 플로우

```
[1] 등록 (aijam-us.com/#register)
    └─ PageRegister.tsx → POST /api/register
       ├─ Supabase: aijam_registrations INSERT
       │   submission_status = 'registered'
       │   email_sequence_day = 0
       ├─ 이메일: sendRegistrationConfirmed (참가자)
       └─ 이메일: sendAdminNotification (team@aijam.org)

[2] 결제 (aijam-us.com/pay?email=...)
    └─ pay/page.tsx → POST /api/checkout
       └─ Stripe Checkout 세션 생성 → Stripe 결제 페이지 리디렉트
          └─ 결제 완료 → Stripe Webhook → POST /api/webhook
             ├─ Supabase: aijam_registrations UPDATE
             │   submission_status = 'paid'
             ├─ Supabase: aijam_payments INSERT
             └─ 이메일: sendPaymentConfirmation (참가자)
                └─ /pay/success 리디렉트

[3] 제출 (aijam-us.com/submit?email=...)
    └─ submit/page.tsx → SubmitForm.tsx → POST /api/submit
       ├─ 검증: submission_status === 'paid' OR 'submitted'
       ├─ Supabase: aijam_submissions INSERT
       ├─ Supabase: aijam_registrations UPDATE
       │   submission_status = 'submitted'
       └─ 이메일: sendSubmissionConfirmation (참가자)

    재제출: /submit/resubmit?email=...
       └─ 동일 플로우 (기제출 체크 우회)

[4] 이메일 자동화 (Vercel Cron — 매일 09:00 UTC)
    └─ GET /api/cron  [Authorization: Bearer CRON_SECRET]
       └─ aijam_registrations 전체 조회
          ├─ email_sequence_day = 1 → sendSequenceDay1 (가이드북)
          ├─ email_sequence_day = 2 → sendSequenceDay2 (제출 폼 안내)
          ├─ email_sequence_day = 3 → sendSequenceDay3 (카테고리 예시)
          ├─ email_sequence_day = 4 → (이메일 없음, day만 증가)
          ├─ email_sequence_day = 5 → sendSequenceDay5 (마감일 리마인더)
          ├─ email_sequence_day = 6 → (이메일 없음, day만 증가)
          ├─ email_sequence_day = 7 → sendSequenceDay7 (결제 독촉, registered만)
          └─ email_sequence_day += 1 업데이트
```

---

## 6. 내일 해야 할 작업 목록

### 🔴 최우선 — Stripe Live 모드 전환

현재 `STRIPE_SECRET_KEY`는 **test 모드** (`sk_test_...`)입니다. 실제 결제를 받으려면:

1. **Stripe 대시보드** → 우측 상단 토글 → **Live mode** 전환
2. **Developers → API keys** → Live `Secret key` 복사
3. **Vercel 대시보드** → Settings → Environment Variables
   - `STRIPE_SECRET_KEY` 값을 live key (`sk_live_...`)로 교체
4. **Stripe 대시보드 (Live mode)** → Developers → Webhooks → Add endpoint
   - URL: `https://www.aijam-us.com/api/webhook`
   - Event: `checkout.session.completed` + `payment_intent.succeeded`
   - 새 Webhook Secret 복사
5. **Vercel** → `STRIPE_WEBHOOK_SECRET` 값을 새 Live Webhook Secret으로 교체
6. Vercel **Redeploy** (환경변수 변경 반영)
7. 소액 테스트 결제로 전체 플로우 검증

### 🟡 Vercel 환경변수 추가

- `FROM_EMAIL` = `AI-JAM US <team@aijam.org>` (또는 Resend에서 인증된 주소)
- `CRON_SECRET` = 안전한 랜덤 문자열 (`openssl rand -hex 32` 로 생성)

### 🟡 Supabase 확인

- `aijam_registrations` 테이블에 `email_sequence_day` 컬럼 존재 여부 확인
  ```sql
  ALTER TABLE aijam_registrations ADD COLUMN IF NOT EXISTS email_sequence_day INT NOT NULL DEFAULT 0;
  ```
- `aijam_submissions` 테이블에 `shipping_apt`, `shipping_state`, `slides_link` 컬럼 존재 여부 확인
  ```sql
  ALTER TABLE aijam_submissions ADD COLUMN IF NOT EXISTS shipping_apt text;
  ALTER TABLE aijam_submissions ADD COLUMN IF NOT EXISTS shipping_state text;
  -- slides_link 컬럼명 확인 (기존에 slides_url이었다면 rename 필요)
  ALTER TABLE aijam_submissions RENAME COLUMN slides_url TO slides_link;
  ```

### 🟢 QA & 테스트

- [ ] Stripe Live 결제 소액 실결제 테스트
- [ ] 모바일 화면 전체 플로우 확인 (등록 → 결제 → 제출)
- [ ] 등록 → 이메일 수신 확인 (sendRegistrationConfirmed)
- [ ] 결제 → 이메일 수신 확인 (sendPaymentConfirmation)
- [ ] 제출 → 이메일 수신 확인 (sendSubmissionConfirmation)
- [ ] `/api/cron` 수동 호출 테스트 (Day 1~7 각 이메일 확인)
- [ ] 테스트 Supabase 데이터 정리 (test 계정 row 삭제)
- [ ] Vercel production 로그에서 `[submit] Confirmation email — Resend error:` 없는지 확인

---

## 7. 알려진 이슈 및 주의사항

### 이슈 목록

| 이슈 | 심각도 | 설명 | 해결 방법 |
|------|--------|------|-----------|
| `FROM_EMAIL` 미설정 | 🔴 높음 | Vercel에 `FROM_EMAIL` 없어 `team@aijam.org` fallback 사용 중 — Resend 도메인 인증 미완료 시 이메일 미발송 | Resend 대시보드 → Domains → `aijam.org` 인증 후 Vercel에 `FROM_EMAIL` 설정 |
| `CRON_SECRET` 미설정 | 🔴 높음 | Vercel에 `CRON_SECRET` 없으면 `/api/cron` 500 오류 반환, Cron 작동 안 함 | Vercel 환경변수에 `CRON_SECRET` 추가 |
| Stripe test 모드 | 🔴 높음 | 현재 test 키 — 실결제 불가 | 위 Section 6 Stripe Live 전환 절차 따를 것 |
| `email_sequence_day` 컬럼 | 🟡 중간 | 기존 DB에 없으면 Cron fetch 오류 | `ALTER TABLE` 실행 (Section 6 참고) |
| `aijam_submissions` 컬럼 | 🟡 중간 | `shipping_state`, `shipping_apt`, `slides_link` 컬럼 없으면 제출 INSERT 오류 | `ALTER TABLE` 실행 (Section 6 참고) |
| Resend `result.error` 무시 위험 | 🟢 낮음 | 기존 코드에서 `.catch()` 패턴 사용 시 Resend API 레벨 오류 무시 — 이미 수정됨 | ✅ 수정 완료 (`void IIFE + result.error 체크`) |

### 배포 관련 주의사항

- **Vercel git committer**: `ryan.koo@headstartsv.com` — GitHub 계정의 **private email 설정 OFF** 유지 필요 (ON으로 바뀌면 push 거부됨)
- **Supabase JWT verification**: Vercel 재배포 후 Supabase 대시보드 → Authentication → Settings → **JWT verification OFF** 상태인지 확인 (ON이면 anon key 요청이 모두 거부됨)
- **Supabase RLS**: `aijam_registrations`, `aijam_payments`, `aijam_submissions` 테이블에 RLS가 활성화되어 있다면 Service Role Key를 사용하는 server-side API에서는 우회됨 — 문제없음. 단, RLS policy가 없는 상태에서 anon key를 사용하면 접근 거부될 수 있음
- **Vercel Hobby Plan Cron**: Vercel Hobby 플랜은 cron 하루 1회, Pro 플랜부터 분 단위 지원 — 현재 설정(`0 9 * * *`)은 Hobby 플랜 한도 내

---

## 8. 기술 스택 요약

| 레이어 | 기술 | 버전 |
|--------|------|------|
| 프레임워크 | Next.js App Router | 14.2.5 |
| 언어 | TypeScript | ^5 |
| UI | React | ^18 |
| DB | Supabase (PostgreSQL) | ^2.105.1 |
| 이메일 | Resend | ^6.12.2 |
| 결제 | Stripe | — |
| 배포 | Vercel | — |
| Cron | Vercel Cron Jobs | `vercel.json` |
| 스타일 | CSS Variables + Inline Styles | — |
| 폰트 | Bebas Neue, Outfit, Space Mono (Google Fonts) | — |
