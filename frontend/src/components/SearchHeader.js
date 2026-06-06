import React, { useRef, useState } from 'react';
import { productAPI } from '../services/api';
import Modal from 'react-modal';

import { toast } from 'react-toastify';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const changeFormData = (e)=>{
  console.log("this is inside the form data")
  console.log(e.target.value);
}

const SearchHeader = ({ onSearch, onCategoryFilter, onImport }) => {
  const fileInputRef = useRef();
  const [md,setMd] = useState(false);

  const HelloWorld = () => {
     return (
      <div>
        <Modal
          isOpen={md}
          onRequestClose={changeModalState}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2>Hello</h2>
          <button onClick={changeModalState}>close</button>
          <div>I am a modal</div>
          <form onChange={changeFormData}>
            <input />
            <input type="text" placeholder='name'/>
            <input type="text" placeholder='brand'/>
            <input type="number" placeholder='quantity'/>
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </form>
        </Modal> 
        </div>
    );
  }
  
  const changeModalState = () => {
    setMd(!md)
    // abcd(!md)
    checkStatus()
  }

  const checkStatus = ()=>{
    console.log("this is the status after checking the add new button")
    console.log(md)
  }

  const handleImport = async (event) => {

    const file = event.target.files[0];
    console.log("this is the file")
    console.log(file)
    if (!file) return;

    try {
      const response = await productAPI.importCSV(file);
      const { added, skipped, duplicates } = response.data;
      
      toast.success(`Import completed: ${added} added, ${skipped} skipped`);
      
      if (duplicates.length > 0) {
        console.log('Duplicates:', duplicates);
        // You can show duplicates in a modal here
      }
      
      onImport();
    } catch (error) {
      toast.error('Import failed');
    }
  };

  const handleExport = async () => {
    try {
      const response = await productAPI.exportCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export completed');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="search-header">
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => onSearch(e.target.value)}
          className="search-input"
        />
        
        <select onChange={(e) => onCategoryFilter(e.target.value)} className="category-filter">
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Food">Food</option>
          <option value="Books">Books</option>
        </select>
      </div>

      <div className="header-actions">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          accept=".csv"
          style={{ display: 'none' }}
        />
        <button onClick={() => fileInputRef.current?.click()} className="btn btn-secondary">
          Import CSV
        </button>
        <button onClick={handleExport} className="btn btn-secondary">
          Export CSV
        </button>
        <button className="btn btn-primary" onClick={changeModalState}>
          Add New Product
        </button>
        {md && HelloWorld()}
      </div>
    </div>
  );
};

export default SearchHeader;