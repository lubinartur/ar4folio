# Промпт для Cursor AI: Добавление поля "Моя роль" в секцию Обзор проектов

## Задача
Добавить отдельное поле "Моя роль" в секцию "Обзор" для всех проектов в портфолио, чтобы выровнять левую и правую части (сейчас справа 3 метрики эффекта, слева должно быть 3 поля: Клиент, Моя роль, Год).

## Контекст
Сейчас в поле "Клиент" отображается комбинация "Product & UX Designer / Клиент: Paskolos.lt", что визуально и логически путает. Нужно разделить на два отдельных поля.

## Что нужно сделать

### 1. Обновить локализацию (locales/ru.json, locales/en.json, locales/et.json)

Добавить ключ `"myRole"` в секцию `projectDetail`:
- ru: `"myRole": "Моя роль"`
- en: `"myRole": "My role"`
- et: `"myRole": "Minu roll"`

### 2. Обновить данные проектов в локализации

Для каждого проекта (placet, paskolos, placetSelfservice) добавить отдельное поле `"client"`:

**Русский (ru.json):**
```json
"placet": {
  "role": "Senior Product & UX Designer",
  "client": "Placet Group",
  ...
},
"paskolos": {
  "role": "Product & UX Designer",
  "client": "Paskolos.lt",
  ...
},
"placetSelfservice": {
  "role": "Senior Product & UX Designer",
  "client": "Placet Group",
  ...
}
```

**Английский (en.json):**
```json
"placet": {
  "role": "Senior Product & UX Designer",
  "client": "Placet Group",
  ...
},
"paskolos": {
  "role": "Product & UX Designer",
  "client": "Paskolos.lt",
  ...
},
"placetSelfservice": {
  "role": "Senior Product & UX Designer",
  "client": "Placet Group",
  ...
}
```

**Эстонский (et.json):**
```json
"placet": {
  "role": "Senior Product & UX Designer",
  "client": "Placet Group",
  ...
},
"paskolos": {
  "role": "Product & UX Designer",
  "client": "Paskolos.lt",
  ...
},
"placetSelfservice": {
  "role": "Senior Product & UX Designer",
  "client": "Placet Group",
  ...
}
```

### 3. Обновить компонент ProjectDetail.tsx

В функции компонента:
1. Получить данные проекта из локализации:
```typescript
const projectData = dict?.projects?.[projectKey];
const myRole = projectData?.role ? t(projectData.role) : roleLabel;
const clientName = projectData?.client ? t(projectData.client) : '';
```

2. Обновить массив полей в карточке Overview:
```typescript
{[
  { label: t("projectDetail.client"), value: clientName },
  { label: t("projectDetail.myRole"), value: myRole },
  { label: t("projectDetail.year"), value: project.year }
].map((item, i) => (
  // ... existing mapping code
))}
```

3. Обновить отображение роли в заголовке проекта (заменить `roleLabel` на `myRole`)

### 4. Проверка

Убедиться, что:
- Все три языка обновлены
- Все три проекта имеют поля `role` и `client`
- Компонент корректно отображает 3 поля в секции Обзор
- Левая и правая части выровнены (по 3 элемента)

## Результат
В секции "Обзор" каждого проекта теперь отображаются 3 отдельных поля:
1. **Клиент** — название клиента (например, "Paskolos.lt")
2. **Моя роль** — роль дизайнера (например, "Product & UX Designer")
3. **Год** — год проекта (например, "2025")

Это выравнивает левую часть (3 поля) с правой частью (3 метрики эффекта).

---

# PROMPT FOR CURSOR AI

## Case: Paskolos.lt — Problem / Solution / Outcome

**Audience:** HR, Lead / Head of Design  
**Role:** Senior Product & UX Designer

### Task
Rewrite the **Problem / Solution / Outcome** block for the **Paskolos.lt** case in **three languages (RU / EN / ET)**.

The texts must be:
- Product-focused, no fluff
- Synchronized with real screens
- No abstract wording
- Ready to publish in the portfolio

---

## 🇷🇺 RU

### Проблема
На входе в продукт пользователю важно быстро понять разницу между кредитной линией и потребительским кредитом и выбрать подходящий сценарий. Без чёткой структуры и понятных офферов выбор становится неочевидным, а доверие к условиям снижается ещё до начала оформления.

### Решение
Разделил два продукта через отдельные hero-экраны и единый язык оффера.  
Для Consumer Loan объединил ключевые преимущества и 3 шага оформления в одном блоке.  
Для Credit Line вынес основную механику в калькулятор выбора лимита.  
Дополнительно усилил пользовательский путь рекомендациями продуктов и финальным блоком доверия.

### Результат
Структура сайта стала понятнее: Credit Line — основной entry point, Consumer Loan — отдельный пользовательский сценарий. Офферы считываются с первого экрана, CTA поддержан объясняющими блоками, а доверие к продукту усиливается до начала оформления.

---

## 🇬🇧 EN

### Problem
At the entry point, users need to quickly understand the difference between a credit line and a consumer loan and choose the scenario that fits their needs. Without a clear structure and readable offers, the decision becomes unclear and trust in the conditions drops before the application even starts.

### Solution
I separated the two products through distinct hero screens while keeping a consistent offer language.  
For the Consumer Loan, I combined key benefits and a 3-step application flow into a single block.  
For the Credit Line, I highlighted the core mechanics through a limit selection calculator.  
The journey was further supported with product recommendations and a final trust-building block.

### Outcome
The site structure became clearer: Credit Line as the main entry point and Consumer Loan as a separate user scenario. Offers are readable from the first screen, CTAs are supported by explanatory blocks, and trust is reinforced before moving to application.

---

## 🇪🇪 ET

### Probleem
Tootesse sisenedes peab kasutaja kiiresti mõistma erinevust krediidiliini ja tarbimislaenu vahel ning valima sobiva lahenduse. Ilma selge struktuuri ja arusaadavate pakkumisteta muutub valik ebaselgeks ning usaldus tingimuste vastu väheneb juba enne taotluse esitamist.

### Lahendus
Eraldasin kaks toodet eraldi hero-ekraanide kaudu, kasutades ühtset pakkumiskeelt.  
Tarbimislaenu puhul koondasin peamised eelised ja 3-sammulise taotlusprotsessi ühte plokki.  
Krediidiliini puhul tõstsin esile põhimehhanismi limiidi valiku kalkulaatori kaudu.  
Kasutajateekonda täiendasid soovitatud tooted ja lõplik usaldust tugevdav plokk.

### Tulemus
Veebilehe struktuur muutus selgemaks: Credit Line on peamine sisenemispunkt, Consumer Loan eraldi kasutusstsenaarium. Pakkumised on loetavad juba esimeselt ekraanilt, CTA-d toetavad selgitavad plokid ning usaldus suureneb enne taotluse esitamist.

---

## ⚠️ Instruction for Cursor
If in any language the phrasing loses meaning or becomes less product-focused — adapt the wording, but keep the structure and intent.

---

# Описание бага (для Cursor AI): “Год висит в воздухе” в Overview

## Симптом
Сетка и карточки выровнены корректно — сами блоки аккуратные и стоят на местах.  
Проблема локальная: **один текстовый элемент внутри карточки** визуально “висит” и не подчиняется общей вертикальной логике.

## Вероятная причина
- Текст находится **вне основного flex/grid-контейнера** карточки  
или
- Для него задано `position: absolute` / некорректный `margin-top` / `line-height`, из-за чего он не выравнивается вместе с остальным контентом

## Что проверить и исправить
1. Убедиться, что этот текст является частью **того же контейнера**, что и заголовок/метрика.
2. Проверить `display: flex` + `flex-direction` у родителя и `align-items`.
3. Убрать абсолютное позиционирование, если оно не требуется.
4. Сверить `padding` / `gap` внутри карточки — текст должен участвовать в общем вертикальном потоке.
5. Проверить, не переопределяется ли стиль текста глобальным классом.

## Итог
Вёрстка блоков ок, проблема локальная — **один текстовый элемент выпал из контекста контейнера**, поэтому визуально кажется “оторванным”.
