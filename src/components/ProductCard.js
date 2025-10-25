import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../Styles/ProductCard.css';
import { calculateSellingPrice } from '../utils/PricingUtils'; // <<< NEW IMPORT

const ProductCard = ({ product, onAddToCart }) => {
  if (!product) {
    return null;
  }


  const hasDiscount = product.discount && product.discount > 0;
  const sellingPrice = calculateSellingPrice(product.price, product.discount); 

  return (
    <Card className="product-card shadow-sm h-100">
      <Link to={`/product/${product.id}`}>
        <Card.Img
          variant="top"
          src={product.imageUrl || '/img/placeholder.png'}
          alt={product.name}
          className="product-card-image"
        />
      </Link>
      <Card.Body className="d-flex flex-column text-center">
        <div className="flex-grow-1">
          <Card.Title className="product-card-title">
            <Link to={`/product/${product.id}`} className="product-card-link">
              {product.name}
            </Link>
          </Card.Title>
          
          {/* Price Display */}
          <div className="product-card-price-section">
            {hasDiscount ? (
              <>
                {/* Selling Price (After Discount) */}
                <div className="product-card-price">
                  ₱{sellingPrice.toFixed(2)}
                </div>
                {/* Original Price (Strikethrough) */}
                <div className="product-card-original-price">
                  ₱{product.price.toFixed(2)}
                </div>
                {/* Discount Badge */}
                <div className="product-card-discount-badge">
                  {product.discount}% OFF
                </div>
              </>
            ) : (
              // No discount - just show regular price
              <div className="product-card-price">
                ₱{product.price.toFixed(2)}
              </div>
            )}
          </div>
        </div>
        <Button
          variant="success"
          className="add-to-cart-button mt-auto"
          onClick={() => onAddToCart(product)}
        >
          Add to cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;