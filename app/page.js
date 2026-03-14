import React from "react";
import Header from "./_components/header";
import Hero from "./_components/hero";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />

      <section id="how-it-works" className="app-shell pb-12 sm:pb-16">
        <div className="glass-panel p-6 sm:p-8">
          <h2 className="text-xl font-bold sm:text-2xl">How it works</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Step 1
              </p>
              <h3 className="mt-1 font-semibold">Create budgets</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Define your monthly plan with amounts, categories, and goals.
              </p>
            </article>
            <article className="rounded-xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Step 2
              </p>
              <h3 className="mt-1 font-semibold">Add transactions</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Log spending quickly and track recurring expenses automatically.
              </p>
            </article>
            <article className="rounded-xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Step 3
              </p>
              <h3 className="mt-1 font-semibold">Improve weekly</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Use analytics and AI suggestions to optimize your money habits.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="faq" className="app-shell pb-12 sm:pb-16">
        <div className="glass-panel p-6 sm:p-8">
          <h2 className="text-xl font-bold sm:text-2xl">FAQ</h2>
          <div className="mt-5 space-y-3 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">
                Is this app mobile friendly?
              </span>{" "}
              Yes, all core workflows are responsive for phones and tablets.
            </p>
            <p>
              <span className="font-semibold text-foreground">
                Can I use AI advice without paid APIs?
              </span>{" "}
              Yes, you can use supported free-tier providers.
            </p>
            <p>
              <span className="font-semibold text-foreground">
                Do I get redirected after login?
              </span>{" "}
              Yes, sign-in and sign-up flow go directly to your dashboard.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
