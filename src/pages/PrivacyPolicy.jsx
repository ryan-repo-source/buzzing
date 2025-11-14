import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { FaGooglePlusG, FaPinterestP, FaXTwitter } from 'react-icons/fa6'
import { TiSocialLinkedin } from 'react-icons/ti'
import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
    return (
        <div className='bg-black'>
            {/* <Header /> */}

            <section>
                <div className="terms-of-services-sec">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-12">
                                <h2>Privacy Policy</h2>
                                <p>Buzzing Universe values your privacy and is committed to safeguarding your data. This Privacy Statement describes how we collect, use, disclose, and protect the information you provide using our social media platform, website, or mobile application. We encourage you to thoroughly read this Privacy Policy to understand how we handle your personal information.</p>
                                <p>Buzzing Universe is not intended for children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us, and we will take appropriate measures to remove the information.</p>
                                <p>Information We Collect</p>
                                <p>1.1 Personal Information:</p>
                                <p>When you create an account or use Buzzing Universe, we may collect certain personal information such as your name, email address, username, profile picture, and other information you voluntarily provide.</p>
                                <h3>1.2 Usage Information:</h3>
                                <p>We may collect information about your usage of Buzzing Universe, including your interactions, posts, comments, likes, and communications. This information may include your device, IP address, browser type, and operating system.</p>
                                <h3>1.3 Cookies and Tracking Technologies:</h3>
                                <p>We use cookies and similar monitoring technologies to enhance your experience on Buzzing Universe. These technologies collect information about your browsing activities, preferences, and other analytics data.</p>
                                <p>How We Use Your Information</p>
                                <p>2.1 Provide and Personalize Services</p>
                                <p>We use your personal information to provide a personalized experience on Buzzing Universe, including displaying relevant content, connecting you with other users, and improving our user services.</p>
                                <h3>2.2 Communication</h3>
                                <p>We may use your information to communicate with you about Buzzing Universe updates, announcements, promotions, and other relevant information. You can opt out of receiving certain communications at any time.</p>
                                <h3>2.3 Analytics and Improvement</h3>
                                <p>We analyze the data collected to understand user preferences, trends, and behavior. This helps us improve Buzzing Universe, enhance user experience, and develop new features.</p>
                                <h3>2.4 Legal Obligations</h3>
                                <p>We may use and disclose your information as required by law, regulation, or legal process or to protect our rights, privacy, safety, or property.</p>
                                <p>Information Sharing and Disclosure</p>
                                <p>3.1 Third-Party Service Providers</p>
                                <p>We may engage trusted third-party service providers to assist us in providing and improving Buzzing Universe. Confidentiality agreements bind these providers, and are only authorized to use your information as necessary to perform their services.</p>
                                <p>3.2 Consent</p>
                                <p>We may share your information with your consent. For example, when you connect with other users or share your content publicly.</p>
                                <h3>3.3 Aggregated or De-Identified Data</h3>
                                <p>We may share aggregated data for analytical purposes, marketing, research, or other legitimate purposes.</p>
                                <p>3.4 Legal Requirements</p>
                                <p>We may disclose your information if required by law, court order, or governmental authority.</p>
                                <p>Data Security We implement appropriate security measures to prevent your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>
                                <p>Your Choices</p>
                                <p>5.1 Account Settings</p>
                                <p>You can access and update your account information through the settings available on Buzzing Universe.</p>
                                <h3>5.2 Communication Preferences</h3>
                                <p>You have the option to manage your communication preferences and opt out of certain communications from Buzzing Universe.</p>
                                <h3>5.3 Cookies and Tracking Technologies</h3>
                                <p>You can manage your cookie preferences through your browser settings. However, disabling certain cookies may impact your user experience.</p>
                                <h3>Changes to this Privacy Policy</h3>
                                <p>This Privacy Statement may be updated periodically to reflect business practices or legal requirements changes. We will inform you of any important change via an email or a notice on our website.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer/>

        </div>
    )
}
