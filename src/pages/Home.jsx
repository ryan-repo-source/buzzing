import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Link } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import axios from 'axios';


export default function Home() {

    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState(null);

    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const Submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('https://buzzinguniverse.com/backend/api/user-login',
                {
                    email: formData.email,
                    password: formData.password,
                }
            );
            if (response.data.code === "200") {
                secureLocalStorage.setItem('auth_data', JSON.stringify(response.data.data));
                setTimeout(function () {
                    window.location.replace(`/activity`);
                }, 1000)
            } else {
                setFeedback({ type: 'error', message: response.data.message });
            }
        } catch (error) {
            setFeedback({ type: 'error', message: 'Login failed. Please check your details and try again.' });
        } finally {
            setLoading(false);
        }
    }

    const getEvents = async () => {
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/get-article`);
            setEvents(await res.data.data);
        } catch (error) {
            console.log(error)
        }
    }

    const formattedDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    };

    useEffect(() => {
        getEvents();
    }, []);


    return (
        <>
            <div className="welcome-every-one-sec">
                <div className="container">
                    <div className="row" style={{ alignItems: 'center' }}>
                        <div className="col-lg-6 col-md-6 col-12">
                            <div className="welcome-every-one-img">
                                <img src="images/welcome-every-one-img.png" alt="Welcome" />
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-12">
                            <div className="welcome-every-one-heading">
                                <h1>
                                    <strong>Welcome,</strong> {auth != null ? auth.fname : 'everyone!'}
                                </h1>
                            </div>
                            {auth != null ? <div className='welcome-every-one-btn'><Link to={`/member/${auth.id}/profile`}>Visit Profile</Link></div> : <div className="welcome-every-one-form">
                                <form>
                                    <input type="text" name="email" placeholder="Username or Email" value={formData.email} onChange={handleChange} />
                                    <input type="password" name="password" placeholder="Blue Key" value={formData.password} onChange={handleChange} />
                                    <ul className="remember-check-box">
                                        <li>
                                            <div className="form-group">
                                                <input type="checkbox" id="html" />
                                                <label htmlFor="html"> Remember</label>
                                            </div>
                                        </li>
                                        <li>
                                            <Link to="lost-password">Lost blue key?</Link>
                                        </li>
                                    </ul>
                                    <div className="welcome-every-one-btn">
                                        <button type="submit" onClick={Submit}>{loading ? "Logging..." : "Login"}</button>
                                    </div>
                                    {feedback.message && (
                                        <div className={`mt-3 alert alert-${feedback.type === 'success' ? 'success' : 'danger'}`}>
                                            {feedback.message}
                                        </div>
                                    )}
                                    <div className="create-account-btn">
                                        <Link to="register">Create an account</Link>
                                    </div>
                                </form>
                            </div>}
                            <ul className="welcome-every-one-link">
                                <li>
                                    <Link to="/">My Lobby</Link>
                                </li>
                                <li>
                                    <Link to="/term-services">Terms of Service</Link>
                                </li>
                                <li>
                                    <Link to="/privacy-policy">Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link to="/about">About Us</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <section>
                <div className="business-health-box-sec">
                    <div className="container-fluid px-3">
                        <div className="row">
                            {
                                events ? events.map((evt, key) => (
                                    key < 5 && <div className="col">
                                        <div className="business-health-main-box">
                                            <div className="business-health-main-box-img">
                                                <img src={`https://buzzinguniverse.com/backend/${evt.picture}`} alt="img" />
                                                <div className="bus-hea-main-box-img-tile">
                                                    <span>{evt.category}</span>
                                                </div>
                                            </div>
                                            <div className="business-health-main-box-heading">
                                                <Link to={`/event/${evt.id}`}>
                                                    <h2>{evt.title}</h2>
                                                </Link>
                                            </div>
                                            <div className="business-health-main-box-date">
                                                <strong>{formattedDate(evt.created_at)}</strong>
                                            </div>
                                        </div>
                                    </div>
                                )) : 'Loading...'
                            }
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="explore-an-online-sec">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-12">
                                <div className="explore-an-online-heading">
                                    <h2>Explore an online <br /><span>community</span></h2>
                                </div>
                            </div>
                        </div>
                        <div className="explore-an-online-row">
                            <div className="row" style={{ alignItems: 'center' }}>
                                <div className="col-lg-6 col-md-6 col-12">
                                    <div className="explore-an-online-post-ads-heading">
                                        <h2>Post ads! <span>Search for jobs</span></h2>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-12">
                                    <div className="explore-an-online-post-ads-images">
                                        <img src="images/explore-an-online-img.jpg" alt="img" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="companies-and-entrepreneurs-sec">
                    <div className="container-fluid px-0">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-12">
                                <div className="companies-and-entrepreneurs-tag-line">
                                    <div class="marquee-container">
                                        <div class="marquee">
                                            <span>
                                                Companies and entrepreneurs - Devised for creating professional business presentations - Business seminars -
                                            </span>
                                            <span>
                                                Companies and entrepreneurs - Devised for creating professional business presentations - Business seminars -
                                            </span>
                                        </div>
                                        <div class="marquee">
                                            <span>
                                                Companies and entrepreneurs - Devised for creating professional business presentations - Business seminars -
                                            </span>
                                            <span>
                                                Companies and entrepreneurs - Devised for creating professional business presentations - Business seminars -
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="companies-and-entrepreneurs-row">
                            <div className="row">
                                <div className="col-lg-4 col-md-4 col-12">
                                    <div className="companies-and-entrepreneurs-img">
                                        <img src="images/companies-and-entrepreneurs-1.png" alt="img" />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-12  padding-right-no padding-left-no">
                                    <div className="companies-and-entrepreneurs-img">
                                        <img src="images/companies-and-entrepreneurs-2.png" alt="img" />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-12 padding-left-no">
                                    <div className="companies-and-entrepreneurs-heading">
                                        <h2>Connect with businesses through a virtual place</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="companies-and-entrepreneurs-row ">
                            <div className="row">
                                <div className="col-lg-4 col-md-4 col-12  ">
                                    <div className="companies-and-entrepreneurs-img">
                                        <img src="images/companies-and-entrepreneurs-3.png" alt="img" />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-12  padding-right-no padding-left-no">
                                    <div className="companies-and-entrepreneurs-img">
                                        <img src="images/companies-and-entrepreneurs-4.png" alt="img" />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-12 padding-left-no">
                                    <div className="companies-and-entrepreneurs-heading">
                                        <h2>Create and present your business idea to companies</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="companies-and-entrepreneurs-banner">
                <img src="images/companies-and-entrepreneurs-5.jpg" alt="img" />
            </div>

            <section>
                <div className="join-us-on-buzzing-universe-sec">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-12">
                                <div className="join-us-on-buzzing-universe-heading">
                                    <h2>Join us on <span>Buzzing Universe!</span></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="dreamstime-images">
                <img src="images/dreamstime-img.jpg" alt="img" />
            </div>

            <div className='footerHome'>
                <img src="images/footer-logo.png" height={35} alt="img" />
                © {new Date().getFullYear()}
            </div>
        </>
    )
}
