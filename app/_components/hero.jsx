import React from "react";
import Image from "next/image";

function hero() {
  return (
    <div>
      <section className="relative flex items-center justify-center min-h-screen">
        <div className="absolute inset-0 bg-white/75 sm:bg-transparent sm:from-white/95 sm:to-white/25 ltr:sm:bg-gradient-to-r"></div>

        <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:items-center lg:px-8">
          <div className="max-w-xl text-center">
            <h1 className="text-3xl font-extrabold sm:text-5xl">
              Take Control of Your Finances with
              <strong className="block font-extrabold text-primary">
                {" "}
                Plan_My_Budget{" "}
              </strong>
            </h1>

            <p className="mt-4 max-w-lg sm:text-xl/relaxed">
              Effortlessly track your spending, manage your budget, and achieve
              your financial goals with our intuitive expense manager.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <a
                href="dashboard"
                className="block w-full rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="font-bold text-3xl mb-4">Welcome</h2>
        <Image src="/dashboard.jpg" alt="hero" width={1000} height={700} />
        <div className="mt-8 flex flex-wrap gap-4 justify-center mb-5">
          <a
            href="dashboard"
            className="block w-full rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}

export default hero;
