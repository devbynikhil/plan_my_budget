import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <section className="app-shell flex min-h-screen items-center py-10">
      <div className="grid w-full gap-6 lg:grid-cols-2">
        <div className="glass-panel hidden p-8 lg:block">
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue tracking budgets, reviewing insights, and
            planning smarter.
          </p>

          <div className="mt-8 space-y-3 text-sm text-muted-foreground">
            <p>1. Access your dashboard instantly after login.</p>
            <p>2. Manage budgets and recurring transactions.</p>
            <p>3. Use AI recommendations to improve spending habits.</p>
          </div>
        </div>

        <main className="glass-panel flex items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Back to home
            </Link>
            <h1 className="mb-5 text-2xl font-bold">
              Sign in to Plan My Budget
            </h1>
            <SignIn
              forceRedirectUrl="/dashboard"
              fallbackRedirectUrl="/dashboard"
              signUpUrl="/sign-up"
            />
          </div>
        </main>
      </div>
    </section>
  );
}
