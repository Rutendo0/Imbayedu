'use client'

import HeroSection from "../home/HeroSection";
import FeaturedCollections from "../home/FeaturedCollections";
import FeaturedArtworks from "../home/FeaturedArtworks";
import FeaturedArtists from "../home/FeaturedArtists";
import GalleryExperience from "../home/GalleryExperience";
import Testimonials from "../home/Testimonials";
import Newsletter from "../home/Newsletter";
import Exhibitions from "../home/Exhibitions";
import GiftHighlight from "../home/GiftHighlight";
import FAQ from "./FAQ"

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturedCollections />
      <FeaturedArtworks />
      <FeaturedArtists />
      <GalleryExperience />
      <GiftHighlight />
      <Exhibitions />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </>
  );
};

export default Home;
