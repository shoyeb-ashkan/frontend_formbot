import "./styles/hero.css";
import figure from "../assets/images/figure.svg";
import triangle from "../assets/svgs/triangle.svg";
import circle from "../assets/svgs/circle.svg";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section className="hero__container">
      <div className="hero__content">
        <img
          src={triangle}
          alt="triangle"
          className="no-select hero__triangle"
        />

        <div className="hero__text">
          <h1 className="hero__title no-select">
            Build advanced chatbots visually
          </h1>
          <p className="hero__description no-select">
            Typebot gives you powerful blocks to create unique chat experiences.
            Embed them anywhere on your web/mobile apps and start collecting
            results like magic.
          </p>
          <Link className="hero__button" to="/login">
            Create a FormBot for free
          </Link>
        </div>
        <img
          src={circle}
          alt="circle"
          className="no-select hero__circle-top"
        />
      </div>

      <div className="hero__image">
        <div className="hero__circles">
          <div className="no-select hero__circle hero__circle--left" />
          <div className="no-select hero__circle hero__circle--right" />
        </div>
        <img src={figure} alt="figure" className="no-select hero__figure" />
      </div>
    </section>
  );
};
export default Hero;
