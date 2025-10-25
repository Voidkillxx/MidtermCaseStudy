import React, { useContext, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { calculateSellingPrice } from '../utils/PricingUtils';
import '../Styles/Checkout.css';

const Checkout = ({ showAlert, products = [], setProducts, handleResetFilters }) => {
  const { cartItems, selectedItems, selectedSubtotal, removeSelectedItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [showConfirmOrderModal, setShowConfirmOrderModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const validCartItems = Array.isArray(cartItems) ? cartItems : [];
  const validSelectedItems = Array.isArray(selectedItems) ? selectedItems : [];
  const itemsToCheckout = validCartItems.filter(item => validSelectedItems.includes(item.id));

  const subtotal = selectedSubtotal || 0;
  const shippingFee = 50.0;
  const total = subtotal + shippingFee;

  const handleShowConfirmOrderModal = () => setShowConfirmOrderModal(true);
  const handleCloseConfirmOrderModal = () => setShowConfirmOrderModal(false);

  const handleConfirmOrderPlacement = () => {
    if (!Array.isArray(itemsToCheckout) || itemsToCheckout.length === 0) {
      if (showAlert) showAlert('No items to checkout.', 'warning');
      return;
    }

    let stockSufficient = true;
    const updatedProducts = products.map(prod => {
      const ordered = itemsToCheckout.find(item => item.id === prod.id);
      if (ordered) {
        const availableStock = parseInt(prod.stock) || 0;
        const orderedQty = parseInt(ordered.quantity) || 0;

        if (orderedQty > availableStock) {
          stockSufficient = false;
          if (showAlert) showAlert(`Not enough stock for ${prod.name}. Only ${availableStock} left.`, 'danger');
        }

        return { ...prod, stock: Math.max(availableStock - orderedQty, 0) };
      }
      return prod;
    });

    if (!stockSufficient) {
      handleCloseConfirmOrderModal();
      return;
    }

    if (typeof setProducts === 'function') {
      setProducts(updatedProducts);
    }
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    setOrderDetails({
      items: itemsToCheckout,
      subtotal,
      shipping: shippingFee,
      total,
      paymentMethod
    });

    if (showAlert) showAlert('Order placed successfully!', 'success');
    removeSelectedItems();
    if (handleResetFilters) handleResetFilters(); // Call the reset function
    setOrderPlaced(true);
    handleCloseConfirmOrderModal();
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    let isFormValid = form.checkValidity();

    if (paymentMethod === 'cod') {
      const requiredFields = form.querySelectorAll('[required]:not([id^="cc-"])');
      isFormValid = true;
      requiredFields.forEach(field => {
        if (!field.checkValidity()) isFormValid = false;
      });
      const paymentMethodSelected = form.querySelector('input[name="paymentMethod"]:checked');
      if (!paymentMethodSelected) {
          isFormValid = false;
      }
    }

    setValidated(true);
    if (isFormValid) handleShowConfirmOrderModal();
  };

  const getEstimatedDelivery = () => {
    const today = new Date();
    const minDays = 3;
    const maxDays = 5;
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);
    const options = { month: 'short', day: 'numeric' };
    return `${minDate.toLocaleDateString('en-US', options)} - ${maxDate.toLocaleDateString('en-US', options)}`;
  };

  if (!orderPlaced && itemsToCheckout.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h2>No Items Selected for Checkout</h2>
        <p className="lead text-muted">Please go back to your cart and select the items you wish to purchase.</p>
        <Button variant="outline-primary" onClick={() => navigate('/cart')} className="mt-3">
          <i className="bi bi-arrow-left me-2"></i>Back to Cart
        </Button>
      </Container>
    );
  }

  if (orderPlaced && orderDetails) {
    return (
      <Container className="my-5 checkout-container">
        <div className="order-receipt">
          <h2 className="text-success mb-3">
            <i className="bi bi-check-circle-fill me-2"></i>Order Placed Successfully!
          </h2>
          <p>Thank you for your purchase.</p>
          <hr />
          <h5>Order Summary:</h5>
          <ListGroup variant="flush" className="mb-3 text-start bg-transparent">
            {orderDetails.items?.map(item => (
              <ListGroup.Item key={item.id} className="d-flex justify-content-between px-0 bg-transparent">
                <span>{item.name} (x{item.quantity})</span>
                <span>₱{(calculateSellingPrice(item.price, item.discount) * item.quantity).toFixed(2)}</span>
              </ListGroup.Item>
            ))}
            <ListGroup.Item className="d-flex justify-content-between px-0 bg-transparent">
              <span>Shipping</span>
              <span>₱{orderDetails.shipping.toFixed(2)}</span>
            </ListGroup.Item>
          </ListGroup>
          <div className="d-flex justify-content-between h5 mb-3">
            <strong>{orderDetails.paymentMethod === 'cod' ? 'Total to be Paid (COD):' : 'Total Paid (Card):'}</strong>
            <strong>₱{orderDetails.total.toFixed(2)}</strong>
          </div>
          <hr />
          <p className="mt-3">Estimated Delivery: <strong>{getEstimatedDelivery()}</strong></p>
          <Button variant="primary" onClick={() => navigate('/')} className="mt-3">
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container className="my-5 checkout-container">
        <h2 className="mb-4">Checkout</h2>
        <Row>
          <Col lg={7} className="mb-4 mb-lg-0">
            <h4 className="mb-3">Shipping & Payment</h4>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <h5 className="mb-3">Shipping Address</h5>
              <Row>
                <Form.Group as={Col} md="6" controlId="firstName" className="mb-3">
                  <Form.Label>First name</Form.Label>
                  <Form.Control required type="text" placeholder="Juan" />
                  <Form.Control.Feedback type="invalid">First name required.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="lastName" className="mb-3">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control required type="text" placeholder="Dela Cruz" />
                  <Form.Control.Feedback type="invalid">Last name required.</Form.Control.Feedback>
                </Form.Group>
              </Row>

              <Form.Group className="mb-3" controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control placeholder="1234 Main St, Brgy. Example" required />
                <Form.Control.Feedback type="invalid">Address required.</Form.Control.Feedback>
              </Form.Group>

              <Row>
                <Form.Group as={Col} md="6" controlId="city" className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" placeholder="Cabuyao" required />
                  <Form.Control.Feedback type="invalid">City required.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="zip" className="mb-3">
                  <Form.Label>Zip</Form.Label>
                  <Form.Control type="text" placeholder="4025" required pattern="[0-9]{4,5}" />
                  <Form.Control.Feedback type="invalid">Valid Zip code required.</Form.Control.Feedback>
                </Form.Group>
              </Row>

              <hr className="my-4" />

              <h5 className="mb-3">Payment Method</h5>
              <div className="mb-3">
                <Form.Check type="radio" id="paymentCard" name="paymentMethod" label="Pay with Card" value="card"
                  checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} required />
                <Form.Check type="radio" id="paymentCod" name="paymentMethod" label="Cash on Delivery (COD)" value="cod"
                  checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} required />
                 <Form.Control required type="radio" name="paymentMethod" checked={!!paymentMethod} style={{display: 'none'}}/>
                 <div className="invalid-feedback" style={{display: validated && !paymentMethod ? 'block' : 'none'}}>Please select a payment method.</div>
              </div>

              {paymentMethod === 'card' && (
                <>
                  <h5 className="mb-3">Card Details</h5>
                  <Form.Group className="mb-3" controlId="cc-name">
                    <Form.Label>Name on card</Form.Label>
                    <Form.Control type="text" required={paymentMethod === 'card'} />
                    <Form.Control.Feedback type="invalid">Name on card required.</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="cc-number">
                    <Form.Label>Credit card number</Form.Label>
                    <Form.Control type="text" required={paymentMethod === 'card'} pattern="\d{13,16}" />
                    <Form.Control.Feedback type="invalid">Valid Card number required.</Form.Control.Feedback>
                  </Form.Group>
                  <Row>
                    <Form.Group as={Col} md="4" controlId="cc-expiration" className="mb-3">
                      <Form.Label>Expiration</Form.Label>
                      <Form.Control type="text" placeholder="MM/YY" required={paymentMethod === 'card'}
                        pattern="(0[1-9]|1[0-2])\/?([0-9]{2})" />
                      <Form.Control.Feedback type="invalid">
                        Expiration date required (MM/YY).
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="cc-cvv" className="mb-3">
                      <Form.Label>CVV</Form.Label>
                      <Form.Control type="text" placeholder="123" required={paymentMethod === 'card'} pattern="\d{3,4}" />
                      <Form.Control.Feedback type="invalid">
                        Security code required (3-4 digits).
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                </>
              )}

              {paymentMethod === 'cod' && (
                <Alert variant="info" className="mt-3">
                  You will pay ₱{total.toFixed(2)} in cash upon delivery.
                </Alert>
              )}

              <Button variant="success" size="lg" type="submit" className="w-100 mt-4">
                Place Order
              </Button>
            </Form>
          </Col>

          <Col lg={5}>
            <Card className="checkout-summary-card">
              <Card.Header as="h5">
                Order Summary ({validSelectedItems.length} item{validSelectedItems.length !== 1 ? 's' : ''})
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {itemsToCheckout.map(item => {
                    const sellingPrice = calculateSellingPrice(item.price, item.discount);
                    const validQuantity = parseInt(item.quantity) || 0;
                    return (
                      <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center px-0 py-2">
                        <img src={item.imageUrl || '/img/placeholder.png'} alt={item.name} className="summary-item-image" />
                        <div className="summary-item-details">
                          {item.name} <br /> <small className="text-muted">Qty: {validQuantity}</small>
                        </div>
                        <span className="text-nowrap">₱{(sellingPrice * validQuantity).toFixed(2)}</span>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
                <hr />
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between text-muted">
                  <span>Shipping</span>
                  <span>₱{shippingFee.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between h5 mb-0">
                  <strong>Total</strong>
                  <strong>₱{total.toFixed(2)}</strong>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={showConfirmOrderModal} onHide={handleCloseConfirmOrderModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Your Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to place this order for {validSelectedItems.length} item(s) totaling ₱{total.toFixed(2)}? Payment method: {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmOrderModal}>Cancel</Button>
          <Button variant="success" onClick={handleConfirmOrderPlacement}>Confirm Order</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Checkout;