import React, { useContext, useState } from 'react';
import { Navbar, Container, Nav, Form, FormControl, Badge } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import LogoutConfirmModal from './LogoutConfirmModal';
import '../Styles/Navbar.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

const AppNavbar = ({ currentUser, handleLogout, searchTerm, setSearchTerm, handleResetFilters, showAlert }) => {
  const { cartItems } = useContext(CartContext);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleShowLogoutModal = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = () => setShowLogoutModal(false);
  const handleConfirmLogout = () => { handleLogout(); handleCloseLogoutModal(); };

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartBadgeText = itemCount > 99 ? '99+' : itemCount;

  const handleCartClick = (event) => {
    if (!currentUser) {
      event.preventDefault();
      showAlert('Please log in to view the cart.', 'warning');
      navigate('/login');
    }
  };

  const handleLogoClick = () => {
    handleResetFilters();
    navigate(isAdminRoute ? '/admin' : '/');
  };

  return (
    <>
      <Navbar expand="lg" className="navbar-custom">
        <Container fluid>
          <Navbar.Brand as="div" onClick={handleLogoClick} className="navbar-logo-wrapper"> 
            <img
              src="/img/logo.png"
              alt="Grocery Store Logo"
              className="navbar-logo"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">

            {/* Nav Links */}
            {!isAdminRoute && (
              <Nav className="me-auto nav-links-custom">
                <Nav.Link as={Link} to="/" onClick={handleResetFilters}>Home</Nav.Link>
                <Nav.Link as={Link} to="/products" onClick={handleResetFilters}>Products</Nav.Link>
              </Nav>
            )}
            {isAdminRoute && <Nav className="me-auto"></Nav>}

            {/* Search Bar */}
            {!isAdminRoute && (
              <Form className="d-flex search-bar-custom" onSubmit={(e) => e.preventDefault()}>
                <FormControl
                  type="search"
                  placeholder="Search..."
                  className="me-2"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form>
            )}

            {/* Right Side Nav */}
            <Nav>
              {currentUser ? (
                <>
                  <Nav.Link onClick={handleShowLogoutModal} className="logout-button">
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link as={Link} to="/login" className="login-button-custom">
                  Login
                </Nav.Link>
              )}

              {/* Cart Icon (Hide for Admin) */}
              {!isAdminRoute && (!currentUser || currentUser.role !== 'admin') && (
                <Nav.Link
                  as={Link}
                  to="/cart"
                  className="cart-icon-link"
                  onClick={handleCartClick}
                >
                  <i className="bi bi-cart"></i>
                  {itemCount > 0 && (
                    <Badge pill bg="danger" className="cart-badge">
                      {cartBadgeText}
                    </Badge>
                  )}
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Logout Modal */}
      <LogoutConfirmModal
        show={showLogoutModal}
        handleClose={handleCloseLogoutModal}
        handleConfirmLogout={handleConfirmLogout}
      />
    </>
  );
};

export default AppNavbar;
