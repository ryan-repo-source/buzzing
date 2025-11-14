import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const ProductDetail = () => {
    const { sku } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        fetchProductDetail()
    }, [sku])

    const fetchProductDetail = async () => {
        try {
            const response = await fetch(`https://buzzinguniverse.com/backend/api/product-detail/${sku}`)
            const result = await response.json()
            setProduct(result.data)
        } catch (error) {
            console.error('Error fetching product:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleQuantityChange = (type) => {
        if (type === 'increase') {
            setQuantity(prev => prev + 1)
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }

    const addToCart = () => {
        const cartItem = {
            id: product.id,
            sku: product.sku,
            name: product.name,
            price: product.discount_price,
            image: product.photo,
            quantity: quantity,
            stock: product.stock
        }
        
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
        const existingItemIndex = existingCart.findIndex(item => item.sku === product.sku)
        
        if (existingItemIndex > -1) {
            existingCart[existingItemIndex].quantity += quantity
        } else {
            existingCart.push(cartItem)
        }
        
        localStorage.setItem('cart', JSON.stringify(existingCart))
        navigate('/cart')
    }

    if (loading) return <div className="text-center p-4">Loading...</div>
    if (!product) return <div className="text-center p-4">Product not found</div>

    return (
        <section className="shop-detail-sec">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                        <div className="shop-detail-img-main">
                            <div className="shop-detail-img">
                                <img src={product.photo ? `https://buzzinguniverse.com/backend/assets/images/${product.photo}` : "images/free-gallery-icon-bu.png"} alt={product.name} />
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                        <div className="shop-detail-txt-main">
                            <div className="shop-detail-heading">
                                <h4>{product.name}</h4>
                                <div className="d-flex align-items-center gap-2">
                                    {product.previous_price && parseFloat(product.previous_price) > parseFloat(product.discount_price) && (
                                        <h5 className="text-decoration-line-through text-muted">${product.previous_price}</h5>
                                    )}
                                    <h5>${product.discount_price}</h5>
                                </div>
                                <div className="mt-2">
                                    <span className="badge bg-info me-2">{product.sku}</span>
                                    <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </span>
                                </div>
                            </div>
                            <div className="shop-detail-txt">
                                <p>{product.sort_details}</p>
                            </div>
                            <div className="shop-detail-counter-btn">
                                <div className="shop-detail-counter product-detail">
                                    <ul className="quan-count">
                                        <li>
                                            <div className="num-block skin-2">
                                                <div className="num-in">
                                                    <span className="minus" onClick={() => handleQuantityChange('decrease')} style={{cursor: 'pointer'}} />
                                                    <input type="text" className="in-num" value={quantity} readOnly />
                                                    <span className="plus" onClick={() => handleQuantityChange('increase')} style={{cursor: 'pointer'}} />
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="shop-detail-btn">
                                                <button disabled={product.stock === 0} onClick={addToCart}> 
                                                    {product.stock > 0 ? 'Add to cart' : 'Out of stock'}
                                                </button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row shop-detail-space">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="shop-tab-txt-main">
                            <div className="shop-tab-txt">
                                <h5>Description</h5>
                                <div dangerouslySetInnerHTML={{ __html: product.details }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductDetail