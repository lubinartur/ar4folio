# Тексты проекта: Дизайн приложения (Placet Group)

## Основная информация

**Заголовок:** Дизайн приложения  
**Клиент:** Placet Group  
**Год:** 2023  
**Теги:** Fintech, Application Design, UX/UI

## Краткое описание

**Русский:**
Полный редизайн финтех-экосистемы с фокусом на онбординг, конверсию и масштабируемые UX-паттерны.

**Английский:**
Complete redesign of fintech ecosystem with focus on onboarding, conversion, and scalable UX patterns.

---

## Полное описание (Full Description)

### Challenge (Проблема)

**Английский (из constants.ts):**
Managing consumer finance is inherently stressful. Users want clarity, predictability, and control — yet most financial applications overload the screen with numbers, legal jargon, and unnecessary steps. Placet's mobile experience suffered from scattered flows, unclear financial states, and inconsistent interface logic across loan, credit line, and card features.

**Английский (из ProjectDetail.tsx - хардкод):**
Users want clarity, predictability, and control — but most financial apps overload screens with complexity. Placet's mobile experience suffered from:

- Scattered and inconsistent user flows
- Unclear financial states across loans, credit lines, and cards
- Non‑uniform interface logic

### Solution (Решение)

**Английский (из constants.ts):**
I rebuilt the Placet App experience end‑to‑end, focusing on calm structure, transparency, and instant comprehension. The authentication layer was redesigned with Smart‑ID, Mobile‑ID, and FaceID onboarding to establish trust from the first interaction. The dashboard was reorganized around a glance‑first model where remaining balance, next payment, and available actions are readable within seconds. I designed a multi‑state financial architecture covering processing, active, overdue, and empty transaction scenarios — each adapting UI tone, interaction level, and clarity. The transaction feed was rebuilt into a clean, high‑density list with color-coded amounts and clear hierarchy. A full physical card journey was created, including ordered–shipped–expected–activation–active states with complete control toggles for NFC, online payments, PIN tools, and temporary freeze. Both light and dark themes were developed with a premium fintech aesthetic and consistent visual language.

**Английский (из ProjectDetail.tsx - хардкод):**
I redesigned the Placet App end‑to‑end with focus on calm structure, transparency, and instant comprehension.

- Rebuilt authentication with Smart‑ID, Mobile‑ID, FaceID
- Glance‑first dashboard for clear balance, next payment, actions
- Multi‑state financial architecture: processing, active, overdue
- Dense, readable transaction feed with color‑coding
- Redesigned full card journey: ordered → shipped → active
- Unified light & dark premium fintech themes

### Result (Результат)

**Английский (из constants.ts):**
The redesign significantly improved user confidence and reduced ambiguity in day‑to‑day financial actions. Support questions dropped due to clearer card delivery states, predictable financial states, and simplified onboarding. Users understood their next payments faster, navigated the app with less friction, and interacted with features more consistently across dark and light modes. The new structure strengthened trust — the most valuable currency in fintech.

**Английский (из ProjectDetail.tsx - хардкод):**
The redesign strengthened user confidence and reduced ambiguity.

- Fewer support questions from clearer financial states
- Faster understanding of upcoming payments
- Smoother onboarding and everyday flows
- Consistent experience across dark & light modes

---

## Экраны (Screens)

### 1. Authentication & Face ID onboarding

**Описание:**
The journey starts with a secure but minimal login flow using Smart-ID, Mobile-ID and Face ID. The goal is to remove friction while keeping the visual tone calm and trustworthy.

**Изображение:** `/images/placet/01-authentication.png`

---

### 2. Dashboard — credit line at a glance

**Описание:**
A high-level overview of the user's financial situation: remaining amount, next payment date and upcoming payment. The layout is optimised for quick scanning and daily use.

**Изображение:** `/images/placet/02-dashboard-creditline.png`

---

### 3. Financial states — processing, active and overdue

**Описание:**
Different UI states explain what is happening with the credit line: application in processing, active credit with transactions, a clean empty state and an overdue state with a clear but non-aggressive warning.

**Изображение:** `/images/placet/03-states-processing-active-overdue.png`

---

### 4. Card ordering and delivery timeline

**Описание:**
A step-based flow for physical card ordering: ordered, shipped and expected delivery. The UI uses a simple progress line and copy that reduces anxiety around where the card is in the journey.

**Изображение:** `/images/placet/04-card-order-timeline.png`

---

### 5. Black Card controls and safety tools

**Описание:**
Once the card is active, users get a control panel for contactless payments, internet transactions, temporary freeze and PIN tools. Each control is designed as a clear, tappable tile with strong hierarchy.

**Изображение:** `/images/placet/05-card-controls.png`

---

### 6. Visual system — dark & light explorations

**Описание:**
Two visual directions: a deep, premium dark mode for fintech and a lighter, airy version for clarity. Both share the same structure and interaction patterns, making the system scalable.

**Изображение:** `/images/placet/06-visual-system-light-dark.png`

---

## Дополнительная информация

**Обложка проекта:** `/images/projects/placet-app-cover.jpg`

**CTA текст:** Смотреть кейс / View case

**Статус:** Featured (отображается в списке проектов)
