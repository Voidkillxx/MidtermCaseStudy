import React, { useState } from "react";
import "../Styles/AddProduct.css";
import categories from '../data/Categories.js'; // 

const AddProduct = ({ onAddProduct, onCancel }) => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        categoryId: "",  
        imageUrl: "",
        stock: "",
        price: "",
        discount: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!form.name || !form.price || !form.categoryId) {
            alert("Please fill in all required fields (Name, Price, and Category)");
            return;
        }

        const newProduct = {
            name: form.name,
            description: form.description,
            categoryId: parseInt(form.categoryId), 
            imageUrl: form.imageUrl,
            stock: parseInt(form.stock) || 0,
            price: parseFloat(form.price),       
            discount: parseFloat(form.discount) || 0,
        };

        onAddProduct(newProduct);

        // Reset form
        setForm({
            name: "",
            description: "",
            categoryId: "",
            imageUrl: "",
            stock: "",
            price: "",
            discount: "",
        });
    };

    return (
        <div className="ap-page-background font-sans">
            <div className="ap-container">
                <h2 className="ap-header">Add Products</h2>
                <div className="ap-card">
                    <form id="add-product-form" className="ap-form-grid" onSubmit={handleSubmit}>
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
                                <select
                                    name="categoryId"
                                    value={form.categoryId}
                                    onChange={handleChange}
                                    className="ap-input"
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
                                    {Object.entries(categories).map(([id, name]) => (
                                        <option key={id} value={id}>
                                            {name}
                                        </option>
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

                        <div>
                            <div className="ap-field">
                                <label className="ap-label">Stock</label>
                                <input
                                    name="stock"
                                    type="number"
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
                                    value={form.discount}
                                    onChange={handleChange}
                                    className="ap-input"
                                />
                            </div>
                            <div className="ap-field-spacer"></div>
                        </div>
                    </form>

                    <div className="ap-actions">
                        <button type="submit" form="add-product-form" className="ap-btn ap-btn-create">
                            Create Product
                        </button>
                        <button type="button" className="ap-btn ap-btn-cancel" onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
