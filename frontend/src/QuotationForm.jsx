import { useState, useEffect } from 'react'
import './QuotationForm.css'

function QuotationForm({ onGenerateSuccess }) {
  const [customerName, setCustomerName] = useState('')
  const [preparedBy, setPreparedBy] = useState('')
  const [items, setItems] = useState([{ modelName: '', quantity: 1 }])
  const [taxRate, setTaxRate] = useState(5)
  const [discount, setDiscount] = useState(0)
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Fetch available vehicles
  useEffect(() => {
    fetchVehicles('')
  }, [])

  const fetchVehicles = async (search) => {
    try {
      const url = new URL('/api/vehicles', window.location.origin)
      if (search) {
        url.searchParams.append('search', search)
      }
      
      const response = await fetch(url)
      const data = await response.json()
      setVehicles(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch vehicles:', err)
    }
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)

    if (field === 'modelName' && value) {
      fetchVehicles(value)
    }
  }

  const addItem = () => {
    setItems([...items, { modelName: '', quantity: 1 }])
  }

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!customerName.trim()) {
      setError('Please enter customer name')
      return
    }

    if (!preparedBy.trim()) {
      setError('Please enter salesperson name')
      return
    }

    if (items.some(item => !item.modelName.trim())) {
      setError('Please fill in all vehicle models')
      return
    }

    setLoading(true)

    try {
      const payload = {
        customerName,
        preparedBy,
        items,
        taxRate: taxRate / 100,
        discount
      };

      console.log('Sending quotation request:', payload);

      const response = await fetch('/api/generate-quotation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}`);
      }

      if (response.ok) {
        setMessage('✓ Quotation generated successfully!')
        if (onGenerateSuccess) {
          onGenerateSuccess(data.quotation)
        }
        // Reset form
        setCustomerName('')
        setPreparedBy('')
        setItems([{ modelName: '', quantity: 1 }])
        setTaxRate(5)
        setDiscount(0)
      } else {
        setError(data.error || 'Failed to generate quotation')
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="quotation-form-container">
      <div className="form-card">
        <h2>Generate Quotation</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Customer Name */}
          <div className="form-group">
            <label htmlFor="customerName">Customer Name *</label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              disabled={loading}
              required
            />
          </div>

          {/* Prepared By */}
          <div className="form-group">
            <label htmlFor="preparedBy">Prepared by *</label>
            <input
              type="text"
              id="preparedBy"
              value={preparedBy}
              onChange={(e) => setPreparedBy(e.target.value)}
              placeholder="Enter salesperson name"
              disabled={loading}
              required
            />
          </div>

          {/* Items Section */}
          <div className="form-section">
            <h3>Vehicles</h3>
            {items.map((item, index) => (
              <div key={index} className="item-row">
                <div className="item-input-group">
                  <label>Vehicle Model *</label>
                  <input
                    type="text"
                    list={`vehicles-list-${index}`}
                    value={item.modelName}
                    onChange={(e) => handleItemChange(index, 'modelName', e.target.value)}
                    placeholder="Type or select vehicle model"
                    disabled={loading}
                    required
                  />
                  <datalist id={`vehicles-list-${index}`}>
                    {vehicles.map((vehicle, vidx) => (
                      <option key={vidx} value={vehicle.model}>
                        {vehicle.model} - ${vehicle.price}
                      </option>
                    ))}
                  </datalist>
                </div>

                <div className="item-input-group quantity">
                  <label>Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    disabled={loading}
                  />
                </div>

                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1 || loading}
                  title="Remove this item"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              className="btn-add-item"
              onClick={addItem}
              disabled={loading}
            >
              + Add Vehicle
            </button>
          </div>

          {/* Messages */}
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          {/* Submit Button */}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Quotation'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default QuotationForm
