import { useState } from 'react'
import { useDealer } from './DealerContext'
import DealerProfileSetup from './DealerProfileSetup'
import PriceListUpload from './PriceListUpload'
import PriceListDisplay from './PriceListDisplay'
import QuotationForm from './QuotationForm'
import QuotationDisplay from './QuotationDisplay'
import './App.css'

function App() {
  const { dealerProfile, clearDealerProfile, loading } = useDealer()
  const [refreshKey, setRefreshKey] = useState(0)
  const [currentQuotation, setCurrentQuotation] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleGenerateSuccess = (quotation) => {
    setCurrentQuotation(quotation)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  // Show dealer setup if no profile exists
  if (!dealerProfile) {
    return <DealerProfileSetup />
  }

  return (
    <div className="container">
      <div className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1>{dealerProfile.dealershipName}</h1>
            <p className="subtitle">Quotation Generator</p>
          </div>
          {dealerProfile.logoPreview && (
            <img src={dealerProfile.logoPreview} alt="Logo" className="header-logo" />
          )}
        </div>
        <button 
          onClick={() => setShowProfileModal(true)}
          className="edit-profile-btn"
          title="Edit dealership profile"
        >
          ⚙️ Edit Profile
        </button>
      </div>

      {showProfileModal && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <button 
              onClick={() => setShowProfileModal(false)}
              className="close-modal-btn"
            >
              ✕
            </button>
            <div className="profile-modal-content">
              <div className="profile-info">
                <h2>Current Dealership Profile</h2>
                {dealerProfile.logoPreview && (
                  <img src={dealerProfile.logoPreview} alt="Logo" className="modal-logo" />
                )}
                <p><strong>Name:</strong> {dealerProfile.dealershipName}</p>
                <p><strong>Address:</strong> {dealerProfile.address}, {dealerProfile.city}, {dealerProfile.state} {dealerProfile.zipCode}</p>
                <p><strong>Phone:</strong> {dealerProfile.phoneNumbers.join(', ')}</p>
                {dealerProfile.email && <p><strong>Email:</strong> {dealerProfile.email}</p>}
                {dealerProfile.gstNumber && <p><strong>GST:</strong> {dealerProfile.gstNumber}</p>}
              </div>
              <button
                onClick={() => {
                  clearDealerProfile()
                  setShowProfileModal(false)
                }}
                className="btn-change-profile"
              >
                🔄 Change Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <PriceListUpload onUploadSuccess={handleUploadSuccess} />

      <PriceListDisplay refreshTrigger={refreshKey} />

      <QuotationForm onGenerateSuccess={handleGenerateSuccess} />

      <div className="info-card">
        <h2>Access Information</h2>
        <p><strong>Local:</strong> http://localhost:5173</p>
        <p><strong>LAN:</strong> http://&lt;your-machine-ip&gt;:5173</p>
      </div>

      {currentQuotation && (
        <QuotationDisplay 
          quotation={currentQuotation} 
          onClose={() => setCurrentQuotation(null)}
        />
      )}
    </div>
  )
}

export default App
