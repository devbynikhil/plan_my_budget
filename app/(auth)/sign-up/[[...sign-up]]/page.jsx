import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <section className="app-shell flex min-h-screen items-center py-10">
      <div className="grid w-full gap-6 lg:grid-cols-2">
        <div className="glass-panel hidden p-8 lg:block">
          <h2 className="text-3xl font-bold">
            Create your money command center
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start budgeting smarter with responsive dashboards, transaction
            tracking, and AI guidance.
          </p>

          <div className="mt-8 space-y-3 text-sm text-muted-foreground">
            <p>1. Create your first budget category.</p>
            <p>2. Add transactions as you spend.</p>
            <p>3. Get visual analytics and custom suggestions.</p>
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
            <h1 className="mb-5 text-2xl font-bold">Create your account</h1>
            <SignUp
              forceRedirectUrl="/dashboard"
              fallbackRedirectUrl="/dashboard"
              signInUrl="/sign-in"
            />
          </div>
        </main>
      </div>
    </section>
  );
}
