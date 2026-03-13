import { Ubuntu } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const ubuntu = Ubuntu({ weight: "400", subsets: ["latin"] });

export const metadata = {
  title: "Expenses Tracker",
  description: "Track your expenses with ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={ubuntu.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
