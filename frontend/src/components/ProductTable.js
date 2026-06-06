import React, { useState } from 'react';
import { productAPI } from '../services/api';
import { toast } from 'react-toastify';

const ProductTable = ({ products, onProductUpdate, onProductSelect }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id) => {
    try {
      await productAPI.update(id, editForm);
      setEditingId(null);
      setEditForm({});
      onProductUpdate();
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        onProductUpdate();
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const StockStatus = ({ status }) => (
    <span className={`status-label ${status === 'In Stock' ? 'in-stock' : 'out-of-stock'}`}>
      {status}
    </span>
  );

  return (
    <div className="product-table">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} onClick={() => onProductSelect(product)}>
              <td>
                {product.image ? (
                  <img src={product.image} alt={product.name} className="product-image" />
                ) : (
                  <div className="image-placeholder">No Image</div>
                )}
              </td>
              
              <td>
                {editingId === product.id ? (
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                ) : (
                  product.name
                )}
              </td>

              <td>
                {editingId === product.id ? (
                  <input
                    value={editForm.unit}
                    onChange={(e) => setEditForm({...editForm, unit: e.target.value})}
                  />
                ) : (
                  product.unit
                )}
              </td>

              <td>
                {editingId === product.id ? (
                  <input
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                  />
                ) : (
                  product.category
                )}
              </td>

              <td>
                {editingId === product.id ? (
                  <input
                    value={editForm.brand}
                    onChange={(e) => setEditForm({...editForm, brand: e.target.value})}
                  />
                ) : (
                  product.brand
                )}
              </td>

              <td>
                {editingId === product.id ? (
                  <input
                    type="number"
                    value={editForm.stock}
                    onChange={(e) => setEditForm({...editForm, stock: parseInt(e.target.value)})}
                  />
                ) : (
                  product.stock
                )}
              </td>

              <td>
                {editingId === product.id ? (
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                ) : (
                  <StockStatus status={product.status} />
                )}
              </td>

              <td>
                {editingId === product.id ? (
                  <div className="edit-actions">
                    <button onClick={() => handleSave(product.id)} className="btn btn-success">
                      Save
                    </button>
                    <button onClick={handleCancel} className="btn btn-secondary">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="actions">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(product); }} className="btn btn-primary">
                      Edit
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }} className="btn btn-danger">
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;