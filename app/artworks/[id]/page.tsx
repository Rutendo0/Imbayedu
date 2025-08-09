"use client";
import Header from "../../../client/src/components/layout/Header";
import Footer from "../../../client/src/components/layout/Footer";
import ArtworkDetail from "../../../client/src/pages/ArtworkDetail";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <ArtworkDetail />
      </main>
      <Footer />
    </div>
  );
}