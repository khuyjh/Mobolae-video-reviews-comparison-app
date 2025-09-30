<img width="1200" height="630" alt="OGImg" src="https://github.com/user-attachments/assets/df208425-ac07-45a7-9ff5-091fa2355bb7" />

## ⭐ 프로젝트 개요 - [배포 링크](https://mobolae.vercel.app/)
- 진행 기간: 2025/08/20 ~ 2025/09/30
- 영화, 드라마 등 문화 관련 카테고리의 작품 중 두 개씩 골라 A/B 비교하고, 리뷰·별점·후기 데이터를 합쳐 랭킹/추천을 제공하는 플랫폼입니다. Next.js의 렌더링 전략(SSR/SSG/CSR) 을 페이지 특성에 맞게 혼합 적용하고, 무한 스크롤·SEO·공유·검색/정렬을 지원합니다.

### ❓ 주제 선정 이유
- 영화·드라마 같은 콘텐츠 도메인과 비교 기능 구현에 팀원들의 공통 관심이 있었습니다.
- 리뷰, 별점, 찜 같은 참여 기능을 통해 데이터를 모으고, 그 데이터를 활용해 랭킹과 추천으로 이어지는 선순환 구조를 설계해보고자 했습니다.
- Next.js App Router로 SSR, ISR, CSR을 혼합해 적용하며 이론으로만 알던 렌더링 방식을 직접 경험해보고 싶었습니다.
- 비교 페이지 같은 복잡한 화면에서 전역 상태 관리가 필수적이기에 Zustand와 React Query를 분리해 활용해보는 시도를 했습니다.

## 📗유저 플로우
- [유저 플로우](https://www.figma.com/board/MFF6EVqaykIrhelbeQoBnQ/team7-mobolae?node-id=0-1&t=PvJ5EF67SsxbmMr0-1)

## 📕 테크 스펙
- 테크 스펙 문서에는 프로젝트 목표, 설계 계획, API 명세, 마일스톤 등이 포함되어 있습니다.
- [로그인/회원가입](https://drive.google.com/file/d/1qRKwaMWvVLZlFmfZ6bUWNS3_dU1rX3kl/view?usp=drive_link)
- [메인 페이지](https://drive.google.com/file/d/1VbPCyFAXgrNfHigEVmWaphF48Ni0Tce4/view?usp=drive_link)
- [상세 페이지](https://drive.google.com/file/d/1blrEd_9IpZtTYA5v-yjg--6uhHC4fgOH/view?usp=sharing)
- [비교 페이지](https://drive.google.com/file/d/1xE9jOeVGQinH8nAS5p7tOvePvuG-VoRQ/view?usp=drive_link)
- [유저/마이페이지](https://drive.google.com/file/d/1sqs3YDfdmrQG8pcljuzKZVeswn_HAc3G/view)

## ⚒️ 이슈 관리
- Jira 티켓의 제목과 설명을 템플릿화하여, 팀원들이 일관된 형식으로 티켓을 작성
- 개인 일정뿐만 아니라 팀 전체의 진행 상황도 한눈에 파악
<img width="1071" height="434" alt="jira" src="https://github.com/user-attachments/assets/620ba72f-04d8-47f2-b3bb-4e6a57c4c2f6" />


## 🛠 기술 스택

### 📌 개발 언어 & 에디터
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![VSC](https://img.shields.io/badge/VS%20Code-007ACC?logo=visualstudiocode&logoColor=white)

### ⚙️ 프레임워크 & 번들러
![Next.js](https://img.shields.io/badge/Next.js%2015-000000?logo=nextdotjs&logoColor=white)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?logo=webpack&logoColor=black)

### 🎨 스타일링 & UI
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?logo=shadcn&logoColor=white)

### 🛤 라우팅 & 데이터 패칭
![App Router](https://img.shields.io/badge/Next.js%20App%20Router-000000?logo=nextdotjs&logoColor=white)
![Axios](https://img.shields.io/badge/axios-5A29E4?logo=axios&logoColor=white)

### 📊 상태 관리
![Zustand](https://img.shields.io/badge/Zustand-443E38?logo=react&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?logo=reactquery&logoColor=white)

### ✅ 폼 & 유효성 검사
![Zod](https://img.shields.io/badge/Zod-3068B7?logo=zod&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?logo=reacthookform&logoColor=white)

### ⚡ Codegen
![OpenAPI Codegen](https://img.shields.io/badge/openapi--codegen-009688?logo=openapiinitiative&logoColor=white)

### ✨ 애니메이션
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?logo=framer&logoColor=white)

### 🧹 코드 포매터
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=black)

### 🔐 형상 관리
![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)

### 🚀 배포
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)

## 🖼️ 각 페이지 스크린샷

| 메인 페이지 | 로그인 | 회원가입 |
|-------------|--------|----------|
| <img width="300" height="450" alt="mainp" src="https://github.com/user-attachments/assets/305bb73e-a257-447a-af21-1c4eb7d2c0ab" /> | <img width="300" height="450" alt="mobolae vercel app_signin_redirect_url=_(iPad Air)" src="https://github.com/user-attachments/assets/ecf4108e-13aa-4534-aa55-da0a432bf2be" /> | <img width="300" height="450" alt="mobolae vercel app_signin_redirect_url=_(iPad Air) (1)" src="https://github.com/user-attachments/assets/0bee8734-d7a2-4e78-a143-c89fc6256149" /> |

| 콘텐츠 상세페이지 | 프로필 페이지 | 콘텐츠 비교 페이지 |
|----------------|----------------|----------------|
| <img width="300" height="450" alt="detailp" src="https://github.com/user-attachments/assets/4757c5c4-38b0-464a-9acf-631483eb495c" /> | <img width="300" height="450" alt="myp" src="https://github.com/user-attachments/assets/b70d929a-0ac4-461e-be41-8003668dc51d" /> | <img width="300" height="450" alt="comparep" src="https://github.com/user-attachments/assets/ba4078df-7269-4989-b1d8-c4fb8e67485c" /> |

## ⚙️ 성능 최적화

1. **무한스크롤 적용** – 사용자 경험 개선 및 메모리 사용 최적화  - [PR #66](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/66) (이관현)

2. **wsrv.nl 적용** – 이미지 최적화 방식 변경 및 LCP 개선  - [PR #144](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/144) (이관현)

3. **이미지 최적화** – 불필요한 이미지 로드 최소화 및 페이지 로딩 속도 향상  - [PR #148](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/148) (이관현)

4. **Dynamic Import 적용** – 초기 로드 시 불필요한 JS 제거, 번들 크기 감소  - [PR #156](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/156) (이관현)

5. **카카오 SDK 동적 로딩 최적화** – 서드파티 쿠키 로딩 지연 및 Lighthouse 점수 향상  - [PR #157](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/157) (이관현)

6. **이미지 최적화** – Top3 이미지를 우선 로딩, 나머지는 lazy + Skeleton 적용으로 LCP 개선  - [PR #158](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/158) (이유진)

7. **스켈레톤 도입** – 공용 Skeleton 컴포넌트를 적용해 로딩 UX 강화  - [PR #129](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/129) (이유진)

8. **카테고리 단순화** – 상태 관리 제거 후 URL 쿼리 기반으로 구조 단순화 및 접근성 개선  - [PR #68](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/68) (이유진)

9. **웹폰트 최적화** – woff2 포맷 변경 및 `preload: false` 적용으로 성능 개선  - [PR #147](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/147) (김인)

10. **웹폰트 파일 정리** – 불필요한 폰트 제거 및 fallback 처리로 번들 크기 약 2MB 감소  - [PR #153](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/153) (김인)
    
11. **불필요한 소스 정리/ 이미지 최적화** 성능 개선 이미지 최적화/ 불필요한 자바스크립트 제거  - [PR #200](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pulls) (배혜민)

## 💁 서비스 개선

1. **비교 기능 강화** – 콘텐츠 개수에 따라 다른 모달 제공 및 중복 방지 처리로 직관적 비교 경험 제공  - [PR #86](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/86), [PR #113](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/113) (이관현)

2. **토스트 알림** – 사용자 행동에 따른 성공/실패/정보 피드백을 즉시 제공  - [PR #71](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/71) (이관현)

3. **Top-Button 추가** – 스크롤 시 최상단으로 쉽게 이동할 수 있는 편의 기능 제공  - [PR #67](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/67) (이관현)

4. **홈 쿼리 정규화** – 비표준 쿼리는 서버에서 즉시 리다이렉트, 클라이언트는 `HomeQueryGuard`로 자동 교체해 일관된 탐색 UX 제공  - [PR #132](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/132) (이유진)

5. **빈/에러 상태 UI** – `ContentEmpty` 컴포넌트 도입으로 콘텐츠 리스트·리뷰어 랭킹에 명확한 피드백 제공  - [PR #132](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/132) (이유진)

6. **토스트 UX 개선** – `toastId`를 부여해 동일 에러가 중복 노출되지 않도록 사용자 경험 최적화  - [PR #132](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/132) (이유진)

7. **동일 콘텐츠 비교 불가 수정** – 동일 항목을 중복 비교할 수 없도록 개선  - [PR #77](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/77) (김인)

8. **정렬 드롭다운 접근성 개선** – 키보드 접근 가능하도록 수정  - [PR #89](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/89) (김인)

9. **유저 로컬스토리지 저장 문제 해결** – 사용자 데이터 보존 플로우 개선  - [PR #120](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/120) (김인)

10. **결과창 UX 개선** – 비교 결과에서 콘텐츠 상세 페이지 링크 연결  - [PR #122](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/122) (김인)

11. **콘텐츠 입력 UX 개선** – 입력 시 카테고리 정보 제공 수정  - [PR #155](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/155) (김인)
   
12. **카카오 소셜 로그인 구현** - 카카오 로그인 연동으로 사용자 접근성 확장  - [PR #63](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/63) (윤정환)

13. **로그인 후 기존 페이지 리다이렉트 로직 구현** - 사용자가 로그인 후 원래 머물던 페이지로 오도록 사용자 경험 개선  - [PR #72](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/72) (윤정환)

14. **동적 메타 데이터 적용** - 상세 페이지 SEO와 동적 미리보기를 제공하기 위한 접근성 확장  - [PR #123](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/123) (윤정환)

15. **디자인 수정** 클릭 가능한 요소에 cursor pointer 적용  - [PR #140](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/140) (배혜민)

16. **낙관적 업데이트** 팔로우/언팔로우에 낙관적 업데이트 적용으로 즉각적 반응  - [PR #96](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/96) (배혜민)

17. **탭메뉴 제작**  탭 메뉴 추가로 정보 탐색 편의성 향상 - [PR #124](https://github.com/khuyjh/Mobolae-video-reviews-comparison-app/pull/124) (배혜민) 

## 🧑‍💻 팀원 소개
| <img width="160" height="160" alt="image" src="https://github.com/user-attachments/assets/5f472fc9-9be4-4a74-9965-6b3beaa80023" /> | <img width="160" height="160" alt="image" src="https://github.com/user-attachments/assets/bdfbc8e7-d22b-4b91-b3e9-ecd527d857e1" /> | <img width="160" height="160" alt="1757926420159gtidvdpl4kb" src="https://github.com/user-attachments/assets/d5741864-e8a9-49bc-8442-b8ff69b50eeb" /> | <img width="160" height="160" alt="image" src="https://github.com/user-attachments/assets/d69c909a-cc33-4a4d-8c6b-adfa43e7d60d" /> | <img width="160" height="160" alt="image" src="https://github.com/user-attachments/assets/000e0cc2-3a10-495a-a9c7-463542575563" /> |
|-----|-----|-----|-----|-----|
|  김인   |  배혜민   |  윤정환   |  이관현   | 이유진    |
|  • 비교하기 페이지<br/>• 비교 콘텐츠 전역 상태 관리<br/>• 공용 드롭다운,  아이템 카드   |  • 프로필 페이지<br/>• gnb , 아바타 카드 UI   |   • 로그인, 회원가입 페이지<br/>• 공용 버튼, 인풋, 모달 제작<br/>• 메타데이터<br/>• 프로젝트 세팅, CI/CD 구축  |  • 라벨, 카드 공통 컴포넌트 <br /> • 상세 페이지 제작 <br /> • 카카오 / 클립보드  공유 <br />  • 무한스크롤 & 탑 버튼 <br />  • 토스트   |  • 메인 페이지 / 404  <br> • 바텀시트 제작 <br> • 스켈레톤 UI  <br> • 콘텐츠 추가 모달  <br> • 검색 기능   |
