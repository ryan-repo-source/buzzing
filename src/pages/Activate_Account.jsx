import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

const Activate_Account = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your account...');

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                const response = await axios.get(`https://buzzinguniverse.com/backend/api/activate-account/`, {
                    params: { token }
                });
                if (response.status === 200) {
                    setStatus('success');
                    setMessage('Your account has been successfully activated.');
                    secureLocalStorage.setItem('auth_data', JSON.stringify(response.data.attributes));
                    setTimeout(() => {
                        window.location.replace('/activity');
                    }, 2000);
                } else {
                    setStatus('error');
                    setMessage('Invalid activation token.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Activation failed. Token may be invalid or expired.');
            }
        };

        verifyAccount();
    }, [token]);

    const containerStyle = {
        minHeight: '84vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    };

    const cardStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '48px 40px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        maxWidth: '500px',
        width: '100%',
        margin: '0 20px',
        textAlign: 'center',
        border: '1px solid #e2e8f0'
    };

    const titleStyle = {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a202c',
        marginBottom: '24px',
        lineHeight: '1.3'
    };

    const iconStyle = {
        fontSize: '48px',
        marginBottom: '20px',
        display: 'block'
    };

    const messageStyle = {
        fontSize: '16px',
        lineHeight: '1.6',
        marginBottom: '24px',
        fontWeight: '400'
    };

    const loadingStyle = {
        ...messageStyle,
        color: '#4a5568'
    };

    const successStyle = {
        ...messageStyle,
        color: '#38a169'
    };

    const errorStyle = {
        ...messageStyle,
        color: '#e53e3e'
    };

    const spinnerStyle = {
        width: '24px',
        height: '24px',
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #4299e1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px',
        display: status === 'verifying' ? 'block' : 'none'
    };

    const redirectMessageStyle = {
        fontSize: '14px',
        color: '#718096',
        fontStyle: 'italic',
        marginTop: '16px'
    };

    return (
        <>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            <div style={containerStyle}>
                <div style={cardStyle}>
                    <h1 style={titleStyle}>Account Activation</h1>
                    
                    <div style={spinnerStyle}></div>
                    
                    <p style={
                        status === 'verifying' ? loadingStyle :
                        status === 'success' ? successStyle :
                        errorStyle
                    }>
                        {message}
                    </p>
                    
                    {status === 'success' && (
                        <p style={redirectMessageStyle}>
                            Redirecting you to your dashboard...
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Activate_Account;