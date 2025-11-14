import React, { useState } from 'react';
import { FaInfo, FaRegEye, FaSpinner } from 'react-icons/fa6';
import secureLocalStorage from "react-secure-storage";
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters long.';
    }
    if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters long.';
    }
    if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters long.';
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }
    return newErrors;
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
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'https://buzzinguniverse.com/backend/api/register-user',
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data.data.message === "Success") {
        setFeedback({ type: 'success', message: 'Registration complete! Please check your email to activate your account.'});
        // secureLocalStorage.setItem('auth_data', JSON.stringify(response.data.data.attributes));
        // setTimeout(function () {
        //   window.location.replace(`/member/${response.data.data.id}/profile`);
        // }, 1000)
        setFormData({ firstName: '', lastName: '', username: '', email: '', password: '' });
      } else {
        setFeedback({ type: 'error', message: 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Registration failed. Please check your details and try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="register-form-sec">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-12">
              <div className="register-form-box">
                <div className="register-form-heading text-center">
                  <h2>Create an Account</h2>
                  <p className="text-muted">Join us today and enjoy exclusive benefits.</p>
                </div>
                <div className="registering-definitelly mb-4">
                  <ul className="d-flex align-items-center">
                    <li><FaInfo className="me-2" /></li>
                    <li>
                      <p>Registering is easy. Just fill in the fields below, and we’ll make a new account for you in no time.</p>
                    </li>
                  </ul>
                </div>
                <div className="register-main-form">
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                      <label htmlFor="firstName" className="form-label">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                      />
                      <div className="invalid-feedback">{errors.firstName}</div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="lastName" className="form-label">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                      />
                      <div className="invalid-feedback">{errors.lastName}</div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">Username</label>
                      <input
                        type="text"
                        name="username"
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="johnny123"
                      />
                      <div className="invalid-feedback">{errors.username}</div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@mail.com"
                      />
                      <div className="invalid-feedback">{errors.email}</div>
                    </div>

                    <button
                      type="button"
                      onClick={generatePassword}
                    >
                      Generate Blue Key
                    </button>

                    <div className="password-box">
                      <label htmlFor="password" className="form-label">Choose a Password</label>
                      <div className="password">
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
                          style={{ cursor: 'pointer' }}
                        >
                          <FaRegEye />
                        </span>
                        <div className="invalid-feedback">{errors.password}</div>
                      </div>
                    </div>
                    <div className="Complete-sign-up-btn">
                      <button type="submit" disabled={loading}>
                        {loading ? <FaSpinner className="loading-spinner" /> : 'Complete Sign Up'}
                      </button>
                    </div>
                    {feedback.message && (
                      <div className={`mt-3 alert alert-${feedback.type === 'success' ? 'success' : 'danger'}`}>
                        {feedback.message}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
