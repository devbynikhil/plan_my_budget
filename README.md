# 🗂️ Plan My Budget

A modern, AI-powered budgeting and expense management app built with Next.js. Effortlessly track your spending, manage budgets, and receive personalized financial insights—all in one place.

## 🚩 Features

- **Flexible Budget Management:** Create, edit, and monitor multiple budgets with custom categories and spending limits.
- **Transaction Tracking:** Log, categorize, and analyze income and expenses with ease.
- **AI Financial Advisor:** Get tailored advice and insights from multiple AI providers.
- **Visual Analytics:** Interactive charts and reports for clear financial overviews.
- **Automated Reminders:** Email alerts and weekly summaries to keep you on track.
- **Responsive UI:** Optimized for desktop, tablet, and mobile.

## 🤖 AI Integration

- Supports OpenAI, Groq, xAI (Grok), Ollama, Hugging Face, and mock providers.
- Smart fallback system ensures AI features are always available.
- Interactive chat for financial questions and recommendations.

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Shadcn/ui
- **Backend:** Next.js API Routes, Server Actions
- **Database:** PostgreSQL (Drizzle ORM)
- **Authentication:** Clerk
- **Email:** Nodemailer (Gmail SMTP)
- **Testing:** Jest, Playwright
- **Deployment:** Vercel, Docker

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or compatible service)
- Clerk account

### 1. Clone & Install

```bash
git clone plan_my_budget.git
cd plan_my_budget
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_DATABASE_URL=...
AI_PROVIDER=groq
GROQ_API_KEY=...
SMTP_HOST=smtp.gmail.com
SMTP_USER=...
SMTP_PASS=...
```

### 3. Database Setup

```bash
npm run db:push
```

### 4. Start Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## 🐳 Docker

- **Development:** `docker-compose up --build`
- **Production:** `docker-compose -f docker-compose.prod.yml up --build`

## 🧪 Testing

- Unit: `npm test`
- E2E: `npm run test:e2e`
- AI setup: `npm run setup:ai`

## 📊 Environment Variables

| Variable                            | Description           | Required | Default |
| ----------------------------------- | --------------------- | -------- | ------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk authentication  | ✅       | -       |
| `CLERK_SECRET_KEY`                  | Clerk server key      | ✅       | -       |
| `NEXT_PUBLIC_DATABASE_URL`          | PostgreSQL connection | ✅       | -       |
| `AI_PROVIDER`                       | AI service provider   | ❌       | `mock`  |
| `GROQ_API_KEY`                      | Groq AI API key       | ❌       | -       |
| `OPENAI_API_KEY`                    | OpenAI API key        | ❌       | -       |
| `XAI_API_KEY`                       | xAI (Grok) API key    | ❌       | -       |
| `SMTP_HOST`                         | Email server host     | ❌       | -       |
| `SMTP_USER`                         | Email username        | ❌       | -       |
| `SMTP_PASS`                         | Email password        | ❌       | -       |

## 📦 Deployment

- **Vercel:** Connect your repo, set environment variables, and deploy.
- **Railway:** Connect repo, set variables, deploy.
- **Self-hosted:** Use Docker Compose.

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit and push your changes
4. Open a Pull Request

## 📄 License

MIT License. See [LICENSE](LICENSE).

## 🙏 Acknowledgments

- Next.js, Clerk, Drizzle ORM, Tailwind CSS, Shadcn/ui, Groq, and more.

## 📞 Contact

- Email: [nk10nikhil@gmail.com]
- Live Demo: [planmybudget.vercel.app](https://planmybudget.vercel.app)

---
