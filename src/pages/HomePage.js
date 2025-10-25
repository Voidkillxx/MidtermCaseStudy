import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import "../Styles/HomePage.css";

const HomePage = ({ categories, products, onAddToCart }) => {
  const featuredProducts = (products || []).slice(0, 8);

  return (
    <Container fluid className="home-container">
      <div className="home-hero">
        <div className="hero-content">
          <h2>FRESH GROCERIES ONLINE</h2>
          <Link to="/products">
            <button className="home-shop-btn">SHOP NOW</button>
          </Link>
        </div>
      </div>

      <section id="categories" className="category-section">
        <h2 className="home-section-title">Shop by Categories</h2>
        <div className="home-category-grid">
          {(categories || []).map((cat) => (
            <div className="home-category-card" key={cat.id}>
              <Link to={`/products?category=${cat.id}`}>
                <img src={cat.imageUrl || "/img/products/sample-basket.png"} alt={cat.name} />
                <h3>{cat.name}</h3>
                <p>Browse →</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="product-section">
        <h2 className="home-section-title">Featured Products</h2>
        <Container>
          <Row className="g-4">
            {featuredProducts.map((product) => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </Container>
  );
};
    
export default HomePage;