import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import '../Styles/ProductDetails.css';
import { calculateSellingPrice } from '../utils/PricingUtils';

const ProductDetails = ({ products, onAddToCart }) => {
  const { productId } = useParams();
  const product = (products || []).find(p => p.id === parseInt(productId));

  if (!product) {
    return (
      <Container className="text-center my-5">
        <h2>Product not found!</h2>
        <Link to="/products" className="product-details-back-link">
          ← Back to All Products
        </Link>
      </Container>
    );
  }

 const hasDiscount = product.discount && product.discount > 0;
  const sellingPrice = calculateSellingPrice(product.price, product.discount);

  return (
    <Container className="product-details-container my-5">
      <Row className="align-items-center">
        <Col md={6} className="text-center">
          <Image 
            src={product.imageUrl || '/img/placeholder.png'} 
            alt={product.name} 
            className="product-details-image" 
            fluid 
          />
        </Col>
        <Col md={6} className="product-details-info">
          <h1 className="product-details-title">{product.name}</h1>
          
          <div className="product-details-price-section">
            {hasDiscount ? (
              <>
                <p className="product-details-price">₱{sellingPrice.toFixed(2)}</p>
                <p className="product-details-original-price">₱{product.price.toFixed(2)}</p>
                <span className="product-details-discount-badge">
                  Save {product.discount}%!
                </span>
              </>
            ) : (
              <p className="product-details-price">₱{product.price.toFixed(2)}</p>
            )}
          </div>

          <p className="product-details-description">{product.description}</p>
          
          <Button 
            variant="success" 
            size="lg" 
            className="product-details-button"
            onClick={() => onAddToCart(product)} // Call App.js handler
          >
            <i className="bi bi-cart-plus me-2"></i>
            Add to Cart
          </Button>

          <div className="mt-4">
            <Link to="/products" className="product-details-back-link">
              ← Back to All Products
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;

