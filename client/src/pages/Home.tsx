import { Helmet } from "react-helmet";
import HeroSection from "../components/home/HeroSection";
import FeaturedCollections from "../components/home/FeaturedCollections";
import FeaturedArtworks from "../components/home/FeaturedArtworks";
import FeaturedArtists from "../components/home/FeaturedArtists";
import GalleryExperience from "../components/home/GalleryExperience";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Imbayedu Art Gallery | Discover Unique African Art</title>
        <meta
          name="description"
          content="Discover unique African art pieces from talented artists at Imbayedu Art Gallery. Shop our curated collection of contemporary paintings, sculptures, photography, and mixed media artwork."
        />
      </Helmet>

      <HeroSection />
      <FeaturedCollections />
      <FeaturedArtworks />
      <FeaturedArtists />
      <GalleryExperience />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default Home;
