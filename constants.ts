import { Project, Job, Service } from './types';

export const SOCIAL_LINKS = {
  email: "contact@arturlubin.com",
  linkedin: "https://www.linkedin.com/in/artur-lubin-0588a0168/",
  cv: "/cv/artur-lubin-cv-classic.pdf",
  linkedinRecommendations: "https://www.linkedin.com/in/artur-lubin-0588a0168/details/recommendations/"
};

export const PROJECTS: Project[] = [
  {
    id: 'placet',
    title: "projects.placet.title",
    role: "projects.placet.role",
    year: "2023",
    description: "projects.placet.description",
    listDescription: "projects.placet.listDescription",
    fullDescription: {
      challenge: "Managing consumer finance is inherently stressful. Users seek clarity, predictability, and control, yet most financial apps overwhelm them with numbers, legal language, and fragmented flows. Placet's mobile experience suffered from inconsistent user journeys, unclear financial states, and non-uniform interface logic across loans, credit lines, and card features.",
      solution: "I redesigned the Placet app end-to-end with a focus on calm structure, transparency, and instant comprehension. Authentication was rebuilt using Smart-ID, Mobile-ID, and Face ID to establish trust from the first interaction. The dashboard follows a glance-first model, showing balance, next payment, and actions within seconds. A multi-state financial architecture was designed: processing, active, overdue, and empty states. The transaction feed was rebuilt into a dense but readable list with clear hierarchy and color-coded amounts. A full physical card journey was designed: ordered, shipped, expected delivery, activation, and active use. Both dark and light themes share a unified premium fintech visual language.",
      result: "The redesign improved user confidence and reduced ambiguity in daily financial actions. Support requests decreased due to clearer states and predictable flows. Users understood upcoming payments faster and navigated the app with less friction. The structure strengthened trust — the most valuable currency in fintech."
    },
    tags: ["Fintech", "Application Design"],
    image: "/images/projects/placet-app-cover.webp", 
    gallery: [
       "https://picsum.photos/800/600?random=1",
       "https://picsum.photos/800/600?random=2"
    ],
    screens: [
      {
        title: "Authentication & Face ID onboarding",
        description:
          "The journey starts with a secure but minimal login flow using Smart-ID, Mobile-ID and Face ID. The goal is to remove friction while keeping the visual tone calm and trustworthy.",
        image: "/images/placet/01-authentication.webp"
      },
      {
        title: "Dashboard — credit line at a glance",
        description:
          "A high-level overview of the user’s financial situation: remaining amount, next payment date and upcoming payment. The layout is optimised for quick scanning and daily use.",
        image: "/images/placet/02-dashboard-creditline.webp"
      },
      {
        title: "Financial states — processing, active and overdue",
        description:
          "Different UI states explain what is happening with the credit line: application in processing, active credit with transactions, a clean empty state and an overdue state with a clear but non-aggressive warning.",
        image: "/images/placet/03-states-processing-active-overdue.webp"
      },
      {
        title: "Card ordering and delivery timeline",
        description:
          "A step-based flow for physical card ordering: ordered, shipped and expected delivery. The UI uses a simple progress line and copy that reduces anxiety around where the card is in the journey.",
        image: "/images/placet/04-card-order-timeline.webp"
      },
      {
        title: "Black Card controls and safety tools",
        description:
          "Once the card is active, users get a control panel for contactless payments, internet transactions, temporary freeze and PIN tools. Each control is designed as a clear, tappable tile with strong hierarchy.",
        image: "/images/placet/05-card-controls.webp"
      },
      {
        title: "Visual system — dark & light explorations",
        description:
          "Two visual directions: a deep, premium dark mode for fintech and a lighter, airy version for clarity. Both share the same structure and interaction patterns, making the system scalable.",
        image: "/images/placet/06-visual-system-light-dark.webp"
      }
    ],
    featured: true
  },
  {
    id: 'paskolos',
    title: "projects.paskolos.title",
    role: "projects.paskolos.role",
    year: "2025",
    description: "projects.paskolos.description",
    listDescription: "projects.paskolos.listDescription",
    fullDescription: {
      challenge:
        "Users compare offers quickly, yet loan terms often feel abstract. The product needed clear limits, understandable durations, and visible consequences.",
      solution:
        "Redesigned the user flow around limit selection, impact of amount and term, maintaining decision context at every step.",
      result:
        "Cleaner user journey, reduced drop-offs during the application process."
    },
    tags: ["Fintech", "Lending UX", "UX/UI Design"],
    image: "/images/projects/paskolos-cover.webp",
    gallery: [
      "https://picsum.photos/800/600?random=3",
      "https://picsum.photos/800/600?random=4"
    ],
    screens: [
      {
        title: "Credit Line (Desktop)",
        description:
          "Основной entry point — кредитная линия (desktop).",
        image: "/images/paskolos/paskolos-credit-limit-selection-desktop.webp"
      },
      {
        title: "Credit Line (Mobile)",
        description:
          "Мобильный экран кредитной линии (файл назван неверно).",
        image: "/images/paskolos/paskolos-consumer-loan-landing-mobile.webp"
      },
      {
        title: "Consumer Loan (Desktop)",
        description:
          "Вторичный продукт — потребительский кредит (desktop).",
        image: "/images/paskolos/paskolos-consumer-loan-landing-desktop.webp"
      },
      {
        title: "Consumer Loan: Benefits + 3-step flow",
        description:
          "Преимущества + 3 шага оформления.",
        image: "/images/paskolos/paskolos-why-paskolos-desktop.webp"
      },
      {
        title: "Consumer Loan (Mobile)",
        description:
          "Мобильный экран потребительского кредита (файл назван неверно).",
        image: "/images/paskolos/paskolos-credit-line-landing-mobile.webp"
      },
      {
        title: "Calculator / Credit limit selection",
        description:
          "Интерактивный выбор лимита/суммы и подготовка к CTA.",
        image: "/images/paskolos/paskolos-credit-line-landing-desktop.webp"
      },
      {
        title: "Recommended products",
        description:
          "Поддержка выбора через альтернативные продукты.",
        image: "/images/paskolos/paskolos-product-recommendations-desktop.webp"
      },
      {
        title: "Why Paskolos (Bonuses)",
        description:
          "Финальное усиление доверия и причин выбора бренда.",
        image: "/images/paskolos/paskolos-terms-and-apply-steps-desktop.webp"
      },
      {
        title: "Business financing landing (Desktop)",
        description: "Full-page landing for business financing.",
        image: "/images/paskolos/paskolos-business-financing-desktop.webp",
        tall: true
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
    listDescription: "projects.placetSelfservice.listDescription",
    fullDescription: {
      challenge:
        "Previously, each Placet Group brand — smsraha, laen.ee, smsmoney and others — had its own separate self-service environment. Users had different logins, different URLs and slightly different interfaces depending on where they first took a loan. This fragmented experience created confusion, extra support load and made it harder to understand a customer’s full relationship with the company.",
      solution:
        "I designed a unified self-service portal that works as a single account layer across all Placet Group brands. Any customer, regardless of whether they started at smsraha, laen.ee or smsmoney, can now log in to one shared environment. The UX is built around a brand-agnostic core: a single dashboard showing all active products, balances, upcoming payments and agreements, while still respecting the visual identity of the entry brand. I restructured navigation, product grouping and payment flows so that actions like changing contact data, viewing contracts, making payments or applying for new credit follow the same logic everywhere.",
      result:
        "The unified portal reduced duplication of interfaces and simplified support, as the team now maintains one self-service system instead of several. For customers, it removed friction around remembering 'where' they took a loan and which site they need to use. The new structure gives a clearer overview of all products in one place and strengthens the perception of Placet Group as a consistent, reliable financial partner."
    },
    tags: ["Fintech", "Self-Service"],
    image: "/images/projects/placet-selfservice-cover.webp",
    gallery: [
      "https://picsum.photos/800/600?random=5",
      "https://picsum.photos/800/600?random=6"
    ],
    screens: [
      {
        title: "Consumer loan application (Desktop)",
        description:
          "Streamlined application form with clear fields and validation.",
        image: "/images/placet-selfservice/placet-selfservice-consumer-loan-application-desktop.webp"
      },
      {
        title: "Credit line application (Desktop)",
        description:
          "Unified onboarding for credit line with transparent steps.",
        image: "/images/placet-selfservice/placet-selfservice-credit-line-application-desktop.webp"
      },
      {
        title: "Credit line dashboard (Desktop)",
        description:
          "Account overview: limits, usage, actions, and statuses in one place.",
        image: "/images/placet-selfservice/placet-selfservice-credit-line-dashboard-desktop.webp"
      },
      {
        title: "Credit card (Desktop)",
        description:
          "Card overview + controls designed for clarity and security.",
        image: "/images/placet-selfservice/placet-selfservice-credit-card-desktop.webp"
      },
      {
        title: "Credit line (Mobile)",
        description:
          "Mobile credit line overview optimized for quick decisions.",
        image: "/images/placet-selfservice/placet-selfservice-credit-line-mobile.webp"
      },
      {
        title: "Credit card (Mobile)",
        description:
          "Mobile card management with clear primary actions.",
        image: "/images/placet-selfservice/placet-selfservice-credit-card-mobile.webp"
      },
      {
        title: "Card delivery & activation (Mobile)",
        description:
          "Delivery tracking + activation flow with frictionless guidance.",
        image: "/images/placet-selfservice/placet-selfservice-card-delivery-activation-mobile.webp"
      },
      {
        title: "Loan application (Mobile)",
        description:
          "A short application form to open a credit account: applicant details, required fields, and online submission.",
        image: "/images/placet-selfservice/placet-selfservice-credit-cashout-mobile.webp"
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
      "experience.placet.item4"
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
    title: "services.product.title",
    description: "services.product.description",
    icon: "box"
  },
  {
    title: "services.uxui.title",
    description: "services.uxui.description",
    icon: "layout"
  },
  {
    title: "services.fintech.title",
    description: "services.fintech.description",
    icon: "trending-up"
  },
  {
    title: "services.optimization.title",
    description: "services.optimization.description",
    icon: "zap"
  },
  {
    title: "services.branding.title",
    description: "services.branding.description",
    icon: "pen-tool"
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
He has over 10 years of experience.
Key traits: Ultra-clean Swiss style, Logic meets Emotion, Fintech expert.
Key Projects: Placet Group (Fintech system), Paskolos.lt (Lending redesign), Melior Clinics (Brand).
Work History: Placet Group (Current), K-Rauta, Kaup24.ee.
Your goal is to answer visitor questions about Artur's experience, style, and availability professionally and concisely.
Maintain a premium, professional, yet approachable tone.
Do not invent information not provided here.`;
// Secondary work shown as a compact grid below the featured case studies.
// `href` is omitted for projects without a public URL.
export const MORE_WORK: { key: string; image: string; href?: string; tags: string[] }[] = [
  {
    key: 'ascape',
    image: '/images/projects/ascape-cover.webp',
    href: 'https://www.ascape.ee',
    tags: ['E-commerce', 'Live'],
  },
  {
    key: 'toursearch',
    image: '/images/projects/toursearch-cover.webp',
    tags: ['B2B', 'Web app'],
  },
  {
    key: 'travelAtelier',
    image: '/images/projects/travel-atelier-cover.webp',
    href: 'https://travelatelier-five.vercel.app',
    tags: ['Website', 'Travel'],
  },
  {
    key: 'tartupak',
    image: '/images/projects/tartupak-cover.webp',
    href: 'https://tartupak.vercel.app',
    tags: ['Website', 'Manufacturing'],
  },
];

// Recommendations from LinkedIn (quoted verbatim; not translated, to stay authentic).
export const TESTIMONIALS: { name: string; role: string; quote: string; featured?: boolean; url?: string }[] = [
  {
    name: 'Ruslan Gogin',
    role: 'Founder, PadelTourn',
    // Paragraphs separated by a blank line; long quotes collapse after the first paragraph.
    quote:
      'I take immense pleasure in recommending Mr. Artur Lubin for his outstanding abilities as a UX/UI, Graphic, and Product Designer. Artur was a crucial part of our processes for five years, and his impact was nothing short of transformative.\n\nArtur’s expertise in UX/UI design is truly second to none. His ability to create intuitive and engaging designs always left us in awe. His designs not only captured the essence of our brand but also significantly improved the user experience on our platforms. His relentless focus on the user, understanding their needs, and translating them into practical design solutions was exceptional.\n\nHis proficiency extends to graphic and product design, where he consistently demonstrated an innate talent for capturing and conveying complex ideas through visual representation. Artur\'s eye for detail, and his artistic touch transformed our product line, helping us to distinguish ourselves in a highly competitive market.\n\nArtur is not only an exceptional designer, but he is also a great team player. He brought a positive attitude to every meeting, and his ability to communicate complex design concepts in an understandable manner helped foster a collaborative environment.\n\nIn summary, Artur’s breadth of design skills, his relentless drive for perfection, and his team-oriented approach make him an asset to any organization. I am confident that he will bring the same level of dedication, creativity, and professionalism to his future endeavors as he did during his time with us.',
    featured: true,
  },
  {
    name: 'Vitali Zahharov',
    role: 'Product Designer',
    quote:
      'We worked with him on several big projects and I found him a top-notch professional. He is great communicator, his attention to the details it’s just a whole new level to me, he has also a great visual eyes, and he feels the trends, he knows how to create a great product and bring value to any company.',
  },
  {
    name: 'Aleksandr Kents',
    role: 'CEO, Melior Clinics · Co-Founder, Synmea',
    quote: 'Professional of design. Good work, creative thinking. Was working together for many years.',
  },
  {
    name: 'Maris Kivi',
    role: 'Business Development & Marketing Leadership',
    quote: 'Artur is easy to work with, takes responsibilities and works out the best solutions in any situation given.',
  },
  {
    name: 'Dimitri Nasennik',
    role: 'Digital Marketing',
    quote:
      'I can recommend Artur, as professional UI/UX designer. We worked together for different project and his vision always was unique. I like the style of his work and his attitude.',
  },
];
