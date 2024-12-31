import "./styles/home.css";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import Hero from "../components/Hero";
const Home = () => {
  return (
    <div className="home">
      <Header />
      <Hero />
      <Footer />
    </div>
  );
};
export default Home;
