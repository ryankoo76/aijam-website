# aijam-website 프로젝트 현황 보고

> 최종 업데이트: 2026-04-29

---

## 1. 완료된 기능 목록

| # | 기능 | 상태 |
|---|------|------|
| 1 | 전체 UI 폰트 사이즈 리마스터 (globals.css + 모든 컴포넌트 인라인) | ✅ |
| 2 | `AIJAM_Guidebook_2026.pdf` → `public/` 추가, 모든 다운로드 버튼 실제 링크 연결 | ✅ |
| 3 | `lib/supabase.ts` — 서버사이드 admin 클라이언트 | ✅ |
| 4 | `lib/email.ts` — Resend 이메일 2종 (참가자 확인 + 관리자 알림) | ✅ |
| 5 | `app/api/register/route.ts` — 등록 POST API | ✅ |
| 6 | `components/PageRegister.tsx` — 실제 API 호출, 로딩/성공/에러 상태 | ✅ |
| 7 | `.env.local` — Resend, Supabase, Stripe 키 설정 | ✅ |
| 8 | `IMPLEMENTATION_PLAN.md` — 5-phase 구현 계획 문서 | ✅ |
| 9 | ChatWidget FAQ — 가이드북 링크 실제 URL로 연결 | ✅ |
| 10 | `npm run build` 에러 없음, `git push` 완료 | ✅ |

---

## 2. 현재 파일/폴더 구조

```
aijam-website/
├── app/
│   ├── api/
│   │   └── register/
│   │       └── route.ts          ← POST /api/register (등록 처리)
│   ├── globals.css               ← 전체 CSS (폰트 사이즈 리마스터 완료)
│   ├── layout.tsx
│   └── page.tsx                  ← SPA 메인 (5탭 display:block/none)
├── components/
│   ├── ChatWidget.tsx            ← 가이드북 링크 업데이트 완료
│   ├── Footer.tsx
│   ├── Nav.tsx
│   ├── PageAbout.tsx             ← 폰트 사이즈 수정 완료
│   ├── PageAsia.tsx
│   ├── PageHome.tsx              ← 폰트 + 다운로드 버튼 수정 완료
│   ├── PageRegister.tsx          ← API 호출 + 상태 관리 완료
│   └── PageWinners.tsx           ← 폰트 사이즈 수정 완료
├── lib/
│   ├── email.ts                  ← Resend 이메일 2종
│   └── supabase.ts               ← supabaseAdmin 클라이언트
├── public/
│   └── AIJAM_Guidebook_2026.pdf  ← 실제 PDF 파일
├── doc/
│   └── PROJECT_STATUS.md         ← 이 문서
├── .env.local                    ← 환경변수 (gitignored ✓)
├── IMPLEMENTATION_PLAN.md        ← 5-phase 구현 계획
├── next.config.js
└── package.json
```

---

## 3. 사용 중인 기술 스택

| 레이어 | 기술 | 버전 |
|--------|------|------|
| 프레임워크 | Next.js (App Router) | 14.2.5 |
| 언어 | TypeScript | ^5 |
| UI | React | ^18 |
| DB | Supabase (PostgreSQL) | ^2.105.1 |
| 이메일 | Resend | ^6.12.2 |
| 결제 | Stripe | 키만 있음, 미구현 |
| 배포 | Vercel | — |
| 스타일 | CSS Variables + Inline Styles | — |
| 폰트 | Bebas Neue, Outfit, Space Mono (Google Fonts) | — |

---

## 4. Supabase 테이블 구조 — `aijam_registrations`

코드(`app/api/register/route.ts`)에서 insert하는 컬럼 기준:

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| `id` | uuid (PK) | 자동 생성 |
| `created_at` | timestamptz | 자동 생성 |
| `first_name` | text | 필수 |
| `last_name` | text | 선택 (빈값 허용) |
| `email` | text | 필수, 소문자 변환 |
| `country` | text | 필수 |
| `school` | text | 필수 |
| `participant_type` | text | 'Student — Individual' / 'Student Team (2–5 members)' / 'Teacher / School' |
| `is_teacher` | boolean | 기본값 false |
| `email_sequence_day` | int | 기본값 0 (이메일 시퀀스 추적용) |
| `submission_status` | text | 기본값 'registered' |

### CREATE TABLE SQL

Supabase 대시보드 → SQL Editor에서 실행:

```sql
create table aijam_registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  first_name text not null,
  last_name text default '',
  email text not null,
  country text not null,
  school text not null,
  participant_type text not null,
  is_teacher boolean default false,
  email_sequence_day int default 0,
  submission_status text default 'registered'
);
```

---

## 5. 현재 작동하는 페이지/라우트

| URL | 방식 | 설명 |
|-----|------|------|
| `/` | SPA (page.tsx) | 홈, About, Register, Winners, Asia 탭 포함 |
| `/AIJAM_Guidebook_2026.pdf` | Static | 가이드북 PDF 직접 접근 |
| `POST /api/register` | API Route | 등록 처리 → Supabase 저장 → 이메일 발송 |

---

## 6. 미완성 / TODO 기능 목록

| 기능 | 관련 PHASE |
|------|-----------|
| 프로젝트 제출 폼 (`/submit` 페이지) | PHASE 3 |
| 제출 API (`POST /api/submit`) | PHASE 3 |
| Day 0~14 이메일 시퀀스 (Vercel Cron) | PHASE 4 |
| 제출 후 결제 독촉 이메일 시퀀스 | PHASE 4 |
| Stripe 결제 페이지 (`/pay`) | PHASE 5 |
| Stripe Checkout 세션 API (`/api/checkout`) | PHASE 5 |
| Stripe 웹훅 (`/api/webhook`) | PHASE 5 |
| 결제 완료 페이지 (`/pay/success`) | PHASE 5 |
| Vercel 환경변수 업데이트 (새 Supabase 크레덴셜) | 인프라 |
| `vercel.json` cron 설정 | PHASE 4 |

---

## 7. 다음 구현 단계 (우선순위 순)

### 즉시 해야 할 것 (배포 전 필수)

1. **Supabase 대시보드** → SQL Editor → `aijam_registrations` CREATE TABLE 실행 (위 SQL 참고)
2. **Vercel 대시보드** → Environment Variables → 새 Supabase URL/키 입력
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://bfhodobfjqvknkcohktm.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_...`
   - `SUPABASE_SERVICE_ROLE_KEY` = `sb_secret_...`

### PHASE 3 — 프로젝트 제출 폼

3. `app/submit/page.tsx` + `components/SubmitForm.tsx` 생성
4. Section A — 카테고리, 제목, 팀원, Abstract (500자 실시간 카운터), 특징/영향/시장성
5. Section B — YouTube/Vimeo 링크, 슬라이드 PDF 업로드 (≤20MB)
6. Section C — 팀 스토리 4개 텍스트에어리어
7. Section D — 우편 주소 (수상 배송용)
8. `app/api/submit/route.ts` — Supabase `aijam_submissions` 테이블 저장

### PHASE 4 — 이메일 자동화

9. `lib/email.ts`에 13개 이메일 템플릿 추가
10. `app/api/cron/route.ts` — Vercel Cron Job (매일 09:00 UTC)
11. `vercel.json` cron 설정 (`0 9 * * *`)

### PHASE 5 — Stripe 결제

12. `app/pay/page.tsx` + `app/api/checkout/route.ts`
13. `app/api/webhook/route.ts` — 결제 완료 처리 + 확정 이메일

---

## 8. 알려진 버그/이슈

| 이슈 | 심각도 | 설명 | 해결 방법 |
|------|--------|------|-----------|
| Supabase 테이블 미생성 시 등록 500 오류 | 🔴 높음 | CREATE TABLE SQL 실행 전엔 등록 API가 DB 오류로 실패 | Section 4의 SQL 실행 |
| Vercel 환경변수 미동기화 | 🔴 높음 | 로컬 `.env.local`은 새 Supabase 크레덴셜이지만 Vercel에 미반영 가능 | Vercel 대시보드에서 수동 입력 |
| Resend 도메인 인증 | 🟡 중간 | `team@aijam.org` 발신을 위해 aijam.org DNS 인증 필요 | Resend 대시보드 → Domains → Add Domain |
| 중복 이메일 처리 없음 | 🟡 중간 | 동일 이메일 재등록 시 Supabase에 중복 row 삽입됨 | `email` 컬럼에 `unique` constraint 추가 |
| 에러 메시지 미세분화 | 🟢 낮음 | DB 오류 / 이메일 오류 구분 없이 "Something went wrong" 표시 | API 응답 코드별 메시지 분기 처리 |
| PageAsia.tsx 폰트 미검토 | 🟢 낮음 | 이번 세션에서 PageAsia는 폰트 수정 범위에서 검토 안 됨 | PageAsia 인라인 폰트 사이즈 확인 필요 |
