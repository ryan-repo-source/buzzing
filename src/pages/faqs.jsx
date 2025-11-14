import { FaGooglePlusG, FaPinterestP,  FaXTwitter } from 'react-icons/fa6'
import { TiSocialLinkedin } from 'react-icons/ti'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import StickyHeader from '../components/stickyHeader'

export default function Faqs() {

    return (
        <div>
             
             {/* <StickyHeader /> */}

            <div className="frequently-asked-questions">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                            <div className="frequently-asked-questions-box">
                                <h2>Got Questions</h2>
                                <h3>Frequently Asked Questions</h3>
                                <p>Check out the Frequently Asked Questions (FAQs) section, where you’ll find comprehensive answers to common queries.</p>
                                <ul>
                                    <li><Link href="#"><FaXTwitter /> </Link></li>
                                    <li><Link href="#"><FaGooglePlusG /> </Link></li>
                                    <li><Link href="#"><FaPinterestP /> </Link></li>
                                    <li><Link href="#"><TiSocialLinkedin /></Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section>
                <div className="buzzing-universe-overview-sec">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 col-md-8 col-12">
                                <div className="buzzing-universe-overview-faqs-box">
                                    <h2>Buzzing Universe Overview</h2>
                                    <div className="faq-txt">
                                        <div className="accordion" id="accordionExample">
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="heading1">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="false" aria-controls="collapse1">
                                                        1. What is Buzzing Universe?
                                                    </button>
                                                </h2>
                                                <div id="collapse1" className="accordion-collapse collapse" aria-labelledby="heading1" data-bs-parent="#accordionExample" style={{}}>
                                                    <div className="accordion-body">
                                                        <p>Buzzing Universe is a dynamic social media platform designed to bring people together. The network provides a space for users to connect, share ideas, express themselves creatively, and engage with a diverse community of individuals.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="heading2">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                                                        2. What are the key Terms of Use for Buzzing Universe?
                                                    </button>
                                                </h2>
                                                <div id="collapse2" className="accordion-collapse collapse" aria-labelledby="heading2" data-bs-parent="#accordionExample" style={{}}>
                                                    <div className="accordion-body">
                                                        <p> The Terms of Use for Buzzing Universe outline the guidelines and rules users must adhere to while using the platform. These include respecting the rights and privacy of others, refraining from engaging in illegal or harmful activities, and complying with applicable laws and regulations.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="heading3">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
                                                        3. How can I ensure my privacy and data security on Buzzing Universe?
                                                    </button>
                                                </h2>
                                                <div id="collapse3" className="accordion-collapse collapse" aria-labelledby="heading3" data-bs-parent="#accordionExample" style={{}}>
                                                    <div className="accordion-body">
                                                        <p>We take your privacy and data security seriously. Buzzing Universe employs robust measures to protect your personal information. We encourage users to set strong passwords, enable two-factor authentication, and exercise caution when sharing sensitive information. Our Privacy Policy provides detailed information on data collection, storage, and usage practices.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="heading4">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="false" aria-controls="collapse4">
                                                        4. What content is allowed on Buzzing Universe?
                                                    </button>
                                                </h2>
                                                <div id="collapse4" className="accordion-collapse collapse" aria-labelledby="heading4" data-bs-parent="#accordionExample" style={{}}>
                                                    <div className="accordion-body">
                                                        <p>  Buzzing Universe promotes a safe and inclusive environment for all users. Users are encouraged to share respectful, lawful content that complies with our Community Guidelines. Any content that violates these guidelines, including hate speech, harassment, or explicit material, will be promptly removed.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="heading5">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5" aria-expanded="false" aria-controls="collapse5">
                                                        5. How can I report inappropriate or offensive content?
                                                    </button>
                                                </h2>
                                                <div id="collapse5" className="accordion-collapse collapse" aria-labelledby="heading5" data-bs-parent="#accordionExample" style={{}}>
                                                    <div className="accordion-body">
                                                        <p> If you encounter any content that violates our guidelines or any suspicious illegal activities, please report it immediately using our reporting tools. Our team will review the reported content and act appropriately to maintain a positive and secure community.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="heading6">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse6" aria-expanded="false" aria-controls="collapse6">
                                                        6. Can I use Buzzing Universe for commercial purposes?
                                                    </button>
                                                </h2>
                                                <div id="collapse6" className="accordion-collapse collapse" aria-labelledby="heading6" data-bs-parent="#accordionExample" style={{}}>
                                                    <div className="accordion-body">
                                                        <p>Buzzing Universe allows users to promote their products or services in accordance with our Terms of Use and advertising policies. However, spamming or engaging in deceptive practices is strictly prohibited. We encourage users to utilize designated advertising channels and engage in transparent and ethical marketing practices.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="heading7">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse7" aria-expanded="false" aria-controls="collapse17">
                                                        7. What are the age restrictions for using Buzzing Universe?
                                                    </button>
                                                </h2>
                                                <div id="collapse7" className="accordion-collapse collapse" aria-labelledby="heading7" data-bs-parent="#accordionExample" style={{}}>
                                                    <div className="accordion-body">
                                                        <p> Buzzing Universe requires users to be at least 13 years old to create an account to ensure a safe environment. Users under 18 should seek parental consent and supervision while using the platform.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="heading8">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse8" aria-expanded="false" aria-controls="collapse8">
                                                        8. How does Buzzing Universe handle intellectual property rights?
                                                    </button>
                                                </h2>
                                                <div id="collapse8" className="accordion-collapse collapse" aria-labelledby="heading8" data-bs-parent="#accordionExample" style={{}}>
                                                    <div className="accordion-body">
                                                        <p>  Respecting intellectual property rights is crucial for Buzzing Universe. Users are responsible for ensuring they have the necessary rights or permissions to share any content, including images, videos, or written materials. Unauthorized use of copyrighted material is strictly prohibited.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="heading9">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse9" aria-expanded="false" aria-controls="collapse9">
                                                        9. What happens if I violate the Terms of Use?
                                                    </button>
                                                </h2>
                                                <div id="collapse9" className="accordion-collapse collapse" aria-labelledby="heading9" data-bs-parent="#accordionExample" style={{}}>
                                                    <div className="accordion-body">
                                                        <p> In cases of non-compliance with the Terms of Use, Buzzing Universe reserves the right to take appropriate action, including issuing warnings, suspending or terminating accounts.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id="heading10">
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse10" aria-expanded="false" aria-controls="collapse10">
                                                        10. How can I contact Buzzing Universe for further assistance or inquiries?
                                                    </button>
                                                </h2>
                                                <div id="collapse10" className="accordion-collapse collapse" aria-labelledby="heading10" data-bs-parent="#accordionExample" style={{}}>
                                                    <div className="accordion-body">
                                                        <p> For any further questions, concerns, or assistance, please get in touch with our support team through the designated channels provided on the Buzzing Universe website. We are here to help and ensure your experience on our platform is enjoyable and fulfilling.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="buzzing-universe-overview-faqs-box">
                                        <h2>Getting Started</h2>
                                        <div className="faq-txt">
                                            <div className="accordion" id="accordionExample">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="heading11">
                                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse11" aria-expanded="false" aria-controls="collapse11">
                                                            How do I edit my profile?
                                                        </button>
                                                    </h2>
                                                    <div id="collapse11" className="accordion-collapse collapse" aria-labelledby="heading11" data-bs-parent="#accordionExample" style={{}}>
                                                        <div className="accordion-body">
                                                            <p>Click the profile icon at the top right corner to access the profile settings. A list of various activities will appear; scroll down and select “Settings.” Within the settings menu, click on the “Profile” option once again, and an interface will appear with options to view, edit, change the profile photo, and change the cover image. To edit your profile, click “Edit profile” and input your name, date of birth, sex, city, and country. Once you have confirmed your details, click on “Save changes.”</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="heading12">
                                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse12" aria-expanded="false" aria-controls="collapse12">
                                                            How can I post a topic?
                                                        </button>
                                                    </h2>
                                                    <div id="collapse12" className="accordion-collapse collapse" aria-labelledby="heading12" data-bs-parent="#accordionExample" style={{}}>
                                                        <div className="accordion-body">
                                                            <p> On the top left, under activities, photos, people, groups, and adverts, click on the forums icon. Click on any category name, and a new page will allow you to create a topic.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="heading13">
                                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse13" aria-expanded="false" aria-controls="collapse13">
                                                            How can I edit a topic when posted?
                                                        </button>
                                                    </h2>
                                                    <div id="collapse13" className="accordion-collapse collapse" aria-labelledby="heading13" data-bs-parent="#accordionExample" style={{}}>
                                                        <div className="accordion-body">
                                                            <p>Click the edit button and evaluate the blog post for grammar, spelling, clarity, structure, and consistency.</p>
                                                            <p>Click Submit, the topic will be polished and ready to engage readers.</p>
                                                            <p><strong>How to tag a topic properly</strong></p>
                                                            <p>Find relevant Content keywords: Determine the major themes, subjects, or keywords that appropriately reflect your topic. Tags will assist search engines and users in categorizing your topic.</p>
                                                            <p>Choose specific tags: Describe the material by including relevant tags, but don’t overdo it. Avoid confusing readers by using 5-10 tags on your topic.</p>
                                                            <p>Use niche-targeted long-tail keywords. Tags with these keywords can increase targeted topic visitors.</p>
                                                            <p>Content tags: Tags will be visible in the platform’s tag area. Use commas or other separators to make tags visible at the end of your topic.</p>
                                                            <p>Use Similar tags: Consider related tags for your blog content. Related tags give context and help readers find your content.</p>
                                                            <p>Before publishing, review your tags. Make sure they match your topic’s content. Capitalize proper nouns, hyphenate multi-word tags, and omit special characters and symbols to optimize tags.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="heading14">
                                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse14" aria-expanded="false" aria-controls="collapse14">
                                                            Can I delete a topic once it's posted?
                                                        </button>
                                                    </h2>
                                                    <div id="collapse14" className="accordion-collapse collapse" aria-labelledby="heading14" data-bs-parent="#accordionExample" style={{}}>
                                                        <div className="accordion-body">
                                                            <p>Once a topic has been posted, only the publisher can edit a post after publication. </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="heading15">
                                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse15" aria-expanded="false" aria-controls="collapse15">
                                                            What happens to a topic?
                                                        </button>
                                                    </h2>
                                                    <div id="collapse15" className="accordion-collapse collapse" aria-labelledby="heading15" data-bs-parent="#accordionExample" style={{}}>
                                                        <div className="accordion-body">
                                                            <p>Once a topic is published, the topic resonates with the online community and becomes archived.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="heading16">
                                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse16" aria-expanded="false" aria-controls="collapse16">
                                                            How can I join or create a group?
                                                        </button>
                                                    </h2>
                                                    <div id="collapse16" className="accordion-collapse collapse" aria-labelledby="heading16" data-bs-parent="#accordionExample" style={{}}>
                                                        <div className="accordion-body">
                                                            <p>On the top left, under activities, photos, people, groups, and adverts, click on the Groups icon. Click on any Existing Group as displayed or click create a new group link, and a new page with a group name and group description fields pops out. Fill in the details and press create a group, and continue.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="heading17">
                                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse17" aria-expanded="false" aria-controls="collapse17">
                                                            How can I invite other people to join a group?
                                                        </button>
                                                    </h2>
                                                    <div id="collapse17" className="accordion-collapse collapse" aria-labelledby="heading17" data-bs-parent="#accordionExample" style={{}}>
                                                        <div className="accordion-body">
                                                            <p>1.Go to your account page on Buzzing Universe and sign in.</p>
                                                            <p>2.Decide which technique of inviting guests you like best. Options on Buzzing Universe often include posting a unique referral link or linking up via various social media</p>
                                                            <p>3.If you have the option, personalize the invitation message. Adding a personal touch to a message makes it more engaging and increases the possibility of a response.</p>
                                                            <p>4.Note, if you want to send a referral link to someone, copy the URL and send it via email, a messaging app, or a social networking site.</p>
                                                            <p>5.Inspire your invitees to join by describing the many ways they can benefit from using Buzzing Universe, such as making friends worldwide, exchanging ideas, and learning about other cultures.</p>
                                                            <p>6.Keep an eye on the feedback and get back to anyone interested but hasn’t joined by answering any questions they might have or providing further information.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="buzzing-universe-overview-faqs-box">
                                            <h2>How To Be a Publisher</h2>
                                            <div className="faq-txt">
                                                <div className="accordion" id="accordionExample">
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header" id="heading18">
                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse18" aria-expanded="false" aria-controls="collapse11">
                                                                How to publish an article
                                                            </button>
                                                        </h2>
                                                        <div id="collapse18" className="accordion-collapse collapse" aria-labelledby="heading18" data-bs-parent="#accordionExample" style={{}}>
                                                            <div className="accordion-body">
                                                                <p>1.Create an account on Buzzing Universe.</p>
                                                                <p>2.Submit your articles for approval.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header" id="heading19">
                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse19" aria-expanded="false" aria-controls="collapse12">
                                                                How to get an article on homepage
                                                            </button>
                                                        </h2>
                                                        <div id="collapse19" className="accordion-collapse collapse" aria-labelledby="heading19" data-bs-parent="#accordionExample" style={{}}>
                                                            <div className="accordion-body">
                                                                <p>1.Subscribe to the Buzzing Universe independent publisher program. Fee: $25 per year, unlimited.</p>
                                                                <p>2.Hire an independent publisher to have your article approved for the homepage.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header" id="heading20">
                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse20" aria-expanded="false" aria-controls="collapse20">
                                                                Tips for increasing your chances of getting your articles published on the homepage
                                                            </button>
                                                        </h2>
                                                        <div id="collapse20" className="accordion-collapse collapse" aria-labelledby="heading20" data-bs-parent="#accordionExample" style={{}}>
                                                            <div className="accordion-body">
                                                                <p>.Write high-quality, informative articles that are relevant to Buzzing Universe’s audience.</p>
                                                                <p>.Make sure your articles are well-written and free of errors.</p>
                                                                <p>.Promote your articles on social media and other platforms to get people to read them.</p>
                                                                <p>.Engage with other users on Buzzing Universe by commenting on their articles and participating in discussions.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
