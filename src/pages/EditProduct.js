import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import categories from '../data/Categories'; 
import "../Styles/AddProduct.css"; 

// Utility to find category ID from name (used for initial state mapping)
const getCategoryIdFromName = (name) => {
    const entry = Object.entries(categories).find(([id, catName]) => catName === name);
    return entry ? parseInt(entry[0]) : '';
};


const EditProduct = ({ products = [], handleEditProduct, showAlert }) => {
    const { productId } = useParams();
    const navigate = useNavigate();

    // Find product by id
    const product = products.find(p => p.id === parseInt(productId));
    
    const initialCategoryId = product?.categoryId || getCategoryIdFromName(product?.category);


    const [form, setForm] = useState({
        name: product?.name || "",
        description: product?.description || "",
        // Use the initialCategoryId for form binding
        categoryId: initialCategoryId, 
        imageUrl: product?.imageUrl || "",
        stock: product?.stock || 0,
        price: product?.price || 0,
        discount: product?.discount || 0,
    });

    if (!product) {
        return (
            <div className="ap-page-background font-sans">
                <div className="ap-container">
                    <div className="ap-card">
                        <h2 style={{ color: '#dc3545', textAlign: 'center' }}>Product not found!</h2>
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <button className="ap-btn ap-btn-cancel" onClick={() => navigate("/admin")}>
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.price || !form.categoryId) {
            alert("Please fill in all required fields (Name, Price, and Category)");
            return;
        }

        const updatedProduct = {
            ...product,
            name: form.name,
            description: form.description,
            // FIX 2: Ensure we save categoryId (number)
            categoryId: parseInt(form.categoryId) || 0,
            // category: categories[form.categoryId], // REMOVED: Saving the name here is redundant and relies on the legacy 'category' prop.
            imageUrl: form.imageUrl,
            stock: parseInt(form.stock) || 0,
            price: parseFloat(form.price) || 0,
            discount: parseInt(form.discount) || 0,
        };
        
        // Remove the string 'category' property if it exists, as we rely on categoryId.
        delete updatedProduct.category; 

        handleEditProduct(updatedProduct);
        showAlert("Product updated successfully!", "info");
        navigate("/admin");
    };

    return (
        <div className="ap-page-background font-sans">
            <div className="ap-container">
                <h2 className="ap-header">Edit Product: {product.name}</h2>
                <div className="ap-card">
                    <form id="edit-product-form" className="ap-form-grid" onSubmit={handleSubmit}>
                        {/* Left Column */}
                        <div>
                            <div className="ap-field">
                                <label className="ap-label">Product Name</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="ap-input"
                                    required
                                />
                            </div>
                            <div className="ap-field">
                                <label className="ap-label">Description</label>
                                <input
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="ap-input"
                                />
                            </div>
                            <div className="ap-field">
                                <label className="ap-label">Category</label>
                                {/* The select input's name must match the state property 'categoryId' */}
                                <select
                                    name="categoryId"
                                    value={form.categoryId}
                                    onChange={handleChange}
                                    className="ap-input"
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
                                    {/* Map over the category entries to use ID as value and Name as display */}
                                    {Object.entries(categories).map(([id, name]) => (
                                        <option key={id} value={id}>{name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="ap-field">
                                <label className="ap-label">Image URL</label>
                                <input
                                    name="imageUrl"
                                    value={form.imageUrl}
                                    onChange={handleChange}
                                    className="ap-input"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div>
                            <div className="ap-field">
                                <label className="ap-label">Stock</label>
                                <input
                                    name="stock"
                                    type="number"
                                    min="0"
                                    value={form.stock}
                                    onChange={handleChange}
                                    className="ap-input"
                                />
                            </div>
                            <div className="ap-field">
                                <label className="ap-label">Price (₱)</label>
                                <input
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.price}
                                    onChange={handleChange}
                                    className="ap-input"
                                    required
                                />
                            </div>
                            <div className="ap-field">
                                <label className="ap-label">Discount (%)</label>
                                <input
                                    name="discount"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={form.discount}
                                    onChange={handleChange}
                                    className="ap-input"
                                />
                            </div>
                            <div className="ap-field-spacer"></div>
                        </div>
                    </form>
                    <div className="ap-actions">
                        <button type="submit" form="edit-product-form" className="ap-btn ap-btn-create">
                            Save Changes
                        </button>
                        <button type="button" className="ap-btn ap-btn-cancel" onClick={() => navigate("/admin")}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
