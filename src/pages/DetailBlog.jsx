import React from 'react'
import { Link } from 'react-router-dom'

export default function DetailBlog() {
    return (
        <div>
            <header>
                <div className="topSec">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-12">
                                <Link to="index.html"> <img src="images/footer-logo.png" alt="img" /> </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>


            <section>
                <div className="brand-and-attracting-customers-sec blog-detai">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-12">
                                <div className="brand-and-att-cust-main-heading">
                                    <h2>5 Desserts Your Guests Will Love at a Holiday Dinner</h2>
                                    <span><i className="fas fa-calendar-alt" /> December 23, 2023</span>
                                </div>
                            </div>
                        </div>
                        <div className="brand-and-attracting-customers-row">
                            <div className="row">
                                <div className="col-lg-8 col-md-8 col-12">
                                    <div className="brand-and-attracting-customers-images">
                                        <img src="images/blog-detail-1.jpg" alt="img" />
                                        <ul className="brand-and-attracting-customers-socail">
                                            <li><Link to="#"><i className="fab fa-twitter" /> Twitter</Link></li>
                                            <li className="linkedin"><Link to="#"><i className="fab fa-invision" /> LinkedIn</Link></li>
                                            <li className="reddit"><Link to="#"><i className="fab fa-reddit" />Reddit </Link></li>
                                        </ul>
                                        <p>Everyone loves desserts! In fact, desserts are part of the delight of holiday meals. So, what are some desserts you can serve to add that extra bit of sweetness to your holiday dinner? We’ll cut into it in a bit.</p>
                                        <p>Whether it’s Thanksgiving, Christmas, Kwanza or a plain old romantic dinner for two, desserts help you transition from eating to lounging and enjoying camaraderie with your dinner table members. Take a look at 5 delicious desserts for your holiday dinner guests.</p>
                                        <h2>1.    Cakes</h2>
                                        <p>Nobody says No to cake. If they do, there’s a pretty good reason. Cakes are the beginning and end of patisserie sweetness. There are tons of cake recipes you can try. From fruitcake and Vanilla Chiffon Trifle to basic pound cakes or a batten burg cake, a sugar and butter base dough will always hit the right spots.</p>
                                        <h2>2. Cookies</h2>
                                        <img src="images/blog-detail-2.jpg" alt="img" />
                                        <p>You could also stick to the basics and dish out fondue with baked chocolate chip cookies if you have less time on your hands. Whatever you choose to serve, if it’s a cookie, your guests will eat it up – literally!</p>
                                        <h2>3.    Pies</h2>
                                        <p>If you want to take your family and friends down memory lane with a dinner they’ll never forget, whip up a mean batch of freshly baked pie!</p>
                                        <p>It could be Pecan Pie, apple pie or a Southern Millionaire pie with creamy and nutty toppings. You can also throw on some cherries or berries to create your unique pie. It’ll always please your dinner guests.</p>
                                        <h2>4. Ice-cream</h2>
                                        <img src="images/blog-detail-3.jpg" alt="img" />
                                        <p>A creamy people-pleaser! Ice cream is that dessert you have to struggle to refuse. It’s the easiest to make. You don’t have to whip it up yourself if you’re low on energy or time. Simply grab a bucket from the store and throw in a few toppings to create something different</p>
                                        <p>Nuts, berries, gummies, cherries, cookies, take your pick. All of these make for creamy and crunchy or juicy ice cream.</p>
                                        <h2>5.    Crème brûlée</h2>
                                        <p>This dessert will surely get you praise and compliments all day and all night. With a crusty caramel top and a creamy custard base, a crème brûlée is a French favorite, a delicious go-to holiday dessert. There you have it. Five holiday desserts to sweeten your dinner this year – in different categories. You’ll surely impress with any of these and have lots of fun making them.</p>
                                    </div>
                                    <div className="leave-reply-box">
                                        <h2>Leave a Reply</h2>
                                        <p>You must be <Link to="#">logged in</Link> to post a comment.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



        </div>
    )
}
