import React from 'react';

const HistorySidebar = ({ isOpen, onClose, product, history }) => {
  if (!isOpen) return null;

  return (
    <div className="history-sidebar">
      <div className="sidebar-header">
        <h3>Inventory History - {product?.name}</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      
      <div className="history-content">
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Old Stock</th>
              <th>New Stock</th>
              <th>Changed By</th>
            </tr>
          </thead>
          <tbody>
            {history.map(record => (
              <tr key={record.id}>
                <td>{new Date(record.timestamp).toLocaleString()}</td>
                <td>{record.oldStock}</td>
                <td>{record.newStock}</td>
                <td>{record.changedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {history.length === 0 && (
          <p className="no-history">No inventory history found</p>
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;