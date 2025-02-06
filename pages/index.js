import Features from "../components/Features";
import Footer from "../components/Footer";
import Landing from "../components/Landing";
import Numbers from "../components/Numbers";
import Reviews from "../components/Reviews";
import Nav from "../components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <Landing />
      <Features />
      <Reviews />
      <Numbers />
      <Footer />
    </>
  );
}
