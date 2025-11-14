import axios from 'axios';
import React, { useState } from 'react';
import secureLocalStorage from 'react-secure-storage';

const LoginPopup = ({ showLoginModal, setModalShow }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [progress, setProgress] = useState(0); // Progress starts at 0

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const Submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setProgress(20);

        try {
            const response = await axios.post('https://buzzinguniverse.com/backend/api/user-login', {
                email: formData.email,
                password: formData.password,
            });

            setProgress(60);

            if (response.data.code === "200") {
                secureLocalStorage.setItem('auth_data', JSON.stringify(response.data.data));
                setProgress(80);

                setTimeout(() => {
                    setProgress(100);
                    window.location.replace(`/member/${response.data.data.id}/profile`);
                }, 1000);
            } else {
                setFeedback({ type: 'error', message: response.data.message });
                setProgress(100);
            }
        } catch (error) {
            setFeedback({ type: 'error', message: 'Login failed. Please check your details and try again.' });
            setProgress(100);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`modal ${showLoginModal && 'd-block'}`} id="modal">
            <div className="modal-content">
                <button className="close-btn-lg p-0 bg-light" onClick={() => setModalShow(false)}>×</button>
                <div className="modal_logo">
                    <img src="images/welcome-every-one-img.png" alt="Logo" style={{ width: 50 }} />
                </div>
                <div className='d-flex gap-2'>
                    <progress value={progress} max={100} style={{ width: '100%' }} />
                    <span className='perct-shw'>{progress}%</span>
                </div>
                <input type="text" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
                <input type="password" placeholder="Blue key" name="password" value={formData.password} onChange={handleChange} />
                <div className="modal_rem">
                    <div className="d-flex">
                        <input type="checkbox" />
                        <p> Remember</p>
                    </div>
                    <a href="#">Lost blue key?</a>
                </div>
                <button type="submit" onClick={Submit}>{loading ? "Logging..." : "Login"}</button>

                {/* Display feedback if login fails */}
                {feedback.message && <p className={`feedback ${feedback.type}`}>{feedback.message}</p>}
            </div>
        </div>
    );
};

export default LoginPopup;
