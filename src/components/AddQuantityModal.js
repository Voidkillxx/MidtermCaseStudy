import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { calculateSellingPrice } from '../utils/PricingUtils.js'; 

const AddQuantityModal = ({ show, handleClose, product, handleAdd }) => {
  const [quantity, setQuantity] = useState(1);

  const availableStock = product ? (parseInt(product.stock) || 0) : 0;

  useEffect(() => { if (show) { setQuantity(1); } }, [show]);

  const handleConfirmAdd = () => {
    if (quantity > availableStock) {
        alert(`Cannot add ${quantity}. Only ${availableStock} in stock.`);
        return;
    }
    handleAdd(product, quantity);
    handleClose();
  };

  const handleQuantityChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > availableStock) {
      value = availableStock;
    }
    setQuantity(value);
  };

  const handleIncrease = () => {
      setQuantity(prev => Math.min(availableStock, prev + 1));
  };

  const handleDecrease = () => {
      setQuantity(prev => Math.max(1, prev - 1));
  };

  if (!product) return null;

  // Uses imported utility function
  const pricePerItem = calculateSellingPrice(product.price, product.discount); 

  return (
    <Modal show={show} onHide={handleClose} centered size="sm">
      <Modal.Header closeButton> <Modal.Title>Add Quantity</Modal.Title> </Modal.Header>
      <Modal.Body>
        <p>How many {product.name} would you like to add?</p>
        <p className="text-muted small">Available Stock: {availableStock}</p>

        <InputGroup className="mb-3">
          <Button variant="outline-secondary" onClick={handleDecrease} disabled={quantity <= 1}>-</Button>
          <Form.Control
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            max={availableStock}
            className="text-center"
            aria-label="Quantity"
            isInvalid={quantity > availableStock}
          />
          <Button variant="outline-secondary" onClick={handleIncrease} disabled={quantity >= availableStock}>+</Button>
        </InputGroup>
        
        {quantity > availableStock && availableStock > 0 && (
            <Alert variant="warning" size="sm">Only {availableStock} item(s) in stock.</Alert>
        )}
        {availableStock <= 0 && (
             <Alert variant="danger" size="sm">This item is out of stock.</Alert>
        )}

        <p className="text-end fw-bold">Total: ₱{(pricePerItem * quantity).toFixed(2)}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}> Cancel </Button>
        <Button
          variant="success"
          onClick={handleConfirmAdd}
          disabled={availableStock <= 0 || quantity > availableStock || quantity < 1}
         >
          Add to Cart
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddQuantityModal;