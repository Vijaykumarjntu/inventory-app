import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductTable from './components/ProductTable';
import SearchHeader from './components/SearchHeader';
import HistorySidebar from './components/HistorySidebar';
import { productAPI } from './services/api';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      setFilteredProducts(products);
      return;
    }
    try {
      const response = await productAPI.search(query);
      setFilteredProducts(response.data);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleCategoryFilter = (category) => {
    if (!category) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };

  const handleProductSelect = async (product) => {
    setSelectedProduct(product);
    try {
      const response = await productAPI.getHistory(product.id);
      setHistory(response.data);
      setShowHistory(true);
    } catch (error) {
      toast.error('Failed to load history');
    }
  };

  return (
    <div className="app">
      <SearchHeader 
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
        onImport={loadProducts}
      />
      
      <ProductTable 
        products={filteredProducts}
        onProductUpdate={loadProducts}
        onProductSelect={handleProductSelect}
      />

      <HistorySidebar 
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        product={selectedProduct}
        history={history}
      />

      <ToastContainer position="top-right" />
    </div>
  );
}

export default App;