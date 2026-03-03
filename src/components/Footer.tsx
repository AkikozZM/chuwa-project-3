import { Link } from "react-router-dom";
import "./Layout.css";
import { icons } from "../constants/icons";

/**
 * TODO:
 * 1. Change icon to correct colors and shapes
 * 2. Adjust css if needed
 */
const Footer = () => {
  return (
    <footer className="footer">
      <div className = "footer-links">
        {/* Desktop */}
        <div className="footer-desktop">
            <div>©{new Date().getFullYear()} All Rights Reserved.</div>
            <div className="footer-icons">
              {icons.YOUTUBE_WHITE}
              {icons.TWITTER_WHITE}
              {icons.FACEBOOK_WHITE}
            </div>
            <div className="footer-infos">
              <Link to="/">Contact us</Link>
              <Link to="/">Privacy Policies</Link>
              <Link to="/">Help</Link>
            </div>
        </div>
        {/* Mobile */}
        <div className="footer-mobile">
            <div className="footer-icons">
              {icons.YOUTUBE_WHITE}
              {icons.TWITTER_WHITE}
              {icons.FACEBOOK_WHITE}
            </div>
            <div className="footer-infos">
              <Link to="/">Contact us</Link>
              <Link to="/">Privacy Policies</Link>
              <Link to="/">Help</Link>
            </div>
            <div>©{new Date().getFullYear()} All Rights Reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
