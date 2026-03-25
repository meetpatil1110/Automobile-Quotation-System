import { useState, useEffect } from 'react'
import PriceListUpload from './PriceListUpload'
import PriceListDisplay from './PriceListDisplay'
import QuotationForm from './QuotationForm'
import QuotationDisplay from './QuotationDisplay'
import './App.css'

function App() {
  const [serverStatus, setServerStatus] = useState('Checking...')
  const [refreshKey, setRefreshKey] = useState(0)
  const [currentQuotation, setCurrentQuotation] = useState(null)

  useEffect(() => {
    // Check if backend server is running
    fetch('/api/')
      .then(response => response.text())
      .then(data => {
        setServerStatus(data)
      })
      .catch(error => {
        setServerStatus('Server Connection Failed')
        console.error('Error:', error)
      })
  }, [])

  const handleUploadSuccess = () => {
    // Trigger refresh of price list
    setRefreshKey(prev => prev + 1)
  }

  const handleGenerateSuccess = (quotation) => {
    setCurrentQuotation(quotation)
  }

  return (
    <div className="container">
      <div className="app-header">
        <h1>Automobile Quotation System</h1>
        <p className="subtitle">Local Network Quotation Generator</p>
      </div>

      <div className="status-card">
        <h2>Server Status</h2>
        <p className="status-message">{serverStatus}</p>
      </div>

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
