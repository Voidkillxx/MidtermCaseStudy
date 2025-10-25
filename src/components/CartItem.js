import React, { useContext } from 'react';
import { Row, Col, Image, Button, Form } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import '../Styles/CartItem.css'; 

const CartItem = ({ item }) => {
  const {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    selectedItems,
    toggleSelectItem
  } = useContext(CartContext);

  if (!item) {
      console.error("CartItem received undefined item prop");
      return null;
  }

  const isSelected = selectedItems.includes(item.id);

  // --- Handlers ---
  const handleRemove = () => {
      if (window.confirm(`Are you sure you want to remove ${item.name} from your cart?`)) {
        removeFromCart(item.id);
      }
  };

  const handleDecrease = () => {
      if (item.quantity === 1) {
          handleRemove();
      } else {
        decreaseQuantity(item.id);
      }
  };

  const handleIncrease = () => {
      const currentQuantity = item.quantity || 0;
      const stock = item.stock || 0;

      if (currentQuantity + 1 > stock) {
          alert(`Cannot add more than ${stock} units of ${item.name}.`);
          return;
      }

      increaseQuantity(item.id);
  };
  // ---------------------------------

  const price = item.price || 0;
  const quantity = item.quantity || 0;
  const discount = item.discount || 0;
  const sellingPrice = price * (1 - discount / 100);

  return (
    <Row className="align-items-center cart-item-row"> 
      {/* Checkbox Column */}
      <Col xs="auto" className="pe-0">
        <Form.Check
          type="checkbox"
          id={`select-item-${item.id}`}
          checked={isSelected}
          onChange={() => toggleSelectItem(item.id)}
          aria-label={`Select ${item.name}`}
        />
      </Col>

      {/* Image Column */}
      <Col xs={3} md={2}>
        <Image src={item.imageUrl || '/img/placeholder.png'} alt={item.name} fluid rounded />
      </Col>

      {/* Details Column */}
      <Col xs={4} md={3}>
        <h5 className="cart-item-name">{item.name}</h5> 
        <p className="cart-item-price-original">₱{sellingPrice.toFixed(2)}</p> 
      </Col>

      {/* Quantity Column */}
      <Col xs={3} md={3} className="d-flex align-items-center justify-content-center">
        <Button variant="outline-secondary" size="sm" onClick={handleDecrease}>-</Button>
        <span className="mx-2">{quantity}</span>
        <Button variant="outline-secondary" size="sm" onClick={handleIncrease}>+</Button>
      </Col>

      {/* Total & Remove Column */}
      <Col xs={12} md={3} className="text-md-end mt-2 mt-md-0">
        <strong className="cart-item-total">₱{(quantity * sellingPrice).toFixed(2)}</strong> 
        <Button variant="link" className="cart-item-remove-btn" onClick={handleRemove}>Remove</Button> 
      </Col>
    </Row>
  );
};

export default CartItem;
