# 얼굴 균형 셀프 체크 (PWA)

정면·측면 사진으로 얼굴 비율을 점검하는 상담 전 참고용 셀프 체크 앱이에요.
사진은 서버로 보내지 않고 기기 브라우저 안에서만 처리돼요.

## GitHub Pages로 올리기

```bash
cd face-balance-pwa
git init
git add .
git commit -m "얼굴 균형 셀프 체크 PWA"
git branch -M main
git remote add origin https://github.com/<내계정>/<저장소이름>.git
git push -u origin main
```

1. GitHub 저장소 → **Settings → Pages**
2. **Source: Deploy from a branch**, Branch: `main` / `/ (root)` 선택 후 Save
3. 1~2분 뒤 `https://<내계정>.github.io/<저장소이름>/` 에서 열려요

경로를 전부 상대경로로 써서 저장소 이름이 뭐든(하위 경로여도) 그대로 동작해요.

## 폰에 설치

- **Android(Chrome)**: 첫 화면의 "홈 화면에 앱으로 설치" 버튼, 또는 브라우저 메뉴 → 홈 화면에 추가
- **iPhone(Safari)**: 공유 버튼 → 홈 화면에 추가

## 알아둘 점

- 처음 한 번은 인터넷이 필요해요. 얼굴 인식 라이브러리와 모델(수 MB)을 받아서 기기에 저장하고, 그 뒤로는 오프라인에서도 돼요.
- 앱 파일(`index.html` 등)을 수정해서 다시 올렸다면 `sw.js` 맨 위의 `VERSION` 숫자를 올려주세요. 그래야 설치한 앱이 새 파일로 바뀌어요.
- 카메라 촬영/사진 선택은 HTTPS에서만 안정적으로 동작해요. GitHub Pages는 HTTPS라서 괜찮아요.

## 파일 구성

| 파일 | 역할 |
| --- | --- |
| `index.html` | 앱 본체 (분석 로직 포함) |
| `manifest.webmanifest` | 설치용 앱 정보 |
| `sw.js` | 오프라인 캐시 |
| `icons/` | 앱 아이콘 (일반·마스커블·iOS) |
| `.nojekyll` | GitHub Pages가 파일을 그대로 서비스하도록 하는 표시 |
