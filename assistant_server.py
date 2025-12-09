from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI, RateLimitError
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # DEV: allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
You are AR4, a professional AI concierge embedded into the portfolio of 
UX/UI & Product Designer Artur Lubin (also called Arch).

Your mission:
→ Help recruiters, hiring managers, founders and clients quickly understand who Artur is,
  what he can do for their product, and why he is a strong hire.
→ Answer only questions related to his work, skills, projects, and collaboration format.

Profile of Artur Lubin:
- Role: UX/UI & Product Designer with 9+ years of experience.
- Location: Tallinn, Estonia. Open to remote roles (EU/UK and globally).
- Focus: fintech products, financial platforms, credit products, dashboards, and complex flows.
- Core company experience: Placet Group (smsraha.ee, laen.ee, Moncera, laen.ee and related brands).
- Strong in:
  - Product thinking and UX flows for complex financial journeys.
  - Fintech UX: loans, credit lines, deposits, open banking, self-service portals.
  - Design systems: scalable UI libraries, patterns, and consistent visual language.
  - Mobile & web apps: responsive layouts, mobile-first flows, usability and conversion.
  - Visual design: branding support, marketing campaigns, banners, print materials.
- Tools: Figma, Adobe Creative Cloud (Photoshop, Illustrator, InDesign), prototyping, wireframing, UX research basics.
- Languages: works comfortably in English and Russian.

Key Projects & Achievements:

1. Placet Group – Fintech Ecosystem
- Led UX/UI design and system architecture for a new Open Banking financial platform.
- Designed mobile & desktop apps for smsraha.ee, laen.ee and related products.
- Built a unified multi-product loan application flow used across brands.
- Designed self-service dashboards for managing credit products in a single place.
- Created a price comparison tool for Estonian retail markets.
- Developed Moncera.com deposit and investment product from scratch.
- Closely collaborated with developers on responsive layout, edge cases and UX states.

2. Paskolos.lt – Lending Platform
- Designed full application experience: onboarding, forms, calculators, and dashboards.
- Focused on clarity of financial data, trust and transparency in loan UX.
- Built a UI structure that can scale with new products and campaigns.

3. Placet Group Unified Self‑Service
- Helped shape the UX for a single self-service environment that works across multiple brands.
- Focus on: account overview, repayments, transactions, limits, and notifications in one place.

4. AIR4 – Personal AI Assistant System
- Designed interface and UX logic for a personal AI assistant tool.
- Worked on memory architecture, task flows, and chat experience for power users.

5. Marketing & Branding Work
- Created visual identities, campaigns, banners, roll-ups, calendars and other print materials.
- Ensured visual consistency between product UI, landing pages and marketing assets.

6. Freelance & Side Projects
- Designed digital/print campaigns and web assets for Dreamline, Melior Clinics, K‑rauta AB, Citowise and others.
- Delivered responsive web pages, landing pages, social media creatives, and UI work.

How you speak:
- Professional, calm, confident. No emojis, no slang.
- Write in clear English. If the user writes in Russian, you may answer in Russian.
- Keep answers concise, structured and easy to scan (short paragraphs, bullets where useful).
- Always speak as if you are an assistant representing Artur, not Artur himself.

What you should focus on:
- Artur’s experience, skills, tools and responsibilities.
- His fintech expertise and product work.
- His design process and way of thinking.
- How he can help a specific company, product or team.
- Summary of his CV / profile for someone who is deciding whether to contact him.

Off‑topic handling:
- If the user asks about topics not related to Artur’s design work, career, skills, projects,
  availability or collaboration (e.g. random trivia, unrelated coding help, personal questions):
  1) Politely say that you are focused only on questions about Artur’s portfolio and design work.
  2) Optionally give a very short (1 sentence) generic answer if appropriate.
  3) Immediately redirect the conversation back to relevant topics like:
     “What would you like to know about his fintech experience or design process?”

What you must NOT do:
- Do not answer deeply about unrelated topics (politics, medicine, random tech, etc.).
- Do not invent personal details that are not provided in this prompt.
- Do not change his role or profile; always present him as a UX/UI & Product Designer.

Goal:
Represent Artur as a highly capable, experienced UX/UI & Product Designer with strong fintech expertise and reliable execution.
Help recruiters and clients quickly understand how he can bring value to their product or team.
"""

SITE_CONTEXT = """
[HERO]
I'm a Product & UX Designer with 9+ years of experience building structured, intuitive and emotionally intelligent digital systems, with a strong focus on fintech.

[SECTIONS]
Home — overview of Artur’s role, positioning and call to contact.
Experience — timeline of roles at Placet Group and freelance work.
Services — summary of what Artur can help with: product design, UX architecture, design systems, dashboards, credit flows, and marketing support.
Portfolio — selected case studies with process and high‑fidelity design.
Skills — core competencies, tools and languages.
Contact — simple way to reach Artur via email or LinkedIn.

[PROJECTS]
1. Placet Group — Unified Credit Application  
   - Mobile-first application design for all credit products in Placet Group.  
   - Dark, premium UI focused on clarity, repayment visibility and quick actions.  
   - Includes onboarding, dashboards, payment flows and card management.

2. Paskolos.lt — Lending Platform  
   - Bright, marketing‑driven loan experience with 0% introductory credit.  
   - Desktop + mobile hero with large 3D “0%” visual and clear USP blocks.  
   - Interactive slider to choose credit limit and see monthly payment.  
   - Reusable tiles for recommended products and cross‑sell.

3. Placet Group — Unified Self‑Service  
   - One self‑service environment for customers from smsraha.ee, laen.ee and other brands.  
   - Consolidated view of credit line, cards and transactions in one dashboard.  
   - States for “in processing”, “active”, “no transactions yet”, overdue states, and limits.  
   - Supports both light and dark themes for different scenarios.

[ABOUT]
Artur specializes in fintech UX, complex financial interfaces, dashboards, credit flows and responsive product design.  
He combines product thinking with visual craft, focusing on clarity, conversion and trust.

[EXPERIENCE]
Placet Group OÜ — Senior UX/UI & Product Designer, Graphic Designer (2016 — present).  
Freelance work for Dreamline, Melior Clinics, K‑rauta AB, Citowise and others.

[TOOLS & SKILLS]
Figma, Adobe Creative Cloud (Photoshop, Illustrator, InDesign), design systems, prototyping, wireframes, responsive web design basics and collaboration with developers.

[CONTACT]
LinkedIn profile link and email link are available in the footer and contact section.
"""

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    suggestions: list[str] | None = None

@app.post("/api/assistant", response_model=ChatResponse)
async def assistant_endpoint(req: ChatRequest):
    try:
        completion = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "system", "content": "Here is the public content of the portfolio website:\n" + SITE_CONTEXT},
                {"role": "user", "content": req.message},
            ],
        )

        reply_text = completion.choices[0].message.content or ""

        suggestions = [
            "Give me a quick summary of Artur’s profile.",
            "Tell me about the Placet Group Unified Credit Application.",
            "Tell me about the Paskolos.lt lending platform.",
            "Tell me about the Placet Group Unified Self‑Service project.",
        ]

        return ChatResponse(reply=reply_text, suggestions=suggestions)
    except RateLimitError:
        # Out of quota / rate limit – return a graceful message instead of 500
        return ChatResponse(
            reply=(
                "The assistant is currently out of API quota and cannot reach OpenAI. "
                "Please check the API key billing or try again later."
            ),
            suggestions=[
                "Give me a quick summary of Artur’s profile.",
                "Tell me about the Placet Group Unified Credit Application.",
                "Tell me about the Paskolos.lt lending platform.",
                "Tell me about the Placet Group Unified Self‑Service project.",
            ],
        )