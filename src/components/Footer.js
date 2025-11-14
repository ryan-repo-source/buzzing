import React from 'react'
import { FaGooglePlusG, FaPinterestP, FaXTwitter } from 'react-icons/fa6'
import { TiSocialLinkedin } from 'react-icons/ti'
import { Link, useNavigate } from 'react-router-dom'
import { useUserContext } from '../context/UserContext';
import secureLocalStorage from 'react-secure-storage';

export default function Footer() {
    const { setTabb } = useUserContext();
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
    const navigate = useNavigate();
    const ChaNgeTab = (val) => {
        navigate(`/member/${auth.id}/profile`);
        setTabb(val);
    }
    return (

        <>
            <section>
                <div className="socail-link-sec">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 col-md-8 col-12">
                                <ul>
                                    <li><Link href="#"><FaXTwitter /> </Link></li>
                                    <li><Link href="#"><FaGooglePlusG /> </Link></li>
                                    <li><Link href="#"><FaPinterestP /> </Link></li>
                                    <li><Link href="#"><TiSocialLinkedin /></Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer>
                <div className="footer-main-sec">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 col-md-3 col-12">
                                <div className="footer-main-company">
                                    <h2>Company</h2>
                                    <ul>
                                        <li><Link to="/term-services">Terms of Service</Link></li>
                                        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                                        <li><Link to="/about">About User</Link></li>
                                        <li><Link to="/contact">Contact</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-12">
                                <div className="footer-main-company">
                                    <h2>Community</h2>
                                    <ul>
                                        <li><Link to="/gallery">Photos</Link></li>
                                        <li><Link to="/videos">Videos</Link></li>
                                        <li><Link to="/groups">Groups</Link></li>
                                        <li><Link to="/forums">Forums</Link></li>
                                        <li><Link to="/articles">Articles</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-12">
                                <div className="footer-main-company">
                                    <h2>Useful links</h2>
                                    <ul>
                                        <li><Link to="/adverts">Classifieds</Link></li>
                                        <li><Link to="/jobs">Search jobs</Link></li>
                                        <li><Link to="/job/submit-job">Post a job</Link></li>
                                        <li><Link to="/advert/submit-advert">Post an ad</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-12">
                                <div className="footer-main-company">
                                    <h2>Legal</h2>
                                    <ul>
                                        <li><a href="/brand-and-attracting-customers">Brand policy</a></li>
                                        <li><Link href="#">Cookie</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="copy-rights-row">
                            <div className="row">
                                <div className="col-lg-12 col-md-12 col-12">
                                    <p>Buzzing Universe © 2025. All rights reserved.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>

    )
}
