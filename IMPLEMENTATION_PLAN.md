# AI-JAM US 2026 Registration Automation
# Implementation Plan

---

## 현재 상태 (Research 결과)

### 파일 구조
```
aijam-website/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              ← SPA 메인 (5개 탭 display:block/none 방식)
├── components/
│   ├── ChatWidget.tsx
│   ├── Footer.tsx
│   ├── Nav.tsx
│   ├── PageAbout.tsx
│   ├── PageAsia.tsx
│   ├── PageHome.tsx
│   ├── PageRegister.tsx      ← 현재 등록 폼
│   └── PageWinners.tsx
├── public/
│   └── AIJAM_Guidebook_2026.pdf
├── next.config.js
├── package.json
└── .gitignore                ← .env*.local 이미 포함됨 ✓
```
- `app/api/` 디렉토리 없음 — 모든 API Route 신규 생성 필요
- `/submit`, `/pay` 페이지 없음 — App Router 신규 페이지로 생성 예정

### 현재 등록 폼 상태
- 수집 필드: FirstName, LastName, Email, Country, Type(student/teacher), School
- 처리 방식: 클라이언트 사이드 only — `submitForm()`이 로컬 state만 변경
- 백엔드 연결: 없음 (API 호출 없음, 데이터 저장 없음, 이메일 없음)
- 성공 표시: 로컬 `submitted` state → 녹색 버튼 + 성공 메시지 표시

### 설치된 패키지
```json
dependencies:    next@14.2.5, react@^18, react-dom@^18
devDependencies: typescript@^5, @types/node, @types/react, @types/react-dom
```
- googleapis, nodemailer, stripe — 미설치 (PHASE별 설치 필요)

### 환경변수 현황
- `.env.local` 파일 없음 (블랭크 슬레이트)
- `.gitignore`에 `.env*.local` 이미 포함 → 커밋 위험 없음 ✓

---

## 구현 단계 (순서대로)

### PHASE 1: 기반 인프라 ✅ COMPLETE
**목표:** Supabase + Resend 연동 기반 구축
**변경사항:** Google Sheets → Supabase / Gmail → Resend

**완료된 작업:**
1. 패키지 설치: `resend@6.12.2`, `@supabase/supabase-js@2.105.1`
2. `lib/supabase.ts` — supabaseAdmin 서버 클라이언트
3. `lib/email.ts` — Resend 이메일 2종 (참가자 확인, 관리자 알림)
4. `app/api/register/route.ts` — POST 등록 처리
5. `components/PageRegister.tsx` — 실제 API 호출로 수정
6. `.env.local` 생성 (gitignore 적용 ✓)

**완료 기준:** ✅ npm run build 에러 없음

---

### PHASE 2: STEP 1 등록 폼 (기존 PageRegister 개선)
**목표:** 이름·이메일·국가·학교 수집 → Sheets 저장 → 자동 이메일
**예상 시간:** 2시간

**작업:**
1. `PageRegister.tsx` 수정
   - `submitForm()` → `/api/register` POST 호출로 교체
   - 로딩 상태 추가 (버튼 disable + 스피너)
   - 에러 상태 처리 (API 실패 시 메시지 표시)
2. `app/api/register/route.ts` 생성
   - 필드 유효성 검사
   - Sheets `REGISTRATIONS` 탭에 행 저장 (고유 RegID 생성: `AJ2026-XXXXX`)
   - Day 0 확인 이메일 발송 (console.log 대체)
   - `team@aijam.org` 알림 이메일 (console.log 대체)
   - 응답: `{ success: true, regId: "AJ2026-XXXXX" }`
3. 성공 화면에 RegID 표시 + `/submit` 페이지 안내 문구 추가

**완료 기준:** 폼 제출 → Sheets에 행 저장 확인 → 콘솔에 이메일 내용 출력

---

### PHASE 3: STEP 2 출품 폼 신규 페이지
**목표:** 프로젝트 정보 + 주소 수집
**예상 시간:** 3시간

**라우팅 방식:** App Router 신규 페이지 (`app/submit/page.tsx`)
- URL: `/submit?regId=AJ2026-XXXXX`
- `'use client'` 컴포넌트

**폼 섹션 구성:**

**Section A — 프로젝트 정보**
- 카테고리 (드롭다운 6개): Education AI / Healthcare AI / Environment AI / Social Impact AI / Creative AI / Other AI
- 프로젝트 제목 (텍스트)
- 팀원 이름 (텍스트, 최대 5명)
- Abstract — 500자 이내, 실시간 글자수 카운터
- Key Features & Innovations (텍스트에어리어)
- Impact & Benefits (텍스트에어리어)
- Market Potential & Future Applications (텍스트에어리어)

**Section B — 미디어**
- 30초 영상 링크 (YouTube / Vimeo / Google Drive URL)
- 슬라이드 PDF 업로드 (최대 20MB) — Vercel `/tmp` 임시 저장 → Drive 업로드

**Section C — 팀 스토리 (4개)**
- 팀 소개
- 프로젝트 시작 이유
- 가장 재미있었던 순간
- 배운 것

**Section D — 우편 주소**
- Recipient Name (영문)
- Street Address Line 1
- Street Address Line 2 (선택)
- City
- State/Province (선택)
- Postal Code
- Country (드롭다운)

**동의 체크박스** + 제출 버튼

**작업:**
1. `app/submit/page.tsx` + `components/SubmitForm.tsx` 생성
2. `app/api/submit/route.ts` 생성
   - Sheets `SUBMISSIONS` 탭 저장
   - 제출 완료 확인 이메일 (console.log 대체)
   - 24시간 후 참가비 안내 이메일 예약 트리거 기록 (Sheets MAILING 탭 플래그)

**완료 기준:** 제출 → Sheets SUBMISSIONS에 행 저장 → 콘솔에 이메일 내용 출력

---

### PHASE 4: 이메일 시퀀스 자동화
**목표:** Day 0~14 등록 후 시퀀스 + 제출 후 결제 독촉 시퀀스
**예상 시간:** 3시간

**구현 방법:** Vercel Cron Jobs (`app/api/cron/route.ts`)
- Vercel 무료 플랜: 1일 1회 실행 가능
- `vercel.json`에 cron 설정 추가

**등록 후 시퀀스 (REGISTRATIONS 탭 기준):**
| Day | 트리거 | 이메일 내용 |
|-----|--------|------------|
| 0 | 즉시 | 등록 확인 + Guidebook 링크 |
| 1 | +1일 | 출품 방법 3단계 안내 |
| 3 | +3일 | 2025 수상자 스토리 |
| 7 | +7일 | "N일 남았습니다" 카운트다운 |
| 14 | +14일 | 마지막 넛지 |

**제출 후 시퀀스 (SUBMISSIONS 탭 기준):**
| Day | 트리거 | 이메일 내용 |
|-----|--------|------------|
| 0 | 즉시 | 제출 완료 + 참가비 패키지 전체 공개 |
| 1 | +1일 | 얼리버드 마감 알림 |
| 3 | +3일 | "아직 결제 안 하셨나요?" |
| 7 | +7일 | 최종 독촉 |

**작업:**
1. `lib/email.ts`에 13개 이메일 템플릿 함수 추가 (HTML 인라인 스타일)
2. `app/api/cron/route.ts` 생성 — Sheets 조회 → 발송 대상 필터 → 이메일 발송
3. `vercel.json` 생성 — cron 스케줄 설정 (`0 9 * * *` → 매일 오전 9시 UTC)
4. PHASE 4 이후 이메일 실제 발송으로 전환

**완료 기준:** cron 엔드포인트 수동 호출 → 대상자 조회 → 콘솔에 발송 로그 출력

---

### PHASE 5: Stripe 결제
**목표:** 참가비 결제 + 완료 자동화
**예상 시간:** 2~3시간

**작업:**
1. 패키지 설치: `npm install stripe`
2. `app/pay/page.tsx` 생성 — 참가비 안내 + 결제 버튼
3. `app/api/checkout/route.ts` — Stripe Checkout 세션 생성
4. `app/api/webhook/route.ts` — 결제 완료 웹훅 처리
   - Sheets `PAYMENTS` 탭 업데이트
   - 공식 참가 확정 이메일 발송 (실제 Gmail 전환)
   - axvend 크레딧 안내 포함
5. `app/pay/success/page.tsx` — 결제 완료 감사 페이지

**완료 기준:** Stripe 테스트 카드 결제 → Sheets 업데이트 → 이메일 수신 확인

---

### PHASE 6: Google Sheets 구조 (PHASE 1 시 자동 생성)

**시트 1: REGISTRATIONS**
```
ID | Date | FirstName | LastName | Email | Country | School | Type |
EmailSequenceDay | SubmissionStatus | Notes
```

**시트 2: SUBMISSIONS**
```
RegID | SubmitDate | Category | Title | Authors | Abstract |
KeyFeatures | Impact | MarketPotential | VideoLink | SlideFile |
Story_Team | Story_Why | Story_Fun | Story_Learn |
RecipientName | Address1 | Address2 | City | State | PostalCode | Country
```

**시트 3: PAYMENTS**
```
RegID | PayDate | Amount | PriceType | StripeID | Status | AxvendCredit
```

**시트 4: MAILING**
```
RegID | Name | FullAddress | AwardLevel | ShipDate | TrackingNo | Delivered
```

---

## 환경변수 목록 (`.env.local.example`)

```bash
# Resend (이메일)
RESEND_API_KEY=                 # re_...
FROM_EMAIL=team@aijam.org

# Supabase
NEXT_PUBLIC_SUPABASE_URL=       # https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # eyJ...
SUPABASE_SERVICE_ROLE_KEY=      # eyJ... (서버 전용, 절대 노출 금지)

# Stripe
STRIPE_SECRET_KEY=              # sk_live_... 또는 sk_test_...
STRIPE_WEBHOOK_SECRET=          # whsec_...
STRIPE_PRICE_EARLYBIRD=         # price_... ($350)
STRIPE_PRICE_REGULAR=           # price_... ($400)
STRIPE_PRICE_STANDARD=          # price_... ($450)

# App
NEXT_PUBLIC_BASE_URL=https://www.aijam-us.com
```

---

## 참가비 구조

| 구분 | 기간 | 금액 | axvend 크레딧 |
|------|------|------|--------------|
| 얼리버드 | ~6/30 | $350 | $100 |
| 일반 | ~7/31 | $400 | $50 |
| 정가 | ~8/30 | $450 | $30 |
| 단체 5팀+ | — | 15% 할인 | + 교사 CPD |
| 단체 10팀+ | — | 22% 할인 | |
| 단체 20팀+ | — | 29% 할인 | |

---

## 이메일 템플릿 목록

```
01_registration_confirmed.html
02_day1_how_to_submit.html
03_day3_winner_story.html
04_day7_countdown.html
05_day14_last_nudge.html
06_submission_confirmed.html
07_payment_reminder_day1.html
08_payment_reminder_day3.html
09_payment_final_day7.html
10_payment_confirmed.html
11_results_winner.html
12_results_participant.html
13_shipping_confirmation.html
```

---

## 개발 순서 체크리스트

- [ ] **PHASE 1** 완료 확인 후 PHASE 2 시작
- [ ] **PHASE 2** 완료 확인 후 PHASE 3 시작
- [ ] **PHASE 3** 완료 확인 후 PHASE 4 시작
- [ ] **PHASE 4** 완료 확인 후 PHASE 5 시작
- [ ] 전체 통합 테스트 완료
- [ ] `git push` → Vercel 자동 배포
- [ ] Vercel 대시보드 환경변수 설정
- [ ] 실제 이메일 발송 엔드-투-엔드 테스트

---

## 주의사항

- `.env.local`은 `.gitignore`에 이미 포함 → 절대 커밋되지 않음 ✓
- PHASE 5 전까지 이메일 발송은 모두 `console.log`로 대체
- 각 PHASE 완료 시 `npm run build` 에러 없어야 다음 진행
- Stripe 개발 중 `stripe listen --forward-to localhost:3000/api/webhook` 필요
- Google 서비스 계정 생성 시 Sheets에 편집자 권한 부여 필수
