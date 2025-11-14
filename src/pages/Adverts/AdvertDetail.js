import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import NavBarr from './Comp/NavBarr';
import { FaMapMarkerAlt, FaClock, FaTags } from 'react-icons/fa';
import RenderHtml from '../../helpers/RenderHtml';
import AdvertDetailSkeleton from './Comp/AdvertDetailSkeleton';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaEnvelope } from 'react-icons/fa6';

const AdvertDetail = () => {
    const { id } = useParams();
    const [advert, setAdvert] = useState(null);
    const [status, setStatus] = useState({ loading: true, error: '' });

    useEffect(() => {
        const fetchAdvert = async () => {
            try {
                const res = await axios.get(`https://buzzinguniverse.com/backend/api/advert/detail/${id}`);
                if (res.data.status) {
                    setAdvert(res.data.data);
                } else {
                    setStatus({ loading: false, error: 'Advert not found.' });
                }
            } catch {
                setStatus({ loading: false, error: 'Failed to fetch advert.' });
            } finally {
                setStatus(prev => ({ ...prev, loading: false }));
            }
        };
        fetchAdvert();
    }, [id]);

    if (status.loading) return <AdvertDetailSkeleton />;
    if (status.error || !advert) return <p className="error">{status.error}</p>;

    const gallery = advert.gallery?.map(img => `https://buzzinguniverse.com/backend/${img}`) || [];

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    dots: true,
                },
            },
        ],
    };

    return (
        <div className="container-jobW">
            <motion.div
                className="jobWrpert col-lg-9"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >

                <div className="asd-detail-box">
                    <div className="asd-header">
                        <h1 className="asd-title">{advert.title}</h1>
                        <div className="asd-price">${advert.price}</div>
                    </div>

                    {gallery.length > 0 && (
                        <div className="asd-slider-wrapper">
                            <Slider {...sliderSettings} className="asd-slider">
                                {gallery.map((img, i) => (
                                    <div key={i}>
                                        <img src={img} alt={`gallery-${i}`} className="asd-main-image" />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    )}
                     <section className="jb-key-points">
                        <div><FaTags /> <strong>Category:</strong> {advert.category}</div>
                        <div><FaMapMarkerAlt /><strong>Location:</strong> {advert.location}</div>
                    </section>
                    <div className="asd-meta">
                        <div className="asd-author">
                            <img src="/images/b.png" className="asd-author-avatar" alt="author" />
                            <div>
                                <p>By {advert.contact_person}</p>
                                <span>Published {new Date(advert.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <section className="asd-description">
                        <h3>Description:</h3>
                        {RenderHtml(advert.description)}
                    </section>

                    <div className="asd-actions mt-4">
                        <a href={`tel:${advert.phone_number}`} className="jb-btn jb-btn-primary">Call: {advert.phone_number}</a>
                    </div>
                </div>
            </motion.div>

            <aside className="jb-sidebar">
                <div className="jb-overview">
                    <h3>Advert Overview</h3>
                    <ul className="jb-overview-list">
                        <li>
                            <span className="jb-icon"><FaClock /></span>
                            <div className="jb-meta">
                                <label>Posted</label>
                                <p>{new Date(advert.created_at).toDateString()}</p>
                            </div>
                        </li>
                        <li>
                            <span className="jb-icon"><FaMapMarkerAlt /></span>
                            <div className="jb-meta">
                                <label>Location</label>
                                <p>{advert.location}</p>
                            </div>
                        </li>
                        <li>
                            <span className="jb-icon"><FaTags /></span>
                            <div className="jb-meta">
                                <label>Category</label>
                                <p>{advert.category}</p>
                            </div>
                        </li>
                        <li>
                            <span className="jb-icon"><FaEnvelope /></span>
                            <div className="jb-meta">
                                <label>Email</label>
                                <p>{advert.email}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    );
};

export default AdvertDetail;
