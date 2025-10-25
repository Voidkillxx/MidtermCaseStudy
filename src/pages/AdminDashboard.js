import React, { useState } from "react"; 
import "../Styles/AdminDashboard.css";
import Pagination from '../components/Pagination';
import DeleteProduct from './DeleteProduct';
import { useNavigate } from "react-router-dom";
import categories from '../data/Categories'; 
import { calculateSellingPrice } from '../utils/PricingUtils'; 

function AdminDashboard({ 
    products = [], 
    onDeleteProduct, 
    onEditProductClick, 
}) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const productsPerPage = 10;

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
        setCurrentPage(1);
    };

    const handleFilter = (categoryName) => {
        setFilterCategory(filterCategory === categoryName ? "" : categoryName);
        setCurrentPage(1);
    };

    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm);
        const getCategoryName = (product) => {
            return product.category 
                ? product.category 
                : categories[product.categoryId] || ''; 
        };
        const matchesCategory =
            filterCategory === "" || getCategoryName(p) === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // --- Delete modal handlers ---
    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = (productId) => {
        if (onDeleteProduct) onDeleteProduct(productId);
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    return (
        <div className="admin-dashboard">
            {/* Header with Title and Navigation Buttons */}
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <div className="dashboard-nav-buttons">
                    <button
                        onClick={() => navigate("/admin/add")}
                        className="dashboard-nav-btn"                 
                    >
                        Add Product
                    </button>
                </div>
            </div>
            
            {/* Filter by Category and Search Bar Row */}
            <div className="filter-search-row">
                <div className="filter-section">
                    <div className="filter-label">Filter by Category</div>
                    <div className="category-pills">
                        <button
                            className={`category-pill ${filterCategory === "" ? "active" : ""}`}
                            onClick={() => setFilterCategory("")}
                        >
                            All Categories
                        </button>
                        {/* Iterate over the VALUES (names) of the imported categories object */}
                        {Object.values(categories).map((name) => (
                            <button
                                key={name}
                                className={`category-pill ${filterCategory === name ? "active" : ""}`}
                                onClick={() => handleFilter(name)}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Products Table */}
            <div className="table-wrapper">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Discount</th>
                            <th>Selling Price</th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="empty-message">
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            currentProducts.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <img 
                                            src={p.imageUrl || '/img/placeholder.png'} 
                                            alt={p.name} 
                                            className="product-img" 
                                        />
                                    </td>
                                    <td>{p.name}</td>
                                    {/* Safely display category name */}
                                    <td>{p.category || categories[p.categoryId] || 'N/A'}</td> 
                                    <td>₱{p.price.toFixed(2)}</td>
                                    <td>{p.stock || 0}</td>
                                    <td>{p.discount || 0}%</td>
                                    {/* Uses imported utility function */}
                                    <td>₱{calculateSellingPrice(p.price, p.discount).toFixed(2)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="action-btn edit-icon"
                                                onClick={() => onEditProductClick(p.id)}
                                                title="Edit"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="action-btn delete-icon"
                                                onClick={() => handleDeleteClick(p)}
                                                title="Delete"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination 
                itemsPerPage={productsPerPage}
                totalItems={filteredProducts.length}
                currentPage={currentPage}
                paginate={paginate}
            />

            {/* Delete Product Modal */}
            <DeleteProduct 
                show={showDeleteModal} 
                handleClose={handleCloseDeleteModal} 
                product={productToDelete} 
                handleConfirmDelete={handleConfirmDelete} 
            />
        </div>
    );
}

export default AdminDashboard;
