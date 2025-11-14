import React, { useState, useEffect } from 'react'

const ShopListing = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('default')

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await fetch('https://buzzinguniverse.com/backend/api/product-listing')
            const result = await response.json()
            setProducts(result.data.data)
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSort = (e) => {
        const value = e.target.value
        setSortBy(value)
        let sorted = [...products]
        
        switch(value) {
            case 'price-low':
                sorted.sort((a, b) => parseFloat(a.discount_price) - parseFloat(b.discount_price))
                break
            case 'price-high':
                sorted.sort((a, b) => parseFloat(b.discount_price) - parseFloat(a.discount_price))
                break
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name))
                break
            default:
                break
        }
        setProducts(sorted)
    }

    if (loading) return <div className="text-center p-4">Loading...</div>

    return (
        <section className="shop-sec">
            <div className="container">
                <div className="row">
                    <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                        <div className="shop-txt-top-main">
                            <div className="shop-txt-top">
                                <p>Showing all {products.length} results</p>
                            </div>
                            <div className="shop-opt-top">
                                <select name="sorting-slec" id="sorting-slec" value={sortBy} onChange={handleSort}>
                                    <option value="default">Default sorting</option>
                                    <option value="name">Sort by name</option>
                                    <option value="price-low">Sort by price: low to high</option>
                                    <option value="price-high">Sort by price: high to low</option>
                                </select>
                                <div className="shop-opt-icon">
                                    <i className="fas fa-angle-down" />
                                </div>
                            </div>
                        </div>
                        <div className="shop-card-box">
                            <div className="row">
                                {products.map((product, index) => (
                                    <div key={product.id || index} className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 p-0">
                                        <div className="shop-card-main shop-card-bottom-border shop-card-right-border shop-card-top-border">
                                            <div className="shop-card-img">
                                                <a href={`/store/${product.sku}`}>
                                                    <img src={product.photo ? `https://buzzinguniverse.com/backend/assets/images/${product.photo}` : "images/free-gallery-icon-bu.png"} alt={product.name} />
                                                </a>
                                            </div>
                                            <div className="shop-card-txt">
                                                <a href={`/store/${product.sku}`}>
                                                    <h5>{product.name}</h5>
                                                </a>
                                                <p className="text-muted small mb-0">{product.sort_details?.length > 50 ? product.sort_details.substring(0, 50) + '...' : product.sort_details}</p>
                                                <div className="shop-price">
                                                    <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                                                    </span>
                                                    {product.previous_price && parseFloat(product.previous_price) > parseFloat(product.discount_price) && (
                                                        <h6 className="shop-price-ex">${product.previous_price}</h6>
                                                    )}
                                                    <h6>${product.discount_price}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ShopListing
