import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../Styles/CategoryCard.css'; 

const CategoryCard = ({ category }) => {
  return (
    <Card className="category-card">
      <Link to={`/products?category=${category.id}`} className="category-card-link">
        <Card.Img
          variant="top"
          src={category.imageUrl}
          alt={category.name}
          className="category-card-image"
        />
        <Card.Body className="category-card-body">
          <Card.Title className="category-card-title">{category.name}</Card.Title>
          <div className="category-card-browse">
            Browse →
          </div>
        </Card.Body>
      </Link>
    </Card> 
  );
};

export default CategoryCard;