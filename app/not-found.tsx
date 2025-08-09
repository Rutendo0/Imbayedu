"use client";
import Header from "../client/src/components/layout/Header";
import Footer from "../client/src/components/layout/Footer";
import NotFound from "../client/src/pages/not-found";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <NotFound />
      </main>
      <Footer />
    </div>
  );
}