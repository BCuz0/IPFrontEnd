import React, { useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import './CustomerPage.css'

function CustomerPage() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [editingCustomer, setEditingCustomer] = useState(null)
    const [updatedCustomer, setUpdatedCustomer] = useState({ first_name: '', last_name: '', email: '', address_id: '' });
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [query, setQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [rentalHistory, setRentalHistory] = useState([]);
    const [newCustomer, setNewCustomer] = useState({ first_name: '', last_name: '', email: '', address_id: '' })
    const [message, setMessage] = useState('');
    const landingPage = () => {
        navigate('/')
    };
    const filmsPage = () => {
        navigate('/FilmsPage');
    };
    useEffect(() => {
        fetch(`http://127.0.0.1:5000/customers?page=${page}&limit=${limit}&search=${query}`)
            .then(response => response.json())
            .then(data => {
                setCustomers(data.customers);
                setTotalCustomers(data.total_customers);
        });
    }, [page, limit, query]);
    const totalPages = Math.ceil(totalCustomers / limit);
    const handleEditClick = (customer) => {
        setEditingCustomer(customer.customer_id);
        setUpdatedCustomer({ 
        first_name: customer.first_name, 
        last_name: customer.last_name, 
        email: customer.email,
        });
    };
    const handleEditInputChange = (e) => {
        setUpdatedCustomer({ ...updatedCustomer, [e.target.name]: e.target.value });
    };
    const handleUpdateCustomer = async (customerId) => {
        const updatedCustomerWithAddress = {
            ...updatedCustomer,
            address_id: 1
        };
        try {
            const response = await fetch(`http://127.0.0.1:5000/customers/${customerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCustomerWithAddress),
            });
    
            const result = await response.json();
            if (result.success) {
                alert('Customer updated successfully');
                setCustomers(customers.map(c => c.customer_id === customerId ? { ...c, ...updatedCustomer } : c));
                setEditingCustomer(null);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    };
    const handleSearch = () => {
        setQuery(searchTerm);
        setPage(1);
    };
    const handleDeleteCustomer = (customerId) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            fetch(`http://127.0.0.1:5000/customers/${customerId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setMessage('Customer deleted successfully!');
                        setCustomers(customers.filter(customer => customer.customer_id !== customerId));
                    } else {
                        setMessage('Failed to delete customer.');
                    }
                })
                .catch(() => setMessage('Error deleting customer.'));
        }
    };
    const handleViewCustomerDetails = (customerId) => {
        setSelectedCustomer(customerId);
        fetch(`http://127.0.0.1:5000/customers/${customerId}/rental-history`)
            .then(response => response.json())
            .then(data => {
                setRentalHistory(data.rentals);
            });
    };
    const handleInputChange = (e) => {
        setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
    };
    const handleAddCustomer = () => {
        fetch('http://127.0.0.1:5000/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newCustomer, store_id: 1 })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setMessage('Customer added successfully!');
                    setNewCustomer({ first_name: '', last_name: '', email: '' });
                    setQuery('');
                } else {
                    setMessage(`Failed to add customer. ${data.message}`);
                }
            })
            .catch(() => setMessage('Error adding customer.'));
    };
    return (
        <div className="customer-page">
            <div className="navbar">
                {/* Title on the left */}
                <div className="navbar-title">SAKILAFLIX</div>
    
                {/* Buttons on the right */}
                <div>
                    <button onClick={landingPage}>Home Page</button>
                    <button onClick={filmsPage}>Films Page</button>
                </div>
            </div>
            <h1>Customer List</h1>
    
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by ID, First or Last Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
    
            {customers.length === 0 ? (
                <p>No customers found.</p>
            ) : (
                <ul className="customer-list">
                    {customers.map((customer) => (
                        <li key={customer.customer_id}>
                            {editingCustomer === customer.customer_id ? (
                                <div className="edit-form">
                                    <input type="text" name="first_name" value={updatedCustomer.first_name} onChange={handleEditInputChange} />
                                    <input type="text" name="last_name" value={updatedCustomer.last_name} onChange={handleEditInputChange} />
                                    <input type="email" name="email" value={updatedCustomer.email} onChange={handleEditInputChange} />
                                    <button onClick={() => handleUpdateCustomer(customer.customer_id)}>Save</button>
                                    <button onClick={() => setEditingCustomer(null)}>Cancel</button>
                                </div>
                            ) : (
                                <div className="customer-info">
                                    <strong>{customer.first_name} {customer.last_name}</strong> - {customer.email} (Joined: {customer.create_date})
                                    <button onClick={() => handleViewCustomerDetails(customer.customer_id)}>View Details</button>
                                    <button onClick={() => handleEditClick(customer)}>Edit</button>
                                    <button onClick={() => handleDeleteCustomer(customer.customer_id)}>Delete</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
    
            <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                <span> Page {page} of {totalPages} </span>
                <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>Next</button>
            </div>
    
            {selectedCustomer && (
                <div className="customer-details">
                    <h2>Customer Details</h2>
                    <p><strong>Name:</strong> {selectedCustomer.first_name} {selectedCustomer.last_name}</p>
                    <p><strong>Email:</strong> {selectedCustomer.email}</p>
                    <p><strong>Join Date:</strong> {selectedCustomer.create_date}</p>
    
                    <h3>Rental History</h3>
                    {rentalHistory.length === 0 ? (
                        <p>No rental history found.</p>
                    ) : (
                        <ul>
                            {rentalHistory.map((rental, index) => (
                                <li key={index}>
                                    <strong>Film:</strong> {rental.title} <br />
                                    <strong>Rental Date:</strong> {rental.rental_date} <br />
                                    <strong>Return Date:</strong> {rental.return_date || 'Not Returned Yet'}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
    
            <h2>Add New Customer</h2>
            <div className="add-customer-form">
                <input type="text" name="first_name" placeholder="First Name" value={newCustomer.first_name} onChange={handleInputChange} />
                <input type="text" name="last_name" placeholder="Last Name" value={newCustomer.last_name} onChange={handleInputChange} />
                <input type="email" name="email" placeholder="Email" value={newCustomer.email} onChange={handleInputChange} />
                <input type="number" name="address_id" placeholder="Address ID" value={newCustomer.address_id} onChange={handleInputChange} />
                <button onClick={handleAddCustomer}>Add Customer</button>
            </div>
    
            {message && <p className="message">{message}</p>}
        </div>
    );        
}

export default CustomerPage;