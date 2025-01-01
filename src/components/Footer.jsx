import "./styles/footer.css";
import logo from "/logo.svg";
import { links } from "../utils/utils";
import arrow from "../assets/svgs/link-arrow.svg";
const Footer = () => {
  const handleLinkClick = (event) => {
    event.preventDefault(); // Prevents the default action of the link
  };

  return (
    <div className="footer__container">
      <div className="footer__content">
        <div className="footer__logo-container no-select">
          <img src={logo} alt="logo" className="footer__logo" />
          FormBot
        </div>
        <div className="footer__copyright">
          Made with ❤️ by{" "}
          <a
            href="https://shoyeb-ashkan.netlify.app/"
            target="_blank"
            rel="noreferrer"
          >
            Shoyeb Ashkan
          </a>
        </div>
      </div>

      {links &&
        Object.entries(links).map(([category, items]) => (
          <div className="footer__links-container" key={category}>
            <h3 className="footer__links-title">{category}</h3>
            {items.map((item) => (
              <a
                className="footer__link"
                href={item.link}
                onClick={handleLinkClick}
                key={item.name}
              >
                <p>{item.name}</p> <img src={arrow} alt="arrow" />
              </a>
            ))}
          </div>
        ))}
    </div>
  );
};

export default Footer;
