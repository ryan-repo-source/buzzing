import React, { useState } from 'react';
import { FaInfo, FaRegEye } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';

const General = () => {
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
    const [formData, setFormData] = useState({
        currentPassword: '',
        email: auth.email,
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmWeakPassword, setConfirmWeakPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
        setSuccessMessage('');
        setErrorMessage('');
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const generatePassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setFormData({ ...formData, password });
        setErrors({ ...errors, password: '' });
        setConfirmWeakPassword(false);
    };

    const isWeakPassword = formData.password.length > 0 && formData.password.length < 8;

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required.';
        }

        if (!formData.password) {
            newErrors.password = 'New password is required.';
        } else if (formData.password.length < 8 && !confirmWeakPassword) {
            newErrors.password = 'Password is too weak.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const payload = {
                user_id: auth.id,
                current_password: formData.currentPassword,
                new_password: formData.password,
            };

            const response = await axios.post('https://buzzinguniverse.com/backend/api/reset-password-request', payload);
            setSuccessMessage('Password updated successfully.');
            setFormData({ ...formData, currentPassword: '', password: '' });
            setConfirmWeakPassword(false);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || 'Failed to update password.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='setting_wrap py-4'>
            <h4>Email & Blue Key</h4>
            <p className='mb-1'>Update your Blue Key.</p>

            <div className='register-main-form mt-0'>

                <div className="mb-3">
                    <label className="form-label">
                        Current Blue Key <span className="text-muted">(required to change current Blue Key)</span>
                    </label>
                    <input
                        type="password"
                        name="currentPassword"
                        className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                        value={formData.currentPassword}
                        onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.currentPassword}</div>
                    <Link to="#">Lost your Blue Key?</Link>
                </div>

                <div className="mb-3">
                    <label className="form-label">Account Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        disabled
                    />
                </div>

                <div className="sorry-activity-found activity-all-memeber" style={{ width: "85%" }}>
                    <ul>
                        <li><FaInfo /></li>
                        <li>
                            <p>Click on the "Generate Blue Key" button to change your Blue Key.</p>
                        </li>
                    </ul>
                </div>

                <button
                    type="button"
                    onClick={generatePassword}
                    className="btn btn-secondary mb-3"
                >
                    Generate Blue Key
                </button>

                <div className="password-box mb-3">
                    <label className="form-label">Add Your New Blue Key</label>
                    <div className="position-relative">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="vOID48s4as(m"
                        />
                        <span
                            className="toggle-icon"
                            onClick={togglePasswordVisibility}
                            style={{ cursor: 'pointer', top: '13px' }}
                        >
                            <FaRegEye />
                        </span>
                        <div className="invalid-feedback">{errors.password}</div>
                    </div>

                    {isWeakPassword && (
                        <div className="text-danger small mt-1">Very weak</div>
                    )}

                    {isWeakPassword && (
                        <div className="form-check mt-2">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="confirmWeakPassword"
                                checked={confirmWeakPassword}
                                onChange={() => setConfirmWeakPassword(!confirmWeakPassword)}
                            />
                            <label className="form-check-label" htmlFor="confirmWeakPassword">
                                Confirm use of weak Blue Key
                            </label>
                        </div>
                    )}
                </div>

                {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                )}
                {errorMessage && (
                    <div className="alert alert-danger">{errorMessage}</div>
                )}

                <div className="d-flex gap-2">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default General;
