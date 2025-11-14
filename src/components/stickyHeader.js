import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function StickyHeader() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        console.log("Scroll position:", window.scrollY);
        if (window.scrollY >= 100) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <header className={`sticky ${isSticky ? 'fixed' : ''}`}>
      <div className="topSec">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <a href="index.html"> <img src="images/footer-logo.png" alt="img" /> </a>
            </div>
          </div>
        </div>
      </div>
      <div className="menuSec">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8 d-none d-md-block">
              <ul id="menu">
                <li><a href="/">Home</a></li>
                <li>
                  <Link to="">Network &nbsp;  <FaPlus /></Link>
                  <ul>
                    <li><Link to="/groups">Companies</Link></li>
                    <li><Link to="/member">Members</Link></li>
                    <li><Link to="/">Videos</Link></li>
                    <li><Link to="/">Photos</Link></li>
                    <li><Link to="/">Forums</Link></li>
                    <li><Link to="/">Submit Article</Link></li>
                  </ul>
                </li>
                <li>
                  <Link to="">Jobs &nbsp;  <FaPlus /></Link>
                  <ul>
                    <li><Link to="/">All Jobs</Link></li>
                    <li><Link to="/">Job Categories</Link></li>
                    <li><Link to="/">Submit Job</Link></li>
                  </ul>
                </li>
                <li>
                  <Link to="">Classifieds &nbsp;  <FaPlus /></Link>
                  <ul>
                    <li><Link to="/">All Adverts</Link></li>
                    <li><Link to="/">Advert Categories</Link></li>
                    <li><Link to="/">Submit Advert</Link></li>
                  </ul>
                </li>
                <li>
                  <Link to="">Pages &nbsp;  <FaPlus /></Link>
                  <ul>
                    <li><Link to="">Subscriptions</Link></li>
                    <li><a href="/faqs">FAQs</a></li>
                  </ul>
                </li>
                <li><Link to="/text">Text</Link></li>
                <li><Link to="/questions">Questions</Link></li>
                <li><Link to="/">Store</Link></li>
              </ul>
            </div>
            <div className="col-lg-4 col-md-4 col-12">
              <div className="menusec-login-register">
                <ul>
                  <li><Link to="/">Login</Link></li>
                  <li><Link to="/register">Register</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default StickyHeader;
