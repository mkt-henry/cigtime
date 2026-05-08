# cigtime 간단 서비스/기술 스펙

## 1. 서비스 개요

### 서비스명

**cigtime**

### 메인 카피

```text
Take your cigtime.

A place to let it out.
```

### 서비스 한 줄 설명

**cigtime은 사용자가 익명으로 3분 동안 머물며, 속에 있는 생각이나 감정을 한 줄로 뱉어내고 가벼워지는 웹 기반 담타 공간이다.**

### 서비스 목적

cigtime의 목적은 실제 흡연을 재현하는 것이 아니라, 담타가 가진 사회적 기능을 온라인으로 옮기는 것이다.

담타가 주는 핵심 경험은 다음과 같다.

- 잠깐 빠져나갈 명분
- 속에 있는 말 한마디를 뱉는 시간
- 옆 사람과의 느슨한 공감
- 짧은 리셋
- 말하고 나면 조금 가벼워지는 감각

cigtime은 이 경험을 **3분짜리 익명 웹 세션**으로 제공한다.

---

## 2. 핵심 사용자

### 1차 타깃

- 회사 컴퓨터 앞에 앉아 있는 직장인
- 회의, 이메일, 메신저, 문서 작업에 지친 사람
- 재택근무 중 사람 기척이 필요한 사람
- 짧게 하소연하고 다시 돌아가고 싶은 사람

### 2차 타깃

- 대학생
- 취준생
- 프리랜서
- 야근러
- 밤에 잠 안 오는 사람
- 익명으로 한 줄 남기고 싶은 사람

---

## 3. 핵심 경험

사용자 플로우는 단순해야 한다.

```text
접속
→ 방 선택
→ 오브젝트 선택
→ 3분 cigtime 시작
→ 한 줄 메시지 작성
→ 다른 사람의 반응 확인
→ 종료 화면
```

사용자가 최종적으로 느껴야 하는 감정은 다음이다.

> 말하고 나니 조금 가벼워졌다.

---

## 4. 주요 기능

## 4.1 익명 입장

- 회원가입 없이 사용한다.
- 첫 방문 시 브라우저 localStorage에 익명 사용자 ID를 생성한다.
- 랜덤 닉네임을 자동 부여한다.

예시 닉네임:

- Tired Pigeon
- Burnt Toast
- Sad Spreadsheet
- Quiet Goblin
- Broken Printer
- Midnight Raccoon
- Cold Pizza
- Slack Ghost

---

## 4.2 방 선택

MVP 기준 기본 방은 5개다.

| 방 이름 | slug | 목적 |
|---|---|---|
| The Rooftop | rooftop | 기본 담타 공간 |
| Let It Out | let-it-out | 감정 배출 / 하소연 |
| Unsent Replies | unsent-replies | 못 보낸 답장, 못 한 말 |
| Tiny Rants | tiny-rants | 사소한 불평 |
| Silent Cigtime | silent | 채팅 없이 조용히 쉬는 방 |

---

## 4.3 오브젝트 선택

오브젝트는 사용자가 cigtime 동안 바라보는 리추얼 도구다.

MVP 기본 오브젝트는 5개다.

| 오브젝트 | 동작 | 느낌 |
|---|---|---|
| Cigarette | 천천히 타들어감 | 원형 담타 |
| Candy | 조금씩 줄어듦 | 가볍고 장난스러움 |
| Incense | 연기와 함께 타들어감 | 차분함 |
| Coffee | 김이 줄고 컵이 비어감 | 사무실 휴식 |
| Candle | 촛농이 녹고 불꽃이 작아짐 | 조용한 감정 배출 |

---

## 4.4 3분 세션

- 기본 세션 시간은 3분이다.
- 세션이 시작되면 타이머가 카운트다운된다.
- 오브젝트는 시간에 따라 자동으로 변화한다.
- 세션 종료 시 요약 화면을 보여준다.

세션 종료 예시:

```text
That’s your cigtime.

You dropped 1 thought.
14 people felt it.

[ Take another ]
[ Leave lighter ]
```

---

## 4.5 실시간 한 줄 채팅

- 사용자는 방 안에서 한 줄 메시지를 작성할 수 있다.
- 메시지는 짧고 가볍게 남기는 것을 기본으로 한다.
- 긴 대화보다 순간적인 배출과 공감이 핵심이다.

메시지 정책:

| 항목 | 정책 |
|---|---|
| 최대 길이 | 140자 |
| 링크 | MVP에서 금지 |
| 이미지 | 금지 |
| 멘션 | 금지 |
| DM | 없음 |
| 연속 전송 | 10초 쿨다운 |

입력창 예시:

```text
Let it out...
```

방별 placeholder 예시:

| 방 | placeholder |
|---|---|
| The Rooftop | Let it out... |
| Let It Out | What do you need to get out? |
| Unsent Replies | Say the reply you never sent. |
| Tiny Rants | What’s your tiny rant? |
| Silent Cigtime | Quiet room. No words needed. |

---

## 4.6 반응 기능

메시지에는 짧은 공감 반응을 남길 수 있다.

MVP 반응 5개:

```text
same · real · oof · lol · hug
```

반응 의미:

| 반응 | 의미 |
|---|---|
| same | 나도 |
| real | 진짜다 |
| oof | 아... |
| lol | 웃김 |
| hug | 위로 |

표시 예시:

```text
I should’ve said no to that call.
same 12 · oof 4 · hug 2
```

---

## 4.7 신고 / 뮤트

익명 실시간 서비스이므로 최소한의 안전 기능이 필요하다.

기능:

- 메시지 신고
- 특정 유저 뮤트
- 링크 차단
- 전화번호 / 이메일 차단
- 도배 방지
- 신고 누적 메시지 임시 숨김

신고 사유:

- harassment
- hate
- sexual
- self_harm
- personal_info
- spam
- other

---

## 5. 화면 구성

## 5.1 랜딩 화면

목적: 사용자가 서비스 분위기를 빠르게 이해하고 바로 입장하게 한다.

구성:

```text
cigtime

Take your cigtime.

A place to let it out.

[ Let it out ]
```

하단 보조 문구:

```text
Choose your ritual.
Drop a thought.
Leave lighter.
```

미리보기:

```text
Objects:
Cigarette · Candy · Incense · Coffee · Candle

Rooms:
The Rooftop · Let It Out · Unsent Replies · Tiny Rants · Silent Cigtime
```

---

## 5.2 방 선택 화면

구성:

```text
Where are you taking your cigtime?

[ The Rooftop ]
[ Let It Out ]
[ Unsent Replies ]
[ Tiny Rants ]
[ Silent Cigtime ]
```

MVP에서는 랜딩 CTA 클릭 시 바로 기본 방인 `The Rooftop`으로 이동해도 된다.

---

## 5.3 세션 화면

데스크톱 기준 기본 구성:

```text
------------------------------------------------
cigtime                         218 online
Room: The Rooftop        Object: Cigarette ▼
------------------------------------------------

                 [ 오브젝트 영역 ]

              Take your cigtime
                   02:47

------------------------------------------------

Tired Pigeon
I just need one quiet minute today.
same 12 · hug 3

Burnt Toast
I typed “thanks!” and meant none of it.
real 8 · oof 4

[ Let it out...                              Send ]
------------------------------------------------
```

화면 영역:

| 영역 | 역할 |
|---|---|
| Header | 로고, 온라인 수 |
| Room Bar | 현재 방, 오브젝트 선택 |
| Object Area | 리추얼 오브젝트 애니메이션 |
| Timer | 3분 카운트다운 |
| Chat Feed | 실시간 메시지 |
| Input | 한 줄 메시지 입력 |
| Reaction Bar | 메시지별 반응 |
| Message Menu | 신고 / 뮤트 |

---

## 5.4 종료 화면

구성:

```text
That’s your cigtime.

You dropped 1 thought.
14 people felt it.

[ Take another ]
[ Leave lighter ]
```

역할:

- 세션 완료감 제공
- 반응 수 요약
- 다시 하기 유도
- 깔끔한 종료 경험 제공

---

## 6. 기술 스택

확정 스택:

```text
Next.js
Supabase
Vercel
```

## 6.1 Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion

## 6.2 Backend / Database

- Supabase Postgres
- Supabase Realtime
- Supabase Presence
- Next.js Route Handlers

## 6.3 Deployment

- Vercel

## 6.4 Auth

- Supabase Auth 사용 안 함
- localStorage 기반 익명 사용자

---

## 7. 시스템 구조

```text
User Browser
  ↓
Next.js App on Vercel
  ↓
Supabase Postgres

Realtime:
Browser ↔ Supabase Realtime

Write APIs:
Browser → Next.js Route Handler → Supabase Service Role → Postgres

Read:
Browser → Supabase Anon Client → Public Views
```

---

## 8. Next.js 라우팅 구조

```text
/
랜딩 페이지

/rooms
방 선택 페이지

/room/[roomSlug]
세션 / 채팅 페이지

/privacy
개인정보처리방침

/terms
이용약관

/guidelines
커뮤니티 가이드라인
```

MVP에서는 다음 플로우를 우선한다.

```text
/ → /room/rooftop
```

---

## 9. Supabase 테이블 구조 요약

## 9.1 rooms

방 정보 저장.

```sql
create table rooms (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  placeholder text,
  is_silent boolean default false,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);
```

## 9.2 ritual_objects

오브젝트 정보 저장.

```sql
create table ritual_objects (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text not null,
  category text not null,
  animation_type text not null,
  default_duration_sec integer default 180,
  is_active boolean default true,
  created_at timestamptz default now()
);
```

## 9.3 sessions

사용자의 3분 세션 저장.

```sql
create table sessions (
  id uuid primary key default gen_random_uuid(),
  anonymous_user_id text not null,
  nickname text not null,
  room_id uuid references rooms(id),
  object_id uuid references ritual_objects(id),
  started_at timestamptz default now(),
  ends_at timestamptz,
  duration_sec integer default 180,
  status text default 'active'
);
```

## 9.4 messages

채팅 메시지 저장.

```sql
create table messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id),
  session_id uuid references sessions(id),
  anonymous_user_id text not null,
  nickname text not null,
  body text not null,
  is_deleted boolean default false,
  is_reported_hidden boolean default false,
  created_at timestamptz default now()
);
```

## 9.5 reactions

메시지 반응 저장.

```sql
create table reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references messages(id) on delete cascade,
  anonymous_user_id text not null,
  reaction_type text not null,
  created_at timestamptz default now(),
  unique(message_id, anonymous_user_id)
);
```

## 9.6 reports

신고 저장.

```sql
create table reports (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references messages(id),
  reporter_anonymous_user_id text not null,
  reported_anonymous_user_id text not null,
  reason text not null,
  status text default 'pending',
  created_at timestamptz default now()
);
```

---

## 10. API Routes

## 10.1 POST /api/sessions

세션 생성.

Request:

```json
{
  "anonymousUserId": "anon_x",
  "nickname": "Tired Pigeon",
  "roomSlug": "rooftop",
  "objectKey": "cigarette",
  "durationSec": 180
}
```

---

## 10.2 POST /api/messages

메시지 전송.

Request:

```json
{
  "roomSlug": "rooftop",
  "sessionId": "uuid",
  "anonymousUserId": "anon_x",
  "nickname": "Tired Pigeon",
  "body": "I should have said no."
}
```

검증:

- 1자 이상 140자 이하
- 링크 차단
- 이메일 / 전화번호 차단
- 10초 쿨다운
- silent room에서는 전송 불가

---

## 10.3 POST /api/reactions

반응 추가 또는 변경.

Request:

```json
{
  "messageId": "uuid",
  "anonymousUserId": "anon_x",
  "reactionType": "same"
}
```

정책:

- 한 메시지당 유저 1명은 반응 1개만 가능
- 다른 반응을 누르면 기존 반응 변경

---

## 10.4 POST /api/reports

메시지 신고.

Request:

```json
{
  "messageId": "uuid",
  "reporterAnonymousUserId": "anon_x",
  "reason": "harassment"
}
```

처리:

- 신고 저장
- 같은 메시지 신고 수 확인
- 기준치 이상이면 `is_reported_hidden = true`

---

## 11. Supabase Realtime

Realtime 사용 테이블:

- messages
- reactions

설정:

```sql
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table reactions;
```

방 단위 메시지 구독:

```ts
supabase
  .channel(`room:${roomId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `room_id=eq.${roomId}`,
    },
    (payload) => {
      // 새 메시지 추가
    }
  )
  .subscribe();
```

온라인 수는 Supabase Presence로 구현한다.

---

## 12. 프로젝트 구조

```text
cigtime/
  app/
    page.tsx
    rooms/
      page.tsx
    room/
      [roomSlug]/
        page.tsx
    api/
      sessions/
        route.ts
      messages/
        route.ts
      reactions/
        route.ts
      reports/
        route.ts
    privacy/
      page.tsx
    terms/
      page.tsx
    guidelines/
      page.tsx

  components/
    landing/
      Hero.tsx
      ObjectPreview.tsx
      RoomPreview.tsx

    room/
      RoomShell.tsx
      RoomHeader.tsx
      ObjectSelector.tsx
      RitualObject.tsx
      SessionTimer.tsx
      ChatFeed.tsx
      ChatMessage.tsx
      ChatInput.tsx
      ReactionBar.tsx
      MessageMenu.tsx
      SessionEndModal.tsx

    common/
      Button.tsx
      Modal.tsx
      Toast.tsx

  lib/
    supabase/
      client.ts
      server.ts
    anonymous.ts
    nickname.ts
    filters.ts
    constants.ts
    types.ts

  hooks/
    useAnonymousUser.ts
    useRoomMessages.ts
    useRealtimeMessages.ts
    useSessionTimer.ts
    useMutedUsers.ts
```

---

## 13. 환경변수

Vercel / 로컬 환경변수:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
MESSAGE_RETENTION_HOURS=24
REPORT_HIDE_THRESHOLD=3
```

주의:

- `SUPABASE_SERVICE_ROLE_KEY`는 서버에서만 사용한다.
- `NEXT_PUBLIC_` prefix를 붙이면 안 된다.

---

## 14. MVP 개발 우선순위

## Sprint 1. 기본 구조

- Next.js 프로젝트 생성
- Tailwind 설정
- Supabase 연결
- 랜딩 페이지 구현
- 익명 유저 localStorage 생성

## Sprint 2. 방 / 오브젝트

- rooms 테이블 생성
- ritual_objects 테이블 생성
- seed 데이터 입력
- 방 페이지 구현
- 오브젝트 선택 UI 구현

## Sprint 3. 세션

- `/api/sessions` 구현
- 3분 타이머 구현
- 오브젝트 진행 애니메이션 구현
- 종료 화면 구현

## Sprint 4. 채팅

- messages 테이블 생성
- `/api/messages` 구현
- 최근 메시지 조회
- Supabase Realtime 구독
- 메시지 필터 / 쿨다운 구현

## Sprint 5. 반응 / 신고

- reactions 테이블 생성
- `/api/reactions` 구현
- reports 테이블 생성
- `/api/reports` 구현
- 뮤트 기능 구현

## Sprint 6. 배포 / QA

- Vercel 배포
- 환경변수 등록
- 개인정보 / 이용약관 / 가이드라인 페이지 작성
- 기본 QA

---

## 15. 핵심 지표

MVP에서 확인할 지표:

| 지표 | 의미 |
|---|---|
| CTA 클릭률 | 랜딩에서 진입하는지 |
| 세션 시작률 | 사용자가 cigtime을 시작하는지 |
| 첫 메시지 작성률 | let-out 경험이 작동하는지 |
| 반응 받은 메시지 비율 | 공감 구조가 작동하는지 |
| 세션 완료율 | 3분 길이가 적절한지 |
| 재시작률 | 다시 하고 싶은지 |
| 신고율 | 운영 리스크 |

---

## 16. 최종 MVP 요약

```text
서비스명:
cigtime

메인 카피:
Take your cigtime.
A place to let it out.

스택:
Next.js + Supabase + Vercel

핵심 기능:
익명 입장
랜덤 닉네임
방 5개
오브젝트 5개
3분 세션
실시간 한 줄 채팅
same / real / oof / lol / hug 반응
신고 / 뮤트 / 필터
세션 종료 요약

핵심 경험:
Drop a thought.
Get a reaction.
Leave lighter.
```

---

## 17. 제품 원칙

개발 중 의사결정 기준은 다음이다.

1. 빠르게 들어갈 수 있어야 한다.
2. 오래 머무르게 만들기보다 짧게 끝나야 한다.
3. 메시지는 한 줄이면 충분하다.
4. 관계보다 순간 공감이 중요하다.
5. 담배는 상징이고, 핵심은 뱉어내는 시간이다.
6. 사용자는 나갈 때 조금 가벼워져야 한다.
