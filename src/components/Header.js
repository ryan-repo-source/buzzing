import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import Navigation from './Navigation';
import { useUserContext } from '../context/UserContext';
import LoginPopup from './LoginPopup';

const Header = () => {
  const { setTabb, auth_data } = useUserContext();
  const location = useLocation();

  const [showLoginModal, setModalShow] = useState(false);

  // Check if the path matches "/"
  // location.pathname.includes("/text")
  if (location.pathname === "/" || location.pathname.includes("/profile") || location.pathname.includes("/activity")) {
    return false; // Render nothing if the path is "/"
  }
  // <li><a href="/">Home</a></li>
  if (location.pathname.includes("/text")) {
    return (
    <header>
      <div className="topSec">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <Link to="activity"> <img src="images/footer-logo.png" height={35} alt="img" /> </Link>
            </div>
          </div>
        </div>
      </div>
    </header>


  );
  }
  const auth = auth_data || null;

  return (
    <header>
      <div className="topSec">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <Link to="activity"> <img src="images/footer-logo.png" height={35} alt="img" /> </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="menuSec">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-10 d-none d-md-block">
              <ul id="menu">
                
                <li>
                  <Link to="">Network &nbsp;  <FaPlus /></Link>
                  <ul>
                    <li><Link to="/groups">Companies</Link></li>
                    <li><Link to="/member">Members</Link></li>
                    {/* <li><Link to={auth ? '/videos' : '/'}>Videos</Link></li>
                    <li><Link to={auth ? '/gallery' : '/'}>Photos</Link></li>
                    <li><Link to="/forums">Forums</Link></li> */}
                    <li><Link to="/submit-article">Submit Article</Link></li>
                  </ul>
                </li>
                <li>
                  <Link to="">Jobs &nbsp;  <FaPlus /></Link>
                  <ul>
                    <li><Link to="/jobs">All Jobs</Link></li>
                    {/* <li><Link to="/">Job Categories</Link></li> */}
                    <li><Link to="/job/submit-job">Submit Job</Link></li>
                  </ul>
                </li>
                <li>
                  <Link to="">Classifieds &nbsp;  <FaPlus /></Link>
                  <ul>
                    <li><Link to="/adverts">All Adverts</Link></li>
                    {/* <li><Link to="/">Advert Categories</Link></li> */}
                    <li><Link to="/advert/submit-advert">Submit Advert</Link></li>
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
                <li><Link to="/store">Store</Link></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-2 col-12 text-end">
              {auth.id ? <Navigation usrData={auth} setTabb={setTabb} />
                : <div className="menusec-login-register">
                  <ul>
                    <li><Link to="/" onClick={(e) => { e.preventDefault(); setModalShow(true) }}>Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                  </ul>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      {showLoginModal && <LoginPopup showLoginModal={showLoginModal} setModalShow={setModalShow} />}
    </header>


  );
};

export default Header;
