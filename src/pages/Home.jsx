import "./styles/home.css";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import Hero from "../components/Hero";
import { Navigate } from "react-router";
import { useEffect } from "react";

const Home = () => {
  const isAuthenticated = localStorage.getItem("token");

  if (!!isAuthenticated) {
    return <Navigate to={`/space`} replace />;
  }
  return (
    <div className="home">
      <Header />
      <Hero />
      <Footer />
    </div>
  );
};
export default Home;
