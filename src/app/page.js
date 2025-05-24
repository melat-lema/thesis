import Header from "@/components/header";
import AboutSection from "./components/aboutSection";
import Carousel from "./components/Carousel";
import Categories from "./components/Categories";
import Courses from "./components/Courses";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import ServiceSection from "./components/serviceSection";
import Banners from "./components/Banners";

export default function Home() {
  return (
    <>
      <Header />
      <Carousel />
      <ServiceSection />
      <AboutSection />
      <Banners />
      <Categories />
      <Courses />
      <FAQ />
      <Footer />
    </>
  );
}
