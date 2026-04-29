# AXGO Seoul International 2026 — 웹사이트 리빌드 제안서

> 작성일: 2026-04-29  
> 목적: axgo.org를 aijam-us.com 코드베이스로 빠르게 재구축하는 전략 제안  
> 리서치 대상: https://axgo.org  
> 코딩 없음 — 분석 및 전략 제안서

---

## 1. axgo.org 현황 분석

### 사이트 개요

| 항목 | 내용 |
|------|------|
| 정식 명칭 | AXGO — AX Global Olympiad Seoul International 2026 |
| 주최 | PAIAX (Korea) + AI-JAM US + Hacker Dojo (Silicon Valley) |
| 장소 | Sogang University, Hongdae, Seoul |
| 일정 | 2026년 7월 13–15일 (3일 현장 행사) |
| 참가 대상 | 전 세계 고등학생 + 대학생 (팀/개인 모두 가능) |
| 파트너 대학 | Sogang, Yonsei, Ewha (서울 홍대 클러스터) |
| 파트너 국가 | 15개국 이상 (베트남, 인도네시아, 싱가포르, 말레이시아, UAE, 대만 등) |

### 4개 경쟁 트랙

| 트랙 | 분야 | 심사 기준 |
|------|------|----------|
| Track A — Invention & Prototype | 하드웨어, 개념 모델, 프로토타입 | 독창성, 실현 가능성, 시연 품질 |
| Track B — Research & Findings | 농업, 의료, 환경, 사회적 영향 연구 | 연구 질문 명확성, 방법론, 증거 |
| Track C — AI-Powered Solutions | 앱, 자동화, AI 에이전트 | 문제 정의, 작동 시연, 도구 사용 |
| Track D — AI Arts | AI 영상/음악/애니메이션 | 창의성, AI 통합도, 완성도 |

### 시상 구조

- **Grand Prix**: 전 트랙 통합 최우수
- **Gold / Silver / Bronze**: 트랙별 1·2·3위
- **Special Jury Prizes**: 혁신상, 사회영향상 등
- **Certificates**: 전 참가자
- **Silicon Valley Invitation**: 상위 입상자 → 2026년 12월 캘리포니아 Finals

### 3일 행사 일정

| 일차 | 내용 |
|------|------|
| Day 0 (7/13) | 부스 설치 (15:00–18:00) |
| Day 1 | 개회식, 전시 시작, 심사 시작, 홍대 Welcome Dinner |
| Day 2 | 전시 계속, 스테이지 발표, 최종 심사 마감 |
| Day 3 (7/15) | 시상식 09:00, 단체 사진 12:00, 해산 |

---

## 2. 현재 axgo.org의 기술적 한계

### 현황

axgo.org는 **Gamma.app** 으로 만들어진 프레젠테이션형 사이트입니다.  
(CDN 도메인: `cdn.gamma.app`, `imgproxy.gamma.app` 사용 확인)

| 항목 | axgo.org 현재 | aijam-us.com |
|------|--------------|--------------|
| 사이트 종류 | Gamma 슬라이드형 랜딩페이지 | Next.js 14 풀스택 앱 |
| 등록 | 외부 Google Forms 링크 | 자체 폼 → Supabase 저장 |
| 결제 | ❌ 없음 | Stripe Checkout + Webhook |
| 제출 포털 | ❌ 없음 | 15개 필드 제출 폼 + DB |
| 이메일 자동화 | ❌ 없음 | Resend 9종 + Vercel Cron |
| 데이터 관리 | ❌ Google Forms 스프레드시트 | Supabase (3개 테이블) |
| 재제출 | ❌ 없음 | /submit/resubmit 지원 |
| 운영 가시성 | ❌ 없음 | 로그 + Supabase 대시보드 |

### 핵심 문제점

1. **데이터 유실 위험**: Google Forms 데이터는 팀 관리가 어렵고, 결제·제출과 연동 불가
2. **결제 수동 처리**: 참가비를 별도 계좌이체/PayPal로 받을 경우 운영 부담 폭증
3. **이메일 수동 발송**: 참가자 150명 이상이면 Day 1~7 시퀀스 이메일을 수동으로 보내는 것은 불가능
4. **확장 불가**: Gamma 사이트는 코드 수정, 추가 기능 없음

---

## 3. 리빌드 전략 — aijam-us.com 코드베이스 재사용

### 핵심 아이디어: "White-Label Fork"

aijam-us.com 전체 코드베이스를 그대로 **복제(fork)** 한 뒤, **콘텐츠와 브랜딩만 교체**합니다.  
로직·인프라·이메일 파이프라인은 100% 재사용 가능합니다.

```
aijam-website (기존)
       │
       ▼  git clone / fork
axgo-website (신규)
       │
       ▼  변경 사항
  - 브랜딩: AXGO, Sogang, 서울 색상
  - 콘텐츠: 4 트랙, 3일 일정, 홍대 섹션
  - 이메일 템플릿: AXGO 내용으로 교체
  - 환경변수: 새 Supabase/Stripe/Resend 인스턴스
  - 도메인: axgo.org → Vercel
```

### 재사용 가능 항목 (변경 없이 또는 최소 수정)

| 파일/기능 | 재사용 방식 |
|----------|------------|
| `lib/supabase.ts` | **그대로** — 환경변수만 교체 |
| `app/api/register/route.ts` | **거의 그대로** — 필드명 조정 정도 |
| `app/api/checkout/route.ts` | **그대로** — Stripe 가격만 변경 |
| `app/api/webhook/route.ts` | **그대로** — 환경변수만 교체 |
| `app/api/submit/route.ts` | **수정 필요** — 트랙 기반으로 필드 재구성 |
| `app/api/cron/route.ts` | **거의 그대로** — 이메일 함수 연결만 변경 |
| `app/pay/page.tsx` | **거의 그대로** — 금액·텍스트만 변경 |
| `app/pay/success/page.tsx` | **거의 그대로** — 텍스트만 변경 |
| `app/submit/page.tsx` | **수정 필요** — 트랙 선택 + 현장 행사 맞춤 |
| `vercel.json` | **그대로** |
| `lib/email.ts` 구조 | **구조 재사용** — 콘텐츠 전면 교체 |

---

## 4. AXGO 고유 차이점 — 구현 시 고려사항

### 4-1. 등록 → 심사(Review) → 결제 플로우

aijam-us.com은 `등록 → 결제 → 제출` 순서이지만,  
axgo.org의 안내에 따르면 **"Apply → Review (2주 이내 확인) → 결제"** 순서입니다.

```
[현재 aijam-us.com]
등록 → 즉시 결제 가능 → 제출

[AXGO 방식]
등록(Apply) → 주최측 심사(2주) → 합격 통보 → 결제 → 현장 참가
```

**구현 방법**: `submission_status` 컬럼 값을 확장하면 됨
```
'applied'     ← 신청 완료, 심사 대기
'accepted'    ← 합격 통보 (관리자가 수동 업데이트 또는 Admin API)
'paid'        ← 결제 완료
'attending'   ← 현장 참석 확정
```

### 4-2. 제출 폼 구성 차이

aijam-us.com 제출 폼은 **온라인 프로젝트 제출** 중심이지만,  
AXGO는 **현장 전시** 이벤트이므로 폼 구성이 달라집니다.

| 항목 | aijam-us.com | AXGO |
|------|-------------|------|
| 비디오 URL | 필수 (30초 영상) | 선택 (보조 자료) |
| 슬라이드 링크 | 선택 | 필수 (부스 발표용) |
| 배송 주소 | 필수 (우편 배송) | 필수 (인증서 배송) |
| 트랙 선택 | 단일 카테고리 | Track A/B/C/D 중 선택 |
| 팀 규모 | 텍스트 입력 | 인원수 명시 권장 |
| 비행편 정보 | ❌ | 향후 추가 고려 (국제 참가자) |
| 부스 장비 필요 여부 | ❌ | 향후 추가 고려 |

### 4-3. 이메일 시퀀스 콘텐츠 차이

Day 1~7 이메일 내용이 달라지지만, **함수 구조·Cron 로직은 100% 동일**합니다.

| Day | aijam-us.com | AXGO |
|-----|-------------|------|
| 1 | 가이드북 다운로드 | AXGO Guidebook + Campus Tour 안내 |
| 2 | 제출 폼 안내 | 발표 준비 가이드 (부스 규격, 스테이지 포맷) |
| 3 | 카테고리 예시 프로젝트 | 트랙별 예시 프로젝트 (A/B/C/D) |
| 5 | 마감일 리마인더 | 등록 마감 + 항공편 예약 독려 |
| 7 | 결제 독촉 | 합격자 결제 독촉 OR 미합격자 대기 안내 |

### 4-4. 물리적 행사 특성상 추가 필요 기능

| 기능 | 필요도 | 비고 |
|------|--------|------|
| 참가 확정 이메일 (합격 통보) | 🔴 필수 | 관리자가 수동 트리거 |
| 행사 안내 이메일 (7/1경 발송) | 🔴 필수 | 부스 번호, 일정표, Hongdae 지도 |
| 항공/숙박 안내 이메일 | 🟡 권장 | 국제 참가자 대상 |
| QR 코드 체크인 | 🟢 선택 | 현장 입장 관리 (추후 Phase) |

---

## 5. 신규 인프라 구성

### 별도로 생성해야 하는 외부 서비스 계정

| 서비스 | 용도 | 신규 생성 필요 여부 |
|--------|------|-------------------|
| Supabase | axgo 전용 DB (axgo_registrations 등) | ✅ 새 프로젝트 생성 |
| Stripe | axgo 결제 (별도 계정 권장) | ✅ 또는 기존 계정에 새 Product 추가 |
| Resend | axgo.org 도메인 인증 | ✅ axgo.org DNS 레코드 추가 필요 |
| Vercel | axgo-website 별도 프로젝트 | ✅ 새 프로젝트 + axgo.org 도메인 연결 |
| GitHub | axgo-website 저장소 | ✅ private repo 생성 |

### Supabase 테이블 구조 (AXGO 맞춤)

```sql
-- aijam_registrations에서 복제 후 필드 조정
CREATE TABLE axgo_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  first_name text NOT NULL,
  last_name text DEFAULT '',
  email text NOT NULL UNIQUE,
  country text NOT NULL,
  school text NOT NULL,
  participant_type text NOT NULL,  -- 'Individual' / 'Team (2–4)'
  track text NOT NULL,             -- 'A' / 'B' / 'C' / 'D'
  team_size int DEFAULT 1,
  project_title text,
  submission_status text DEFAULT 'applied',  -- applied → accepted → paid → attending
  email_sequence_day int DEFAULT 0
);

CREATE TABLE axgo_payments (
  -- aijam_payments와 동일 구조
);

CREATE TABLE axgo_submissions (
  -- aijam_submissions에서 필드 조정
  -- video_url: 선택
  -- slides_link: 필수
  -- track: 필수 (A/B/C/D)
  -- booth_equipment_needed: boolean 선택
);
```

### Vercel 환경변수 (신규 세팅 필요)

| 키 이름 | 값 출처 |
|---------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | 새 Supabase 프로젝트 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 새 Supabase 프로젝트 |
| `SUPABASE_SERVICE_ROLE_KEY` | 새 Supabase 프로젝트 |
| `STRIPE_SECRET_KEY` | Stripe Live 키 (axgo용) |
| `STRIPE_WEBHOOK_SECRET` | 새 Webhook 등록 후 |
| `RESEND_API_KEY` | 기존 공유 가능 |
| `FROM_EMAIL` | `AXGO Seoul <team@axgo.org>` |
| `NEXT_PUBLIC_BASE_URL` | `https://axgo.org` |
| `CRON_SECRET` | 새로 생성 |

---

## 6. 브랜딩 & 디자인 방향

### axgo.org 현재 디자인

- **테마**: Light (밝은 배경)
- **스타일**: Gamma 자동생성 — 카드형 레이아웃
- **느낌**: 깔끔하지만 기능 없는 브로슈어 수준

### aijam-us.com 디자인 시스템

- **테마**: Dark (`#0a0a0f` 배경, `#111118` 카드)
- **폰트**: Bebas Neue (타이틀) + Outfit (본문) + Space Mono (레이블)
- **색상**: 파란/보라 그라디언트 (`#1e40af → #7c3aed`)

### AXGO 권장 디자인 방향

Dark 테마 기반 유지하되, AXGO만의 색상 정체성 적용:

| 요소 | aijam-us.com | AXGO 제안 |
|------|-------------|-----------|
| 주 색상 | 파랑 + 보라 | **청록 + 금색** (`#0f766e → #d97706`) — 서울/한국 느낌 |
| 포인트 색 | `#7c3aed` (보라) | **`#dc2626`** (빨강) — 한국 국기 레드 활용 가능 |
| 배경 | `#0a0a0f` | 동일 유지 |
| 타이틀 | `AI·JAM US 2026` | `AX·GO SEOUL 2026` |
| 서브타이틀 | `11TH INTERNATIONAL AI INVENTION CHALLENGE` | `AX GLOBAL OLYMPIAD — SOGANG UNIVERSITY` |

---

## 7. 구현 난이도 & 예상 작업 시간

### 작업 분류

| 작업 | 난이도 | 예상 시간 | 방법 |
|------|--------|----------|------|
| GitHub repo fork + 환경변수 세팅 | 🟢 쉬움 | 1시간 | 단순 복제 |
| 브랜딩 교체 (색상, 텍스트, 로고) | 🟢 쉬움 | 2–3시간 | 전역 찾기/바꾸기 |
| 메인 페이지 콘텐츠 교체 | 🟡 보통 | 3–4시간 | 섹션별 텍스트/이미지 교체 |
| 이메일 템플릿 5종 교체 | 🟡 보통 | 2–3시간 | HTML 콘텐츠 교체 |
| 등록 폼 필드 조정 (track 추가) | 🟡 보통 | 2시간 | 필드 추가/변경 |
| 제출 폼 재구성 (현장 행사 맞춤) | 🔴 복잡 | 4–6시간 | 섹션 재설계 |
| `applied → accepted` 상태 플로우 | 🔴 복잡 | 4–6시간 | 신규 로직 추가 |
| Supabase 테이블 생성 | 🟢 쉬움 | 1시간 | SQL 실행 |
| Stripe + Resend + Vercel 세팅 | 🟡 보통 | 2시간 | 계정/환경변수 설정 |
| 전체 테스트 | 🟡 보통 | 2–3시간 | E2E 플로우 확인 |

**총 예상 작업 시간: 약 23–31시간 (3–4일)**

> 비교: axgo.org를 완전히 처음부터 만들면 30–60일 소요  
> **코드베이스 재사용으로 약 85% 시간 단축**

### 단계별 구현 순서 (권장)

```
Phase 1 (Day 1) — 기반 세팅
  ├─ GitHub repo fork
  ├─ Vercel 프로젝트 생성 + axgo.org 도메인 연결
  ├─ Supabase 프로젝트 생성 + 테이블 생성
  └─ 환경변수 세팅

Phase 2 (Day 2) — 브랜딩 & 메인 페이지
  ├─ 색상/폰트/로고 전체 교체
  ├─ 메인 페이지 섹션 콘텐츠 교체
  │   (4트랙, 3일 일정, 홍대, 파트너 대학)
  └─ 네비게이션 구조 조정

Phase 3 (Day 3) — 등록 & 결제
  ├─ 등록 폼에 Track 선택 필드 추가
  ├─ submission_status에 'accepted' 상태 추가
  ├─ 합격 통보 이메일 함수 추가
  └─ Stripe 결제 금액/상품명 변경

Phase 4 (Day 4) — 제출 폼 & 이메일
  ├─ 제출 폼 현장 행사 맞춤 재구성
  ├─ 이메일 템플릿 5종 AXGO 버전으로 교체
  └─ 전체 플로우 E2E 테스트
```

---

## 8. 리스크 및 고려사항

| 리스크 | 설명 | 대응 방안 |
|--------|------|----------|
| `applied → accepted` 수동 관리 | 합격 심사를 관리자가 DB에서 직접 update해야 함 | Supabase 대시보드에서 status 칼럼 수동 변경, 또는 간단한 Admin 페이지 추가 |
| axgo.org 도메인 이전 | 현재 Gamma가 axgo.org를 보유 중일 가능성 | DNS 레코드를 Vercel NS로 변경하면 됨 — Gamma 사이트 자동 교체 |
| Resend axgo.org 인증 | team@axgo.org 발신을 위해 DNS TXT/DKIM 레코드 추가 필요 | axgo.org DNS 관리자에게 레코드 추가 요청 |
| 행사 특성 (물리 전시) | 온라인 제출과 달리 부스 번호 배정, 장비 목록 등 운영 요소 존재 | 초기 버전에서는 단순화, v2에서 확장 |
| 국제 결제 (USD vs KRW) | 서울 현장 행사이므로 KRW 결제 요구 가능 | Stripe는 KRW 지원, `currency: 'krw'` 설정으로 해결 |

---

## 9. 결론 및 권장사항

### 권장: aijam-us.com 코드베이스 White-Label Fork

**이유:**

1. **검증된 인프라**: 등록·결제·이메일·Cron 전체 파이프라인이 이미 프로덕션에서 작동 중
2. **동일 주최**: PAIAX + AI-JAM US가 공동 주최 — 브랜드 일관성보다 **운영 효율**이 중요
3. **속도**: 처음부터 만들면 최소 4–6주, 재사용하면 **3–4일 내 런칭 가능**
4. **유지보수 효율**: 한 개발자가 두 사이트를 같은 구조로 관리 가능
5. **향후 확장**: 세 번째 이벤트가 생겨도 동일 패턴으로 1–2일 내 추가 가능

### 단기 실행 가능 목표

- **런칭 목표**: 2026년 5월 말 (행사 6주 전)
- **등록 마감**: 2026년 6월 말 (행사 2주 전)
- **1차 배포**: 메인 페이지 + 등록 폼 (1주 이내)
- **2차 배포**: 결제 + 이메일 시퀀스 (2주 이내)

---

*본 문서는 코딩 없는 리서치 및 전략 제안서입니다.*  
*구현 시작 전 내용 검토 및 우선순위 확정 필요.*
