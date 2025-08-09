"use client";
import Header from "../../../client/src/components/layout/Header";
import Footer from "../../../client/src/components/layout/Footer";
import ArtistDetail from "../../../client/src/pages/ArtistDetail";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <ArtistDetail />
      </main>
      <Footer />
    </div>
  );
}