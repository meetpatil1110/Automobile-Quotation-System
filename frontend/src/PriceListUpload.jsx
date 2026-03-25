import { useState } from 'react'
import { useDealer } from './DealerContext'
import './PriceListUpload.css'

function PriceListUpload({ onUploadSuccess }) {
  const { dealerProfile } = useDealer()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
      
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please select a valid Excel file (.xlsx or .xls)')
        setFile(null)
        return
      }
      
      setFile(selectedFile)
      setError('')
      setMessage('')
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setMessage('')
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✓ ${data.message}. Columns: ${data.columns.join(', ')}`)
        setFile(null)
        if (onUploadSuccess) {
          onUploadSuccess()
        }
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (err) {
      setError('Connection error: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2>Upload Price List</h2>
        <p className="upload-description">Upload an Excel file (.xlsx or .xls) with your automobile pricing</p>
        
        <form onSubmit={handleUpload}>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="excel-file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <label htmlFor="excel-file" className="file-label">
              {file ? file.name : 'Click to select Excel file'}
            </label>
          </div>

          <button type="submit" disabled={!file || uploading} className="upload-button">
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="file-format-card dealer-profile-card">
        <div className="dealer-card-header">
          <h3>Dealership Profile</h3>
          {dealerProfile?.logoPreview && (
            <img src={dealerProfile.logoPreview} alt="Logo" className="dealer-profile-logo" />
          )}
        </div>
        
        <div className="dealer-profile-info">
          <div className="profile-item">
            <span className="profile-label">Dealership Name</span>
            <p className="profile-value">{dealerProfile?.dealershipName || 'N/A'}</p>
          </div>
          
          <div className="profile-item">
            <span className="profile-label">Address</span>
            <p className="profile-value">
              {dealerProfile?.address || 'N/A'},<br />
              {dealerProfile?.city}, {dealerProfile?.state} {dealerProfile?.zipCode}
            </p>
          </div>
          
          <div className="profile-item">
            <span className="profile-label">Phone</span>
            <p className="profile-value">{dealerProfile?.phoneNumbers?.join(' | ') || 'N/A'}</p>
          </div>
          
          {dealerProfile?.email && (
            <div className="profile-item">
              <span className="profile-label">Email</span>
              <p className="profile-value">{dealerProfile.email}</p>
            </div>
          )}
          
          {dealerProfile?.gstNumber && (
            <div className="profile-item">
              <span className="profile-label">GST Number</span>
              <p className="profile-value">{dealerProfile.gstNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PriceListUpload
