import React, { useState, useEffect } from 'react'
import { useUserContext } from '../../context/UserContext'
import secureLocalStorage from 'react-secure-storage'
import axios from 'axios'

const Checkout = () => {
    const { auth_data } = useUserContext()
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        companyname: '',
        country: '',
        add1: '',
        add2: '',
        town: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
        notes: '',
        coupon: ''
    })
    const ls = secureLocalStorage;

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCartItems(cart)
        const userData = ls.getItem('auth_data') || auth_data
        if (userData) {
            setFormData(prev => ({
                ...prev,
                fname: userData.name?.split(' ')[0] || '',
                lname: userData.name?.split(' ')[1] || '',
                email: userData.email || ''
            }))
        }
    }, [])

    const getTotal = () => {
        return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2)
    }

    const validateForm = (formDataObj) => {
        const newErrors = {}
        
        if (!formDataObj.fname?.trim()) newErrors.fname = 'First name is required'
        if (!formDataObj.lname?.trim()) newErrors.lname = 'Last name is required'
        if (!formDataObj.country?.trim()) newErrors.country = 'Country is required'
        if (!formDataObj.add1?.trim()) newErrors.add1 = 'Street address is required'
        if (!formDataObj.town?.trim()) newErrors.town = 'City is required'
        if (!formDataObj.state?.trim()) newErrors.state = 'State is required'
        if (!formDataObj.zip?.trim()) newErrors.zip = 'ZIP code is required'
        if (!formDataObj.phone?.trim()) newErrors.phone = 'Phone number is required'
        if (!formDataObj.email?.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formDataObj.email)) {
            newErrors.email = 'Email is invalid'
        }
        
        return newErrors
    }

    const handleCheckout = async (e) => {
        e.preventDefault()
        setErrors({})
        
        const formElements = document.querySelectorAll('input, textarea')
        const formDataObj = {}
        
        formElements.forEach(element => {
            if (element.name) {
                formDataObj[element.name] = element.value
            }
        })
        
        const validationErrors = validateForm(formDataObj)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }
        
        setLoading(true)
        try {
            const userData = JSON.parse(ls.getItem('auth_data')) || auth_data
            
            const checkoutData = {
                name: userData?.fname,
                email: userData?.email,
                response: {
                    ...formDataObj,
                    items: cartItems,
                    total: getTotal(),
                    timestamp: new Date().toISOString()
                }
            }

            const response = await axios.post('https://buzzinguniverse.com/backend/api/product-inquiry', checkoutData)
            
            if (response.status === 200) {
                localStorage.removeItem('cart')
                alert('Order submitted successfully!')
                window.location.href = '/store'
            }
        } catch (error) {
            console.error('Checkout error:', error)
            alert('Error submitting order')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <style>{`
                .error {
                    border: 1px solid #dc3545 !important;
                    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
                }
                .error-message {
                    color: #dc3545;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    display: block;
                }
            `}</style>
            <section className="checkout_page inner-bg">
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                        <div className="billing-top-main">
                            <div className="billing-top-txt">
                                <i className="fas fa-window-maximize" aria-hidden="true" />
                                Have a coupon? Click here to enter your code
                            </div>
                            <div className="billing-top">
                                <h5>If you have a coupon code, please apply it below.</h5>
                                <div className="billing-top-input-btn">
                                    <div className="billing-top-input">
                                        <input type="text" name="coupon" id="coupon" placeholder="Coupon code" />
                                    </div>
                                    <div className="billing-top-btn">
                                        <a href="#"> Apply coupon </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="billing_form">
                            <div className="billing_form_heading">
                                <h3>Billing Details</h3>
                            </div>
                            <form>
                                <div className="row">
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <label>First Name*</label>
                                        <input type="text" name="fname" className={errors.fname ? 'error' : ''} />
                                        {errors.fname && <div className="error-message">{errors.fname}</div>}
                                    </div>
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <label>Last Name*</label>
                                        <input type="text" name="lname" className={errors.lname ? 'error' : ''} />
                                        {errors.lname && <div className="error-message">{errors.lname}</div>}
                                    </div>
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <label>Company Name (Optional)</label>
                                        <input type="text" name="companyname" />
                                    </div>
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <label>Country / Region *</label>
                                        <input type="text" name="country" placeholder="United States" className={errors.country ? 'error' : ''} />
                                        {errors.country && <div className="error-message">{errors.country}</div>}
                                    </div>
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <label>Street Address*</label>
                                        <input type="text" name="add1" placeholder="House Number and Street Name" className={errors.add1 ? 'error' : ''} />
                                        {errors.add1 && <div className="error-message">{errors.add1}</div>}
                                        <input type="text" name="add2" placeholder="Apartment,suite,unit,etc.(optional)" />
                                    </div>
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <label>Town / City *</label>
                                        <input type="text" name="town" className={errors.town ? 'error' : ''} />
                                        {errors.town && <div className="error-message">{errors.town}</div>}
                                    </div>
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <label>State / County *</label>
                                        <input type="text" name="state" className={errors.state ? 'error' : ''} />
                                        {errors.state && <div className="error-message">{errors.state}</div>}
                                    </div>
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <label>Postcode / ZIP *</label>
                                        <input type="text" name="zip" className={errors.zip ? 'error' : ''} />
                                        {errors.zip && <div className="error-message">{errors.zip}</div>}
                                    </div>
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <label>Phone*</label>
                                        <input type="tel" name="phone" className={errors.phone ? 'error' : ''} />
                                        {errors.phone && <div className="error-message">{errors.phone}</div>}
                                    </div>
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <label>Email Address*</label>
                                        <input type="email" name="email" className={errors.email ? 'error' : ''} />
                                        {errors.email && <div className="error-message">{errors.email}</div>}
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="billing-bottom-main">
                            <div className="billing-bottom-add">
                                <div className="billing-bottom-add-heaidng">
                                    <h5>Additional information</h5>
                                </div>
                                <div className="billing-bottom-add-txt">
                                    <h5>Order notes (optional)</h5>
                                    <textarea name="user-note" id="user-note" placeholder="Notes about your order, e.g. special notes for delivery." defaultValue={""} />
                                </div>
                            </div>
                            <div className="billing-bottom-order-main">
                                <div className="billing-bottom-order">
                                    <div className="billing-bottom-order-heading">
                                        <h5>Your order</h5>
                                    </div>
                                    <div className="billing-bottom-order-txt-main">
                                        <div className="billing-bottom-order-txt billing-bottom-order-ex">
                                            <h5>Product</h5>
                                            <h5>Subtotal</h5>
                                        </div>
                                        {cartItems.map(item => (
                                            <div key={item.sku} className="billing-bottom-order-txt">
                                                <h5>{item.name} × {item.quantity}</h5>
                                                <h5>${(parseFloat(item.price) * item.quantity).toFixed(2)}</h5>
                                            </div>
                                        ))}
                                        <div className="billing-bottom-order-txt">
                                            <h5>Subtotal</h5>
                                            <h5>${getTotal()}</h5>
                                        </div>
                                        <div className="billing-bottom-order-txt">
                                            <h5>Total</h5>
                                            <h5>${getTotal()}</h5>
                                        </div>
                                    </div>
                                    <div className="billing-bottom-order-box-main">
                                        <div className="billing-bottom-order-box">
                                            <i className="fas fa-window-maximize" aria-hidden="true" />
                                            <p>
                                                Sorry, it seems that there are no available payment methods. Please contact us if you require assistance or wish to make alternate arrangements.
                                            </p>
                                        </div>
                                        <div className="billing-bottom-order-box-btn">
                                            <button type="button" onClick={handleCheckout} disabled={loading}>
                                                {loading ? 'Processing...' : 'Place order'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </section>
        </>
    )
}

export default Checkout