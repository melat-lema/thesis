import Header from "@/components/header";
import AboutSection from "./components/aboutSection";
import Banner from "./components/Banner";
import Carousel from "./components/Carousel";
import Categories from "./components/Categories";
import Courses from "./components/Courses";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import ServiceSection from "./components/serviceSection";

export default function Home() {
  return (
    <>
      <Header />
      <Carousel />
      <ServiceSection />
      <AboutSection />
      <Banner />
      <Categories />
      <Courses />
      <FAQ />
      <Footer />
    </>
  );
}
