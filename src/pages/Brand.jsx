import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AddCommentEvents from '../helpers/AddCommentEvents';
import secureLocalStorage from 'react-secure-storage';
import EventComments from '../helpers/EventComments';
import LoginPopup from '../components/LoginPopup';

function renderHTML(html) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Brand() {
    const [event, setEvent] = useState();
    const [showLoginModal, setModalShow] = useState(false);
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
    const { id } = useParams();
    const getEvents = async () => {
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/get-article-single?id=${id}`);
            setEvent(await res.data.data);
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

    console.log(event)

    if (!event) return false;

    return (
        <>
            <section>
                <div className="brand-and-attracting-customers-sec">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-12">
                                <div className="brand-and-att-cust-main-heading">
                                    <h2>{event.title}</h2>
                                    <span><i className="fas fa-calendar-alt" /> {formattedDate(event.created_at)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="brand-and-attracting-customers-row">
                            <div className="row">
                                <div className="col-lg-8 col-md-8 col-12">
                                    <div className="brand-and-attracting-customers-images">
                                        <img src={`https://buzzinguniverse.com/backend/${event.picture}`} alt="img" />
                                        <ul className="brand-and-attracting-customers-socail">
                                            <li><Link href=""><i className="fab fa-twitter" /> Twitter</Link></li>
                                            <li className="linkedin"><Link href=""><i className="fab fa-invision" /> LinkedIn</Link></li>
                                            <li className="reddit"><Link href=""><i className="fab fa-reddit" />Reddit </Link></li>
                                        </ul>
                                        {renderHTML(event.description)}
                                    </div>
                                    <EventComments event={event} auth={auth} getEvents={getEvents} />
                                    <div className="leave-reply-box">
                                        <h2>Leave a Reply</h2>
                                        {auth ? <AddCommentEvents event={event} getEvents={getEvents} /> : <p>You must be <Link href="#" onClick={(e) => { e.preventDefault(); setModalShow(true) }}>logged in</Link> to post a comment.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {showLoginModal && <LoginPopup showLoginModal={showLoginModal} setModalShow={setModalShow} />}
        </>
    )
}
