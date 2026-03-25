import { useState } from 'react'
import './PriceListUpload.css'

function PriceListUpload({ onUploadSuccess }) {
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

      <div className="file-format-card">
        <h3>Expected Format</h3>
        <p>Your Excel file should contain columns for:</p>
        <ul>
          <li><strong>Model:</strong> Vehicle model name</li>
          <li><strong>Price:</strong> Price amount</li>
          <li><strong>Description:</strong> Additional details (optional)</li>
        </ul>
        <p className="format-note">First row should be the header with column names</p>
      </div>
    </div>
  )
}

export default PriceListUpload
