import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import axios from 'axios';

export default function LostPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email.trim()) {
      setError('Please enter your email or username.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('https://buzzinguniverse.com/backend/api/reset-bluekey', {
        email,
      });

      if (res.data.status) {
        setMessage(res.data.message || 'New password has been sent to your email.');
        setEmail('');
      } else {
        setError(res.data.message || 'Something went wrong.');
      }
    } catch (err) {
      setError('Failed to send request. Please try again.');
    }

    setLoading(false);
  };

  return (
    <section>
      <div className="lost-password-sec">
        <Container>
          <Row>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="lost-password-box">
                <p>
                  Lost your blue key? Please enter your registered email address. You will receive
                  a link to create a new blue key via email.
                </p>
                <form onSubmit={handleSubmit}>
                  <label>Username or Email</label>
                  <input
                    type="text"
                    name="email"
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" disabled={loading}>
                    {loading ? 'Please wait...' : 'Get a new blue key'}
                  </button>
                </form>

                {message && <div className="alert alert-success mt-3">{message}</div>}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
              </div>
            </div>
          </Row>
        </Container>
      </div>
    </section>
  );
}
