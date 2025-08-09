"use client";
import Header from "../../client/src/components/layout/Header";
import Footer from "../../client/src/components/layout/Footer";
import Artists from "../../client/src/pages/Artists";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Artists />
      </main>
      <Footer />
    </div>
  );
}