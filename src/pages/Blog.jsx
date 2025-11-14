import React from 'react';
import StickyHeader from '../components/stickyHeader';
import { MdDoubleArrow } from 'react-icons/md';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function Blog() {
    return (
        <div>
            {/* <StickyHeader /> */}

            <div className="blog-banner-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                            <h2>Article</h2>
                            <ul>
                                <li><Link to="Buzzinguniverse/">Home</Link></li>
                                <li><MdDoubleArrow /></li>
                                <li><Link to="">Article</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <section>
                <div className="inner-blog-main-sec">
                    <div className="container">
                        <div className="col-lg-8 col-md-8 col-12">
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-12">
                                    <div className="inner-blog-main-box">
                                        <div className="inner-blog-main-img">
                                            <img src="images/inner-blog-2.png" alt="img" />
                                        </div>
                                        <div className="inner-blog-main-text">
                                            <strong>December 7, 2023</strong>
                                            <h2>
                                                {/* Use Link from react-router-dom to handle navigation */}
                                                <Link to="Buzzinguniverse/detail-blog">How to Start and Grow a Successful Online Store</Link>
                                            </h2>
                                            <p>Customers have completely embraced online shopping and ordering, and there is no turning back. Retailers...</p>
                                        </div>
                                        <div className="inner-blog-main-btn">
                                            <Link to="Buzzinguniverse/detail-blog">Continue reading...</Link>
                                        </div>
                                    </div>
                                </div>
                                 <div className="col-lg-6 col-md-6 col-12">
                                    <div className="inner-blog-main-box">
                                        <div className="inner-blog-main-img">
                                            <img src="images/inner-blog-2.png" alt="img" />
                                        </div>
                                        <div className="inner-blog-main-text">
                                            <strong>December 7, 2023</strong>
                                            <h2><Link to="Buzzinguniverse/detail-blog">How to Start and Grow a Successful Online Store</Link></h2>
                                            <p>Customers have completely embraced online shopping and ordering, and there is no turning back. Retailers...</p>
                                        </div>
                                        <div className="inner-blog-main-btn">
                                            <Link  to="Buzzinguniverse/detail-blog">Continue reading...</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-12">
                                    <div className="inner-blog-main-box">
                                        <div className="inner-blog-main-img">
                                            <img src="images/inner-blog-3.png" alt="img" />
                                        </div>
                                        <div className="inner-blog-main-text">
                                            <strong>November 15, 2023</strong>
                                            <h2><Link to="Buzzinguniverse/detail-blog">The Art of Building a Strong Brand and Attracting Customers</Link></h2>
                                            <p>Section 1: The Foundation of a Strong Brand: Understanding the Building Blocks In the dynamic and competitive...</p>
                                        </div>
                                        <div className="inner-blog-main-btn">
                                            <Link to="Buzzinguniverse/detail-blog">Continue reading...</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-12">
                                    <div className="inner-blog-main-box">
                                        <div className="inner-blog-main-img">
                                            <img src="images/inner-blog-4.png" alt="img" />
                                        </div>
                                        <div className="inner-blog-main-text">
                                            <strong>November 14, 2023</strong>
                                            <h2><Link to="Buzzinguniverse/detail-blog">NFTs in Reshaping Business Strategies</Link></h2>
                                            <p>In today’s business environment, a groundbreaking transformation is underway with the advent of Non...</p>
                                        </div>
                                        <div className="inner-blog-main-btn">
                                            <Link to="Buzzinguniverse/detail-blog">Continue reading...</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-12">
                                    <div className="inner-blog-main-box">
                                        <div className="inner-blog-main-img">
                                            <img src="images/inner-blog-5.png" alt="img" />
                                        </div>
                                        <div className="inner-blog-main-text">
                                            <strong>November 14, 2023</strong>
                                            <h2><Link to="Buzzinguniverse/detail-blog">Amazing Offbeat Destinations: Authentic and Unique Travel Experiences</Link></h2>
                                            <p>Offbeat destinations harbor indigenous cultures and traditions, offering a genuine immersion not found in...</p>
                                        </div>
                                        <div className="inner-blog-main-btn">
                                            <Link to="Buzzinguniverse/detail-blog">Continue reading...</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-12">
                                    <div className="inner-blog-main-box">
                                        <div className="inner-blog-main-img">
                                            <img src="images/inner-blog-6.png" alt="img" />
                                        </div>
                                        <div className="inner-blog-main-text">
                                            <strong>November 14, 2023</strong>
                                            <h2><Link to="Buzzinguniverse/detail-blog">The Role of Nutrition: How to Stay Healthy</Link></h2>
                                            <p>Protein, minerals, fats, vitamins, fiber, carbohydrates, and water are all essential nutrients for humans...</p>
                                        </div>
                                        <div className="inner-blog-main-btn">
                                            <Link to="Buzzinguniverse/detail-blog">Continue reading...</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-12">
                                    <div className="inner-blog-main-box">
                                        <div className="inner-blog-main-img">
                                            <img src="images/inner-blog-7.png" alt="img" />
                                        </div>
                                        <div className="inner-blog-main-text">
                                            <strong>November 14, 2023</strong>
                                            <h2><Link to="Buzzinguniverse/detail-blog">The Impact of Electric Vehicles on Personal Finances</Link></h2>
                                            <p>In a world where change is the only constant, the automotive landscape is experiencing a transformation that...</p>
                                        </div>
                                        <div className="inner-blog-main-btn">
                                            <Link to="Buzzinguniverse/detail-blog">Continue reading...</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-12">
                                    <div className="inner-blog-main-box">
                                        <div className="inner-blog-main-img">
                                            <img src="images/inner-blog-8.png" alt="img" />
                                        </div>
                                        <div className="inner-blog-main-text">
                                            <strong>November 14, 2023</strong>
                                            <h2><Link to="Buzzinguniverse/detail-blog">The Future of Artificial Intelligence and Society</Link></h2>
                                            <p>Artificial intelligence (AI) is no longer a figment of science fiction; it has permeated our reality, subtly...</p>
                                        </div>
                                        <div className="inner-blog-main-btn">
                                            <Link to="Buzzinguniverse/detail-blog">Continue reading...</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-12">
                                    <div className="inner-blog-main-box">
                                        <div className="inner-blog-main-img">
                                            <img src="images/inner-blog-9.png" alt="img" />
                                        </div>
                                        <div className="inner-blog-main-text">
                                            <strong>November 7, 2023</strong>
                                            <h2><Link to="Buzzinguniverse/detail-blog">Climate Change and Companies</Link></h2>
                                            <p>Climate change and the transition to a net-zero future could create new industries and new growth opportunities...        </p>
                                        </div>
                                        <div className="inner-blog-main-btn">
                                            <Link to="Buzzinguniverse/detail-blog">Continue reading...</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />


        </div>
    )
}
