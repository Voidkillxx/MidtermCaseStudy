import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Alert, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Context & Data
import { CartProvider, CartContext } from './context/CartContext';
import categoriesObject from './data/Categories'; 
import productsData from './data/products.json';
import usersData from './data/users.json';

// Components
import Navbar from './components/Navbar';
import AddQuantityModal from './components/AddQuantityModal';

// Pages
import HomePage from './pages/HomePage';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import LoginPage from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import EditProduct from './pages/EditProduct';
import AddProduct from './pages/AddProduct';
import Register from './pages/Register';

let alertTimeoutId = null;

function AppContent() {
  // FIX: Destructure ONLY the variables used in AppContent. 
  // Removed 'selectedItems' and 'removeSelectedItems'.
  const { cartItems, addToCart, clearCart, setUser } = useContext(CartContext);
  
  const [products, setProducts] = useState(() =>
    productsData.map(p => ({
      ...p,
      stock: parseInt(p.stock) || 0,
      categoryId: parseInt(p.categoryId)
    }))
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = ['/login', '/forgot', '/reset', '/register'].includes(location.pathname);

  // Users: Combine user data directly
  const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  const combinedUsers = [...usersData, ...storedUsers];
  

  // Categories: Convert the centralized object into the array format needed for rendering
  const categories = Object.keys(categoriesObject).map(id => ({
      id: parseInt(id), 
      name: categoriesObject[id],
      imageUrl: 
        categoriesObject[id] === 'Beverage' ? '/img/products/c2.png' :
        categoriesObject[id] === 'Dairy' ? '/img/products/Eden.png' :
        categoriesObject[id] === 'Snacks' ? '/img/products/Oishi.png' :
        categoriesObject[id] === 'Pastries' ? '/img/products/Pandesal.png' :
        '/img/products/default.png',
  }));

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddQtyModal, setShowAddQtyModal] = useState(false);
  const [productToAdd, setProductToAdd] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', variant: 'success' });

  // --- Alerts ---
  const showAlert = (message, variant = 'success', duration = 5000) => {
    if (alertTimeoutId) clearTimeout(alertTimeoutId);
    setAlertInfo({ show: true, message, variant });
    alertTimeoutId = setTimeout(() => {
      setAlertInfo({ show: false, message: '', variant: 'success' });
    }, duration);
  };

  // --- Login/Logout ---
  const handleLogin = (email, password) => {
    const user = combinedUsers.find(u => u.email === email && u.password === password);

    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      if (setUser) setUser(user.id); 
      showAlert(`Welcome back, ${user.email}!`, 'success');
      navigate(user.role === 'admin' ? '/admin' : '/');
    } else {
      showAlert('Invalid email or password.', 'danger');
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    clearCart();
    if (setUser) setUser(null); 
    showAlert('You have been logged out.', 'info');
    navigate('/');
  };

  // Corrected useEffect dependency array
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (savedUser) {
        setCurrentUser(savedUser);
        if (setUser) setUser(savedUser.id); 
    }
    return () => { if (alertTimeoutId) clearTimeout(alertTimeoutId); };
  }, [setUser]); 

  // --- Cart Logic ---
  const handleShowAddQuantityModal = (product) => {
    if (!currentUser) {
      showAlert('Please log in to add items to your cart.', 'warning');
      navigate('/login');
      return false;
    }
    const productInState = products.find(p => p.id === product.id);
    if (!productInState || productInState.stock <= 0) {
      showAlert(`${product.name} is out of stock.`, 'danger');
      return false;
    }
    setProductToAdd(productInState);
    setShowAddQtyModal(true);
    return true;
  };

  const handleCloseAddQuantityModal = () => {
    setProductToAdd(null);
    setShowAddQtyModal(false);
  };

  const handleConfirmAddToCart = (product, quantity) => {
    const productInState = products.find(p => p.id === product.id);
    const existingCartItem = cartItems.find(item => item.id === product.id);
    const currentQuantityInCart = existingCartItem ? parseInt(existingCartItem.quantity) || 0 : 0;
    const stock = parseInt(productInState?.stock) || 0;

    if (quantity + currentQuantityInCart > stock) {
      showAlert(`Cannot add ${quantity} x ${product.name}. Only ${stock - currentQuantityInCart} left.`, 'warning');
      return;
    }
    addToCart(product, quantity);
    showAlert(`${quantity} x ${product.name} added to cart!`, 'success');
  };

  // --- Filters ---
  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const filteredProducts = products
    .filter(p => !selectedCategory || Number(p.categoryId) === Number(selectedCategory))
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- Admin CRUD ---
  const handleAddProduct = (newProductData) => {
    const newProduct = {
      ...newProductData,
      id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
      price: parseFloat(newProductData.price) || 0,
      stock: parseInt(newProductData.stock) || 0,
      discount: parseInt(newProductData.discount) || 0,
      categoryId: parseInt(newProductData.categoryId)
    };
    setProducts(prev => [...prev, newProduct]);
    setSelectedCategory(null);
    showAlert("Product added successfully!", "success");
    navigate('/admin');
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
    showAlert("Product updated successfully!", "info");
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showAlert("Product deleted successfully.", "danger");
  };
  
  const handleEditProductClick = (id) => navigate(`/admin/edit/${id}`);


  return (
    <div className="App">
      {alertInfo.show && (
        <Alert
          variant={alertInfo.variant}
          onClose={() => setAlertInfo({ ...alertInfo, show: false })}
          dismissible
          className="app-alert position-fixed top-0 start-50 translate-middle-x mt-3 shadow"
          style={{ zIndex: 9999, width: 'auto', top: '70px' }}
        >
          {alertInfo.message}
        </Alert>
      )}

      {!isLoginPage && (
        <Navbar
          currentUser={currentUser}
          handleLogout={handleLogout}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleResetFilters={handleResetFilters}
          showAlert={showAlert}
        />
      )}

      <Container fluid className="main-content py-3">
        <Routes>
          <Route path="/" element={
            <HomePage
              products={filteredProducts}
              categories={categories}
              onAddToCart={handleShowAddQuantityModal}
              currentPage={currentPage}
              productsPerPage={8}
              setCurrentPage={setCurrentPage}
            />
          } />
          <Route path="/products" element={
            <ProductList
              products={filteredProducts}
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onAddToCart={handleShowAddQuantityModal}
              currentPage={currentPage}
              productsPerPage={8}
              setCurrentPage={setCurrentPage}
            />
          } />
          <Route path="/product/:productId" element={<ProductDetails products={products} onAddToCart={handleShowAddQuantityModal} />} />
          <Route path="/cart" element={<Cart showAlert={showAlert} />} />
          <Route
            path="/checkout"
            element={
              <Checkout
                showAlert={showAlert}
                products={products}
                setProducts={setProducts}
                handleResetFilters={handleResetFilters}
              />
            }
          />
          <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/admin" element={
            <AdminDashboard
              products={products}
              onDeleteProduct={handleDeleteProduct}
              onEditProductClick={handleEditProductClick}
            />
          } />
          <Route path="/admin/edit/:productId" element={<EditProduct products={products} handleEditProduct={handleEditProduct} showAlert={showAlert} />} />
          <Route path="/admin/add" element={<AddProduct onAddProduct={handleAddProduct} onCancel={() => navigate('/admin')} showAlert={showAlert} />} />
        </Routes>
      </Container>

      <AddQuantityModal
        show={showAddQtyModal}
        handleClose={handleCloseAddQuantityModal}
        product={productToAdd}
        handleAdd={handleConfirmAddToCart}
      />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;
