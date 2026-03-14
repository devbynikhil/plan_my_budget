import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  MailCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function hero() {
  const highlights = [
    {
      title: "Live Budget Tracking",
      description:
        "Track spend in real time with category-level progress and budget alerts.",
      icon: BarChart3,
    },
    {
      title: "AI Financial Advice",
      description:
        "Chat with your advisor to optimize spending, saving, and budgeting habits.",
      icon: Bot,
    },
    {
      title: "Smart Reminders",
      description:
        "Automate recurring reminders so subscriptions and bills never surprise you.",
      icon: MailCheck,
    },
  ];

  return (
    <div className="app-shell py-8 sm:py-12 lg:py-16">
      <section className="glass-panel relative overflow-hidden p-6 sm:p-10 lg:p-14">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-2xl" />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-chart-2/20 blur-2xl" />

        <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Built for modern personal finance
            </div>

            <h1 className="max-w-xl text-balance text-3xl font-bold leading-tight sm:text-5xl">
              Master your money with a budget experience that feels effortless.
            </h1>

            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              Plan My Budget combines budgeting, transactions, insights, and an
              AI advisor into one clean workflow so you can spend with
              confidence.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/dashboard">
                <Button className="gap-2">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline">Start Free</Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3 sm:text-sm">
              <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                <p className="font-semibold">500+</p>
                <p className="text-muted-foreground">Tracked transactions</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                <p className="font-semibold">AI-powered</p>
                <p className="text-muted-foreground">Financial coaching</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/70 p-3 col-span-2 sm:col-span-1">
                <p className="font-semibold">Fully Responsive</p>
                <p className="text-muted-foreground">Desktop to mobile</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-sm"
              >
                <item.icon className="mb-3 h-5 w-5 text-primary" />
                <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
            <article className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/15 to-chart-2/10 p-5 shadow-sm sm:col-span-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium">
                <ShieldCheck className="h-4 w-4" />
                Safe authentication and secure APIs
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Sign in quickly, land directly in your dashboard, and start
                planning your money from minute one.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div className="glass-panel p-5">
          <h3 className="mb-2 text-lg font-semibold">
            Track Across Categories
          </h3>
          <p className="text-sm text-muted-foreground">
            Food, travel, education, rent, subscriptions, and custom categories.
          </p>
        </div>
        <div className="glass-panel p-5">
          <h3 className="mb-2 text-lg font-semibold">Visual Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Understand trends instantly with interactive charts and comparison
            views.
          </p>
        </div>
        <div className="glass-panel p-5 sm:col-span-2 lg:col-span-1">
          <h3 className="mb-2 text-lg font-semibold">Weekly Action Plan</h3>
          <p className="text-sm text-muted-foreground">
            See what to improve next week with actionable recommendations.
          </p>
        </div>
      </section>
    </div>
  );
}

export default hero;
