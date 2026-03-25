import { useState } from 'react'
import { useDealer } from './DealerContext'
import './DealerProfileSetup.css'

function DealerProfileSetup({ onProfileComplete }) {
  const { updateDealerProfile } = useDealer()
  const [formData, setFormData] = useState({
    dealershipName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumbers: ['', ''],
    email: '',
    gstNumber: '',
    logo: null,
    logoPreview: null
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhoneChange = (index, value) => {
    const newPhones = [...formData.phoneNumbers]
    newPhones[index] = value
    setFormData(prev => ({
      ...prev,
      phoneNumbers: newPhones
    }))
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo size must be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          logo: file,
          logoPreview: event.target.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.dealershipName.trim()) {
      setError('Dealership name is required')
      return
    }
    if (!formData.address.trim()) {
      setError('Address is required')
      return
    }
    if (!formData.city.trim()) {
      setError('City is required')
      return
    }
    if (!formData.state.trim()) {
      setError('State is required')
      return
    }
    if (!formData.phoneNumbers[0].trim()) {
      setError('At least one phone number is required')
      return
    }
    if (!formData.logoPreview) {
      setError('Logo is required')
      return
    }

    setLoading(true)

    try {
      // Create profile object
      const profile = {
        dealershipName: formData.dealershipName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phoneNumbers: formData.phoneNumbers.filter(p => p.trim()),
        email: formData.email,
        gstNumber: formData.gstNumber,
        logoPreview: formData.logoPreview,
        createdAt: new Date().toISOString()
      }

      // Save profile
      updateDealerProfile(profile)

      // Call success callback
      if (onProfileComplete) {
        onProfileComplete(profile)
      }
    } catch (err) {
      setError('Failed to create profile: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dealer-setup-container">
      <div className="dealer-setup-card">
        <div className="setup-header">
          <h1>🚗 Automobile Dealership Setup</h1>
          <p>Create your dealership profile to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="dealer-form">
          {error && <div className="error-message">{error}</div>}

          {/* Dealership Name */}
          <div className="form-section">
            <h3>Dealership Information</h3>
            
            <div className="form-group">
              <label htmlFor="dealershipName">Dealership Name *</label>
              <input
                type="text"
                id="dealershipName"
                name="dealershipName"
                value={formData.dealershipName}
                onChange={handleInputChange}
                placeholder="e.g., Sunrise Auto Gallery"
                disabled={loading}
                required
              />
            </div>

            {/* Address */}
            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="e.g., 123 Main Road, Sector 10"
                disabled={loading}
                required
              />
            </div>

            {/* City, State, Zip */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g., Pune"
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="e.g., State Name"
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="e.g., 411001"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3>Contact Information</h3>
            
            <div className="form-group">
              <label htmlFor="phone1">Phone Number 1 *</label>
              <input
                type="tel"
                id="phone1"
                value={formData.phoneNumbers[0]}
                onChange={(e) => handlePhoneChange(0, e.target.value)}
                placeholder="e.g., +91 98765 43210"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone2">Phone Number 2</label>
              <input
                type="tel"
                id="phone2"
                value={formData.phoneNumbers[1]}
                onChange={(e) => handlePhoneChange(1, e.target.value)}
                placeholder="e.g., +91 91234 56789"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g., contact@yourdealership.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gstNumber">GST Number</label>
              <input
                type="text"
                id="gstNumber"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleInputChange}
                placeholder="e.g., 27AABCD1234E1Z0"
                disabled={loading}
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="form-section">
            <h3>Dealership Logo</h3>
            
            <div className="logo-upload-area">
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleLogoChange}
                disabled={loading}
                style={{ display: 'none' }}
              />
              <label htmlFor="logo" className="logo-upload-label">
                {formData.logoPreview ? (
                  <div className="logo-preview">
                    <img src={formData.logoPreview} alt="Logo preview" />
                    <p className="change-logo">Click to change logo</p>
                  </div>
                ) : (
                  <div className="logo-placeholder">
                    <span className="upload-icon" aria-hidden="true">📤</span>
                    <p className="upload-title">Click to upload logo</p>
                    <p className="upload-hint">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-create-profile"
            disabled={loading}
          >
            {loading ? 'Creating Profile...' : '✓ Create Profile'}
          </button>
        </form>
      </div>

      <div className="setup-footer">
        <p>Your dealership information will be used in all quotations and documents</p>
      </div>
    </div>
  )
}

export default DealerProfileSetup
