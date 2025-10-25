import React, { useContext, useState } from 'react';
import { Container, Row, Col, Button, Card, Modal, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import RemoveItemModal from '../components/RemoveItemModal';
import CartItem from '../components/CartItem';
import '../Styles/Cart.css'; 

const Cart = ({ showAlert }) => {
  const {
    cartItems,
    selectedItems,
    selectedSubtotal,
    toggleSelectAll,
    clearCart,
    removeFromCart
  } = useContext(CartContext);
  const navigate = useNavigate();

  const [showClearModal, setShowClearModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

  // --- Modal Handlers (Remains the same) ---
  const handleShowClearModal = () => setShowClearModal(true);
  const handleCloseClearModal = () => setShowClearModal(false);
  const handleConfirmClear = () => { clearCart(); handleCloseClearModal(); };
  // const handleShowRemoveModal = (item) => { setItemToRemove(item); setShowRemoveModal(true); };
  const handleCloseRemoveModal = () => { setItemToRemove(null); setShowRemoveModal(false); };
  const handleConfirmRemove = (itemId) => { removeFromCart(itemId); handleCloseRemoveModal(); };
  // --- End Modal Handlers ---

  // --- Proceed to Checkout Handler (Remains the same) ---
  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
       if (showAlert) { showAlert('Please select at least one item to checkout.', 'warning'); }
       else { console.warn('Please select at least one item to checkout.'); }
    } else {
      navigate('/checkout');
    }
  };
  // --- End Proceed to Checkout Handler ---

  return (
    <>
      {/* Replaced cartContainerStyle with class */}
      <Container className="my-5 cart-container"> 
        {/* Replaced sectionTitleStyle with class */}
        <h2 className="cart-section-title">Shopping Cart</h2> 
        {/* Check cartItems length here */}
        {cartItems.length === 0 ? (
          <div className="text-center">
             <p>Your cart is empty.</p>
             <Button as={Link} to="/products" variant="primary">Continue Shopping</Button>
          </div>
        ) : (
          <Row>
            <Col lg={8}>
              {/* Select All Checkbox and Clear Cart Button */}
              <div className="d-flex align-items-center mb-3 border-bottom pb-2">
                 <Form.Check
                   type="checkbox"
                   id="select-all"
                   label={`Select All (${cartItems.length})`}
                   checked={isAllSelected}
                   onChange={toggleSelectAll}
                   className="me-auto fw-bold"
                 />
                 <Button variant="outline-danger" size="sm" onClick={handleShowClearModal}>
                   Clear Cart
                 </Button>
              </div>

              {/* Cart Items List - Map over cartItems */}
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}

            </Col>
            {/* Order Summary */}
            <Col lg={4}>
              {/* Replaced orderSummaryCardStyle with class */}
              <Card className="order-summary-card"> 
                <Card.Body>
                  <Card.Title>Order Summary</Card.Title>
                  <div className="d-flex justify-content-between my-2">
                    <span>Subtotal ({selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''})</span>
                    <strong>₱{selectedSubtotal.toFixed(2)}</strong>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between h5">
                    <strong>Total</strong>
                    <strong>₱{selectedSubtotal.toFixed(2)}</strong>
                  </div>
                  <Button variant="success" className="w-100 mt-3" onClick={handleProceedToCheckout} disabled={selectedItems.length === 0}>
                    Proceed to Checkout ({selectedItems.length})
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {/* Clear Cart Modal */}
      <Modal show={showClearModal} onHide={handleCloseClearModal} centered>
          <Modal.Header closeButton> <Modal.Title>Confirm Action</Modal.Title> </Modal.Header>
          <Modal.Body>Are you sure you want to remove all items from your cart?</Modal.Body>
          <Modal.Footer> <Button variant="secondary" onClick={handleCloseClearModal}> Cancel </Button> <Button variant="danger" onClick={handleConfirmClear}> Clear Cart </Button> </Modal.Footer>
      </Modal>

      {/* Remove Item Modal Component */}
      <RemoveItemModal
          show={showRemoveModal}
          handleClose={handleCloseRemoveModal}
          item={itemToRemove}
          handleConfirmRemove={handleConfirmRemove}
      />
    </>
  );
};

export default Cart;
