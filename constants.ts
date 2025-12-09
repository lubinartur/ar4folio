import { Project, Job, Service } from './types';

export const SOCIAL_LINKS = {
  email: "contact@arturlubin.com",
  linkedin: "https://www.linkedin.com/in/artur-lubin-0588a0168/",
  cv: "/Artur_Lubin_CV.pdf" // Placeholder
};

export const PROJECTS: Project[] = [
  {
    id: 'placet',
    title: "projects.placet.title",
    role: "projects.placet.role",
    year: "2023",
    description: "projects.placet.description",
    fullDescription: {
      challenge: "Managing consumer finance is inherently stressful. Users want clarity, predictability, and control — yet most financial applications overload the screen with numbers, legal jargon, and unnecessary steps. Placet’s mobile experience suffered from scattered flows, unclear financial states, and inconsistent interface logic across loan, credit line, and card features.",
      solution: "I rebuilt the Placet App experience end‑to‑end, focusing on calm structure, transparency, and instant comprehension. The authentication layer was redesigned with Smart‑ID, Mobile‑ID, and FaceID onboarding to establish trust from the first interaction. The dashboard was reorganized around a glance‑first model where remaining balance, next payment, and available actions are readable within seconds. I designed a multi‑state financial architecture covering processing, active, overdue, and empty transaction scenarios — each adapting UI tone, interaction level, and clarity. The transaction feed was rebuilt into a clean, high‑density list with color-coded amounts and clear hierarchy. A full physical card journey was created, including ordered–shipped–expected–activation–active states with complete control toggles for NFC, online payments, PIN tools, and temporary freeze. Both light and dark themes were developed with a premium fintech aesthetic and consistent visual language.",
      result: "The redesign significantly improved user confidence and reduced ambiguity in day‑to‑day financial actions. Support questions dropped due to clearer card delivery states, predictable financial states, and simplified onboarding. Users understood their next payments faster, navigated the app with less friction, and interacted with features more consistently across dark and light modes. The new structure strengthened trust — the most valuable currency in fintech."
    },
    tags: ["Fintech", "Application Design", "UX/UI"],
    image: "/images/projects/placet-app-cover.jpg", 
    gallery: [
       "https://picsum.photos/800/600?random=1",
       "https://picsum.photos/800/600?random=2"
    ],
    screens: [
      {
        title: "Authentication & Face ID onboarding",
        description:
          "The journey starts with a secure but minimal login flow using Smart-ID, Mobile-ID and Face ID. The goal is to remove friction while keeping the visual tone calm and trustworthy.",
        image: "/images/placet/01-authentication.png"
      },
      {
        title: "Dashboard — credit line at a glance",
        description:
          "A high-level overview of the user’s financial situation: remaining amount, next payment date and upcoming payment. The layout is optimised for quick scanning and daily use.",
        image: "/images/placet/02-dashboard-creditline.png"
      },
      {
        title: "Financial states — processing, active and overdue",
        description:
          "Different UI states explain what is happening with the credit line: application in processing, active credit with transactions, a clean empty state and an overdue state with a clear but non-aggressive warning.",
        image: "/images/placet/03-states-processing-active-overdue.png"
      },
      {
        title: "Card ordering and delivery timeline",
        description:
          "A step-based flow for physical card ordering: ordered, shipped and expected delivery. The UI uses a simple progress line and copy that reduces anxiety around where the card is in the journey.",
        image: "/images/placet/04-card-order-timeline.png"
      },
      {
        title: "Black Card controls and safety tools",
        description:
          "Once the card is active, users get a control panel for contactless payments, internet transactions, temporary freeze and PIN tools. Each control is designed as a clear, tappable tile with strong hierarchy.",
        image: "/images/placet/05-card-controls.png"
      },
      {
        title: "Visual system — dark & light explorations",
        description:
          "Two visual directions: a deep, premium dark mode for fintech and a lighter, airy version for clarity. Both share the same structure and interaction patterns, making the system scalable.",
        image: "/images/placet/06-visual-system-light-dark.png"
      }
    ],
    featured: true
  },
  {
    id: 'paskolos',
    title: "projects.paskolos.title",
    role: "projects.paskolos.role",
    year: "2022",
    description: "projects.paskolos.description",
    fullDescription: {
      challenge:
        "The previous Paskolos.lt experience felt outdated and fragmented. Information about loan types, terms, and legal requirements was scattered across multiple pages, and several CTAs competed on the same screen. Heavy legal language, unclear comparison patterns, and a desktop-first layout made it hard for users to understand what they were signing up for and which product was right for them.",
      solution:
        "I started with a UX audit and information architecture pass, mapping all loan categories, mandatory legal content, and campaign modules into a single, predictable structure. The landing page was redesigned around a clear narrative: what the product is, how it works, and what to do next. Comparison modules were introduced to show key differences between loan options in one place, instead of forcing users to jump between pages. The visual system moved to a mobile-first grid with large tappable cards, readable typography on 375–414 px screens, and reusable components for hero, comparison, FAQ, and CTA blocks. This made it easier for marketing to launch campaigns without breaking the UX.",
      result:
        "The new structure made the lending journey easier to understand and more trustworthy. Users see what Paskolos offers within the first screen, understand key differences between products faster, and reach the application form with less cognitive load. The reusable layout and components also simplified ongoing marketing work, as new campaigns could plug into the same UX framework instead of creating one-off pages."
    },
    tags: ["Fintech", "Lending UX", "UX/UI Design"],
    image: "/images/projects/paskolos-cover.jpg",
    gallery: [
      "https://picsum.photos/800/600?random=3",
      "https://picsum.photos/800/600?random=4"
    ],
    screens: [
      {
        title: "Information architecture & content model",
        description:
          "I mapped existing pages, loan types, and legal content into a single information architecture. This reduced duplication, clarified where each loan journey starts, and defined stable areas for legal copy so the main screens could stay light.",
        image: "/images/paskolos/01-ia-structure.png"
      },
      {
        title: "Landing page and comparison modules",
        description:
          "The new landing explains what Paskolos offers in a hero + explanation + comparison pattern. Users see loan options, terms, and differences in one structured view, with a single primary CTA and a calm secondary path for learning more.",
        image: "/images/paskolos/02-landing-comparison.png"
      },
      {
        title: "Mobile-first layouts",
        description:
          "Layouts were designed mobile-first with large tappable cards, clear hierarchy, and typography tuned for small screens. Desktop reuses the same structure, so there is no split between 'mobile' and 'desktop-only' UX.",
        image: "/images/paskolos/03-mobile-layouts.png"
      },
      {
        title: "Campaign and legal content blocks",
        description:
          "Campaign banners, promotional rates, and legal content are handled by dedicated blocks that can be turned on and off without redesigning the page. This keeps marketing flexible while preserving UX consistency.",
        image: "/images/paskolos/04-campaign-legal.png"
      }
    ],
    featured: true
  },
  {
    id: 'placet-selfservice',
    title: "projects.placetSelfservice.title",
    role: "projects.placetSelfservice.role",
    year: "2023",
    description: "projects.placetSelfservice.description",
    fullDescription: {
      challenge:
        "Previously, each Placet Group brand — smsraha, laen.ee, smsmoney and others — had its own separate self-service environment. Users had different logins, different URLs and slightly different interfaces depending on where they first took a loan. This fragmented experience created confusion, extra support load and made it harder to understand a customer’s full relationship with the company.",
      solution:
        "I designed a unified self-service portal that works as a single account layer across all Placet Group brands. Any customer, regardless of whether they started at smsraha, laen.ee or smsmoney, can now log in to one shared environment. The UX is built around a brand-agnostic core: a single dashboard showing all active products, balances, upcoming payments and agreements, while still respecting the visual identity of the entry brand. I restructured navigation, product grouping and payment flows so that actions like changing contact data, viewing contracts, making payments or applying for new credit follow the same logic everywhere.",
      result:
        "The unified portal reduced duplication of interfaces and simplified support, as the team now maintains one self-service system instead of several. For customers, it removed friction around remembering 'where' they took a loan and which site they need to use. The new structure gives a clearer overview of all products in one place and strengthens the perception of Placet Group as a consistent, reliable financial partner."
    },
    tags: ["Fintech", "Self-Service", "UX/UI Design"],
    image: "/images/projects/placet-selfservice-cover.jpg",
    gallery: [
      "https://picsum.photos/800/600?random=5",
      "https://picsum.photos/800/600?random=6"
    ],
    screens: [
      {
        title: "Unified login across brands",
        description:
          "A single authentication layer that works for customers of smsraha, laen.ee, smsmoney and other Placet Group brands, removing the need to remember separate portals.",
        image: "/images/placet-selfservice/01-unified-login.png"
      },
      {
        title: "Multi-product dashboard",
        description:
          "A brand-agnostic dashboard that aggregates all active loans, credit lines and cards into one structured overview with clear states and next steps.",
        image: "/images/placet-selfservice/02-multiproduct-dashboard.png"
      },
      {
        title: "Payments and schedules",
        description:
          "Unified payment flows and schedules, showing upcoming instalments across products in a single, predictable pattern, reducing confusion and missed payments.",
        image: "/images/placet-selfservice/03-payments-schedule.png"
      },
      {
        title: "Contracts and profile management",
        description:
          "A shared area for contracts, personal data and communication settings, so customers can manage their relationship with Placet Group as one entity.",
        image: "/images/placet-selfservice/04-contracts-profile.png"
      }
    ],
    featured: true
  }
];

export const EXPERIENCE: Job[] = [
  {
    company: "Placet Group OÜ",
    role: "experience.placet.role",
    period: "experience.placet.period",
    items: [
      "experience.placet.item1",
      "experience.placet.item2",
      "experience.placet.item3",
      "experience.placet.item4",
      "experience.placet.item5",
      "experience.placet.item6"
    ]
  },
  {
    company: "AIR4 / AIRCH",
    role: "experience.air4.role",
    period: "experience.air4.period",
    items: [
      "experience.air4.item1",
      "experience.air4.item2",
      "experience.air4.item3",
      "experience.air4.item4"
    ]
  },
  {
    company: "K-Rauta AB (Freelance)",
    role: "experience.krauta.role",
    period: "2019",
    description: "experience.krauta.description"
  },
  {
    company: "Kaup24.ee",
    role: "experience.kaup24.role",
    period: "2014 — 2016",
    description: "experience.kaup24.description"
  }
];

export const SERVICES: Service[] = [
  {
    title: "services.uxui.title",
    description: "services.uxui.description",
    icon: "layout"
  },
  {
    title: "services.product.title",
    description: "services.product.description",
    icon: "box"
  },
  {
    title: "services.fintech.title",
    description: "services.fintech.description",
    icon: "trending-up"
  },
  {
    title: "services.branding.title",
    description: "services.branding.description",
    icon: "pen-tool"
  },
  {
    title: "services.optimization.title",
    description: "services.optimization.description",
    icon: "zap"
  }
];

export const SPECIALIZATIONS = [
  "UX Architecture",
  "User Flow Mapping",
  "Design Systems",
  "Dashboards",
  "Loan Calculators",
  "Onboarding Optimization",
  "Multi-platform Design",
  "Data-driven Decisions"
];

export const AI_SYSTEM_INSTRUCTION = `You are a helpful AI assistant for Artur Lubin's portfolio website. 
Artur is a Product & UX Designer specializing in fintech. 
He has over 9 years of experience.
Key traits: Ultra-clean Swiss style, Logic meets Emotion, Fintech expert.
Key Projects: Placet Group (Fintech system), Paskolos.lt (Lending redesign), Melior Clinics (Brand).
Work History: Placet Group (Current), K-Rauta, Kaup24.ee.
Your goal is to answer visitor questions about Artur's experience, style, and availability professionally and concisely.
Maintain a premium, professional, yet approachable tone.
Do not invent information not provided here.`;