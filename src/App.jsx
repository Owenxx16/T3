import { useState, useEffect } from 'react'
import './App.css'

const API_URL= "https://67d8e3ac00348dd3e2a88e28.mockapi.io/api/group12/group12";

function App() {
  // States for data management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for CRUD operations
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    // Add other fields as needed
  });

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new item
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      
      if (!response.ok) throw new Error('Failed to add item');
      
      await fetchData(); // Refresh data
      setShowAddForm(false);
      setNewItem({ name: '', age: '', email: '', phone: '', address: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete an item
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete item');
      
      await fetchData(); // Refresh data
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit an item
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${currentItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentItem),
      });
      
      if (!response.ok) throw new Error('Failed to update item');
      
      await fetchData(); // Refresh data
      setShowEditForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Data Management</h1>
      
      {/* Add button */}
      <button 
        className="btn btn-success mb-3"
        onClick={() => setShowAddForm(true)}
      >
        Add New Item
      </button>
      
      {/* Error message */}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Loading indicator */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        /* Data Table */
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.address}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => {
                      setCurrentItem(item);
                      setShowEditForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {/* Add Form Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Item</h2>
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Age</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={newItem.age}
                  onChange={(e) => setNewItem({...newItem, age: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Email</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={newItem.email}
                  onChange={(e) => setNewItem({...newItem, email: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={newItem.phone}
                  onChange={(e) => setNewItem({...newItem, phone: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={newItem.address}
                  onChange={(e) => setNewItem({...newItem, address: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">Save</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Item</h2>
            <form onSubmit={handleEdit}>
              <div className="mb-3">
                <label htmlFor="edit-name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="edit-name"
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Age</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentItem.age}
                  onChange={(e) => setCurrentItem({...currentItem, age: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Email</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentItem.email}
                  onChange={(e) => setCurrentItem({...currentItem, email: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentItem.phone}
                  onChange={(e) => setCurrentItem({...currentItem, phone: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentItem.address}
                  onChange={(e) => setCurrentItem({...currentItem, address: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">Update</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowEditForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App