<img width="1200" height="630" alt="OGImg" src="https://github.com/user-attachments/assets/df208425-ac07-45a7-9ff5-091fa2355bb7" />

## ⭐ 프로젝트 개요
- 영화, 드라마 등 문화 관련 카테고리의 작품 중 두 개씩 골라 A/B 비교하고, 리뷰·별점·후기 데이터를 합쳐 랭킹/추천을 제공하는 플랫폼입니다. Next.js의 렌더링 전략(SSR/SSG/CSR) 을 페이지 특성에 맞게 혼합 적용하고, 무한 스크롤·SEO·공유·검색/정렬을 지원합니다.

### ❓ 주제 선정 이유
- 영화·드라마 같은 콘텐츠 도메인과 비교 기능 구현에 팀원들의 공통 관심이 있었습니다.
- 리뷰, 별점, 찜 같은 참여 기능을 통해 데이터를 모으고, 그 데이터를 활용해 랭킹과 추천으로 이어지는 선순환 구조를 설계해보고자 했습니다.
- Next.js App Router로 SSR, ISR, CSR을 혼합해 적용하며 이론으로만 알던 렌더링 방식을 직접 경험해보고 싶었습니다.
- 비교 페이지 같은 복잡한 화면에서 전역 상태 관리가 필수적이기에 Zustand와 React Query를 분리해 활용해보는 시도를 했습니다.

## 📗유저 플로우
- https://www.figma.com/board/MFF6EVqaykIrhelbeQoBnQ/team7-mobolae?node-id=0-1&t=PvJ5EF67SsxbmMr0-1

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

## 팀원 소개
| <img width="160" height="160" alt="image" src="https://github.com/user-attachments/assets/5f472fc9-9be4-4a74-9965-6b3beaa80023" /> | <img width="160" height="160" alt="image" src="https://github.com/user-attachments/assets/bdfbc8e7-d22b-4b91-b3e9-ecd527d857e1" /> | <img width="160" height="160" alt="1757926420159gtidvdpl4kb" src="https://github.com/user-attachments/assets/d5741864-e8a9-49bc-8442-b8ff69b50eeb" /> | <img width="160" height="160" alt="image" src="https://github.com/user-attachments/assets/d69c909a-cc33-4a4d-8c6b-adfa43e7d60d" /> | <img width="160" height="160" alt="image" src="https://github.com/user-attachments/assets/000e0cc2-3a10-495a-a9c7-463542575563" /> |
|-----|-----|-----|-----|-----|
|  김인   |  배혜민   |  윤정환   |  이관현   | 이유진    |
|  • 비교하기 페이지<br/>• 비교 콘텐츠 전역 상태 관리<br/>• 공용 드롭다운,  아이템 카드   |  • 프로필 페이지<br/>• gnb , 아바타 카드 UI   |   • 로그인, 회원가입 페이지<br/>• 공용 버튼, 인풋, 모달 제작<br/>• 메타데이터<br/>• 프로젝트 세팅, CI/CD 구축  |  • 라벨, 카드 공통 컴포넌트 <br /> • 상세 페이지 제작 <br /> • 카카오 / 클립보드  공유 <br />  • 무한스크롤 & 탑 버튼 <br />  • 토스트   |  • 메인 페이지 / 404  <br> • 바텀시트 제작 <br> • 스켈레톤 UI  <br> • 콘텐츠 추가 모달  <br> • 검색 기능   |
