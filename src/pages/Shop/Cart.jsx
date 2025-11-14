import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Cart = () => {
    const [cartItems, setCartItems] = useState([])

    useEffect(() => {
        loadCart()
    }, [])

    const loadCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCartItems(cart)
    }

    const updateQuantity = (sku, newQuantity) => {
        if (newQuantity <= 0) return
        const updatedCart = cartItems.map(item => 
            item.sku === sku ? { ...item, quantity: newQuantity } : item
        )
        setCartItems(updatedCart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
    }

    const removeItem = (sku) => {
        const updatedCart = cartItems.filter(item => item.sku !== sku)
        setCartItems(updatedCart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
    }

    const getTotal = () => {
        return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2)
    }

    return (
        <section className="shopping_cart inner-bg">
            <div className="container">
                <div className="row">
                    <div className="col-lg-9 col-md-9 col-sm-12 col-12">
                        <div className="shopping_cart_table">
                            <h2>Shopping Cart</h2>
                            <div className="table-responsive">
                                <table className="w-100">
                                    <thead>
                                        <tr>
                                            <th className="w-10" />
                                            <th className="w-20">Product</th>
                                            <th className="w-25">Price</th>
                                            <th className="w-20">Quantity</th>
                                            <th className="w-25">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center">Your cart is empty</td>
                                            </tr>
                                        ) : (
                                            cartItems.map(item => (
                                                <tr key={item.sku}>
                                                    <td>
                                                        <a href="javascript:void(0)" onClick={() => removeItem(item.sku)}>
                                                            <i className="fas fa-times" aria-hidden="true" />
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <div className="cart_box_product">
                                                            <div className="cart_product_img">
                                                                <img src={item.image ? `https://buzzinguniverse.com/backend/assets/images/${item.image}` : "images/free-gallery-icon-bu.png"} />
                                                            </div>
                                                            <div className="cart_product_name">
                                                                <h5>{item.name}</h5>
                                                                <p>SKU: {item.sku}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cart_product_name-ex">
                                                            <h5>${item.price}</h5>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="quanity product-detail cart-pag-qunty">
                                                            <div className="num-block skin-2">
                                                                <div className="num-in">
                                                                    <span className="minus" onClick={() => updateQuantity(item.sku, item.quantity - 1)} style={{cursor: 'pointer'}} />
                                                                    <input type="text" className="in-num" value={item.quantity} readOnly />
                                                                    <span className="plus" onClick={() => updateQuantity(item.sku, item.quantity + 1)} style={{cursor: 'pointer'}} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <p className="t_price">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="cart_recipt">
                                <div className="recipt-txt-btn">
                                    <div className="recipt-txt-main">
                                        <div className="recipt-heading">
                                            <h5>Cart totals</h5>
                                        </div>
                                        <div className="recipt-txt">
                                            <h5>Subtotal</h5>
                                            <h6>${getTotal()}</h6>
                                        </div>
                                        <div className="recipt-txt">
                                            <h5>Total</h5>
                                            <h6>${getTotal()}</h6>
                                        </div>
                                    </div>
                                    <div className="recipt-btn">
                                        <Link to="/checkout">
                                            Proceed to checkout
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Cart
