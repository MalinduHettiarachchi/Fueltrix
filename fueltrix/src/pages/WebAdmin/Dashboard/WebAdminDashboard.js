// src/App.js
import './WebAdminDashboard.css'; // Import CSS styles
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom'; // Import necessary components from react-router-dom
import firebase from 'firebase/app';
import 'firebase/firestore';
import { format } from 'date-fns';
import { motion } from 'framer-motion'; // Framer Motion for animations
import styled from 'styled-components'; // styled-components for modern styling
import logo from '../../../img/istockphoto-1390980481-612x612-removebg-preview.png'; // Adjust the path according to your folder structure
import Swal from 'sweetalert2'; // Import SweetAlert2


const Sidebar = ({ onChangeView }) => {
    const navigate = useNavigate(); // Get navigate function

    const handleLogout = () => {
        // Clear user-related data (e.g., tokens)
        localStorage.removeItem('authToken'); // Assuming auth token is stored in localStorage
        sessionStorage.clear(); // Clear session storage if used
        
        // Redirect to login page
        navigate('/webAdminLogin'); // Use navigate for redirection
    };

    return (
        <aside className="webadmin-sidebar">
            <div className="webadmin-sidebar-brand">
                <i className="fas fa-cog"></i> Admin Dashboard
            </div>
            <ul className="webadmin-sidebar-menu">
                <li><a href="#" onClick={() => onChangeView('shedRequests')}><i className="fas fa-warehouse"></i> Shed Registration Requests</a></li>
                <li><a href="#" onClick={() => onChangeView('companyRequests')}><i className="fas fa-building"></i> Company Registration Requests</a></li>
                <li><a href="#" onClick={() => onChangeView('registeredSheds')}><i className="fas fa-industry"></i> Registered Sheds</a></li>
                <li><a href="#" onClick={() => onChangeView('registeredCompanies')}><i className="fas fa-building"></i> Registered Companies</a></li>
                <li><a href="#" onClick={() => onChangeView('companyVehicles')}><i className="fas fa-truck"></i> Company Vehicles</a></li>
                <li><a href="#" onClick={() => onChangeView('driverManagement')}><i className="fas fa-user-tie"></i> Driver Management</a></li>
                <li><a href="#" onClick={() => onChangeView('pumpAssistantManagement')}><i className="fas fa-gas-pump"></i> Pump Assistant Management</a></li>
                <li><a href="#" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        </aside>
    );
};



const Header = () => {
    return (
        <header className="webadmin-dashboard-header">
            <div className="header-content">
                <img src={logo} alt="Logo" className="logo" /> {/* Importing the logo */}
                <h1>Welcome to the Admin Dashboard</h1>
            </div>
        </header>
    );
};




const ShedRequests = () => {
    const [shedRequests, setShedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchShedRequests = async () => {
            try {
                const response = await axios.get('http://localhost:5000/shed-requests');
                setShedRequests(response.data);
            } catch (error) {
                console.error('Error fetching shed requests:', error);
                setError('Failed to load shed requests.');
            } finally {
                setLoading(false);
            }
        };

        fetchShedRequests();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.put(`http://localhost:5000/shed-requests/${id}/approve`);
            setShedRequests(prevRequests => prevRequests.filter(request => request.id !== id));
            setSuccess('Shed request approved successfully!');
        } catch (error) {
            console.error('Error approving shed request:', error);
            setError('Failed to approve shed request.');
        }
    };

    if (loading) {
        return <div className="LoadingMessage">Loading shed requests...</div>;
    }

    if (error) {
        return <div className="ErrorMessage">{error}</div>;
    }

    return (
        <div className="ShedRequest">
            <h1>Shed Registration Requests</h1>
            {success && <div className="SuccessMessage">{success}</div>}
            {shedRequests.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Shed Register Number</th>
                            <th>Shed Name</th>
                            <th>Email</th>
                            <th>Location</th>
                            <th>Security Key</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shedRequests.map(request => (
                            <tr key={request.id}>
                                <td>{request.shedRegisterNumber}</td>
                                <td>{request.shedName}</td>
                                <td>{request.email}</td>
                                <td>{request.location}</td>
                                <td>{request.Security_Key}</td>
                                <td>
                                    {request.createdAt ? (
                                        new Date(request.createdAt).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            hour12: true
                                        }).replace(',', '')
                                    ) : (
                                        'Invalid Date'
                                    )}
                                </td>
                                <td>
                                    <button className='Webapprove' onClick={() => handleApprove(request.id)}>Approve</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No shed registration requests found.</p>
            )}
        </div>
    );
};



const RegisteredSheds = () => {
    const [sheds, setSheds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApprovedSheds = async () => {
            try {
                const response = await axios.get('http://localhost:5000/approved-sheds');
                setSheds(response.data);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Error fetching approved sheds');
            } finally {
                setLoading(false);
            }
        };

        fetchApprovedSheds();
    }, []);

    const handleReject = async (shedId) => {
        // SweetAlert2 Confirmation Box
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to reject this shed?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, reject it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Make API call to update the shed's Approved_status to false
                    await axios.put(`http://localhost:5000/reject-shed/${shedId}`, {
                        Approved_status: false,
                    });

                    // Update the UI by setting the shed's Approved_status to false
                    setSheds((prevSheds) =>
                        prevSheds.map((shed) =>
                            shed.id === shedId ? { ...shed, Approved_status: false } : shed
                        )
                    );

                    // Show success message
                    Swal.fire('Rejected!', 'The shed has been rejected.', 'success');
                } catch (err) {
                    console.error('Error rejecting shed:', err);
                    setError('Error rejecting the shed.');
                    Swal.fire('Error', 'There was an error rejecting the shed.', 'error');
                }
            }
        });
    };

    if (loading) return <div className="LoadingMessage">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="registered-sheds">
            <h2 className="title">Registered Sheds</h2>
            {sheds.length > 0 ? (
                <table className="shed-table">
                    <thead>
                        <tr>
                            <th>Shed Name</th>
                            <th>Register Number</th>
                            <th>Email</th>
                            <th>Location</th>
                            <th>Security Key</th>
                            <th>Approved Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sheds.map((shed) => (
                            <tr key={shed.id}>
                                <td>{shed.shedName}</td>
                                <td>{shed.shedRegisterNumber}</td>
                                <td>{shed.email}</td>
                                <td>{shed.location}</td>
                                <td>{shed.Security_Key}</td>
                                <td>{shed.Approved_status ? 'Approved' : 'Not Approved'}</td>
                                <td>{shed.createdAt && new Date(shed.createdAt).toLocaleString()}</td>
                                <td>
                                    {shed.Approved_status && (
                                        <button
                                            onClick={() => handleReject(shed.id)}
                                            className="reject-btn"
                                        >
                                            Reject
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No approved sheds found.</p>
            )}
        </div>
    );
};



const PumpAssistantManagement = () => {
    const [pumpAssistants, setPumpAssistants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPumpAssistants = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/pump-assistants');
                setPumpAssistants(response.data);
            } catch (err) {
                console.error('Error fetching pump assistants:', err);
                setError('Failed to fetch pump assistant data.');
            } finally {
                setLoading(false);
            }
        };

        fetchPumpAssistants();
    }, []);

    if (loading) return <div className='LoadingMessage'>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="Pump_Assistant-content"><br/>
            <h1 className='title'>Pump Assistant Management</h1>
            {pumpAssistants.length > 0 ? (
                <table className="pump-assistant-table">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Shed Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pumpAssistants.map((assistant) => (
                            <tr key={assistant.id}>
                                <td>{assistant.firstName}</td>
                                <td>{assistant.lastName}</td>
                                <td>{assistant.email}</td>
                                <td>{assistant.shedName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No pump assistants found.</p>
            )}
        </div>
    );
};


const CompanyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/company-requests');
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching company requests:', error);
                setError('Failed to fetch requests. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleApprove = async (requestId) => {
        try {
            // Clear previous success and error messages
            setSuccess('');
            setError('');

            // Log before making request
            console.log(`Approving request with requestId: ${requestId}`);

            // Approve the request
            const approvalResponse = await axios.post(`http://localhost:5000/api/approve-request/${requestId}`);

            // Log approval response
            console.log('Approval response:', approvalResponse.data);

            // Check if the request approval was successful
            if (approvalResponse.status === 200 && approvalResponse.data.message === 'Request approved successfully') {
                console.log('Request approved successfully!');

                // Set success message
                setSuccess('Request approved successfully!');

                // Update the state to remove the approved request
                setRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));

                // Clear the success message after a delay (optional)
                setTimeout(() => setSuccess(''), 3000); // Hide the message after 3 seconds
            } else {
                throw new Error('Failed to approve request');
            }

        } catch (error) {
            console.error('Error approving request:', error);

            // Log specific error details if available
            if (error.response) {
                console.error('Error details:', error.response.data);
            }

            // Set the error message to be displayed
            setError('Failed to approve the request. Please try again later.');
        }
    };

    if (loading) {
        return <div className="LoadingMessage">Loading...</div>;
    }

    return (
        <div className="Company-Registration-Requests">
            <br />
            <h1>Company Registration Requests</h1>
            
            {/* Display success message */}
            {success && <div className="SuccessMessage">{success}</div>}
            
            {/* Display error message */}
            {error && <div className="ErrorMessage">{error}</div>}

            {requests.length === 0 ? (
                <p>No pending requests found.</p>
            ) : (
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th>Company Name</th>
                            <th>Email</th>
                            <th>Package Type</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.id}>
                                <td>{request.company}</td>
                                <td>{request.email}</td>
                                <td>{request.package}</td>
                                <td>{formatDate(request.createdAt)}</td>
                                <td>
                                    <button
                                        className="Webapprove"
                                        onClick={() => handleApprove(request.id)} // Only pass requestId here
                                    >
                                        Approve
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

// Utility function to format date
const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    }).replace(',', '');
};


const RegisteredCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/registered-companies');
                // Filter for only approved companies
                const approvedCompanies = response.data.filter(company => company.Approved_status === true);
                setCompanies(approvedCompanies);
            } catch (error) {
                console.error('Error fetching registered companies:', error);
                setError('Failed to fetch registered companies. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    const handleReject = (companyId) => {
        // Display confirmation dialog
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, reject it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Proceed to update the status if confirmed
                try {
                    await axios.put(`http://localhost:5000/api/registered-companies/${companyId}`, {
                        Approved_status: false,
                    });
                    setCompanies(prevCompanies => prevCompanies.filter(company => company.id !== companyId));
                    Swal.fire(
                        'Rejected!',
                        'The company has been rejected.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error rejecting company:', error);
                    setError('Failed to reject the company. Please try again later.');
                }
            }
        });
    };

    if (loading) {
        return <div className="LoadingMessage">Loading...</div>;
    }

    if (error) {
        return <div className="ErrorMessage">{error}</div>;
    }

    return (
        <div className="RegisteredCompanies-content"><br/>
            <h1>Registered Companies</h1>
            {companies.length === 0 ? (
                <p>No approved companies found.</p>
            ) : (
                <table className="companies-table">
                    <thead>
                        <tr>
                            <th>Company Name</th>
                            <th>Email</th>
                            <th>Package Type</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map(company => (
                            <tr key={company.id}>
                                <td>{company.company}</td>
                                <td>{company.email}</td>
                                <td>{company.package}</td>
                                <td>{formatDateCompany(company.createdAt)}</td>
                                <td>
                                    <button className="reject-btn" onClick={() => handleReject(company.id)}>Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const formatDateCompany = (dateString) => {
    if (!dateString) return 'Invalid Date';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    }).replace(',', '');
};



// Add other components for different views if needed
const CompanyVehicles = () => <div>Company Vehicles Content</div>;
const DriverManagement = () => <div>Driver Management Content</div>;
const Dashboard = () => {
    const [currentView, setCurrentView] = useState('dashboard'); // State to manage current view

    const renderContent = () => {
        switch (currentView) {
            case 'shedRequests':
                return <ShedRequests />;
            case 'companyRequests':
                return <CompanyRequests />;
            case 'registeredSheds':
                return <RegisteredSheds />;
            case 'registeredCompanies':
                return <RegisteredCompanies />;
            case 'companyVehicles':
                return <CompanyVehicles />;
            case 'driverManagement':
                return <DriverManagement />;
            case 'pumpAssistantManagement':
                return <PumpAssistantManagement />;
            default:
                return (
                    <section className="webadmin-stats">
                        <div className="webadmin-stat-card">
                            <h2>Pending Shed Requests</h2>
                            <p>20 pending</p>
                        </div>
                        <div className="webadmin-stat-card">
                            <h2>Total Registered Companies</h2>
                            <p>45 companies</p>
                        </div>
                        <div className="webadmin-stat-card">
                            <h2>Total Registered Sheds</h2>
                            <p>30 sheds</p>
                        </div>
                        <div className="webadmin-stat-card">
                            <h2>Total Company Vehicles</h2>
                            <p>150 vehicles</p>
                        </div>
                        <div className="webadmin-stat-card">
                            <h2>Total Drivers</h2>
                            <p>85 drivers</p>
                        </div>
                        <div className="webadmin-stat-card">
                            <h2>Total Pump Assistants</h2>
                            <p>50 assistants</p>
                        </div>
                    </section>
                );
        }
    };

    return (
        <div className="webadmin-dashboard-container">
            <Sidebar onChangeView={setCurrentView} />
            <main className="webadmin-main-content">
                <Header />
                {renderContent()}
               
            </main>
        </div>
    );
};

function App() {
    return (
            <div className="webadmin-app">
                <Dashboard />
            </div>
   );
}

export default App;
