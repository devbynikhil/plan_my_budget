import { Ubuntu } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import { ClerkProvider } from "@clerk/nextjs";

const ubuntu = Ubuntu({ weight: "400", subsets: ["latin"] });

export const metadata = {
  title: "Plan My Budget",
  description:
    "Track budgets, transactions, and insights in one responsive app.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={ubuntu.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              try {
                const saved = localStorage.getItem('plan-my-budget-theme');
                const isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark', isDark);
              } catch (error) {
                document.documentElement.classList.remove('dark');
              }
            })();`,
          }}
        />
        <ClerkProvider>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
