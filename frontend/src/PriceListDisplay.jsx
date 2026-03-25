import { useState, useEffect } from 'react'
import './PriceListDisplay.css'

function PriceListDisplay({ refreshTrigger }) {
  const [priceList, setPriceList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [columns, setColumns] = useState([])

  const fetchPriceList = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/price-list')
      const data = await response.json()
      
      if (Array.isArray(data) && data.length > 0) {
        setPriceList(data)
        // Extract column names from first item
        setColumns(Object.keys(data[0]))
      } else {
        setPriceList([])
        setColumns([])
      }
    } catch (err) {
      setError('Failed to fetch price list: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPriceList()
  }, [refreshTrigger])

  if (loading) {
    return <div className="loading">Loading price list...</div>
  }

  if (priceList.length === 0) {
    return (
      <div className="empty-state">
        <p>No price list uploaded yet. Upload an Excel file to get started.</p>
      </div>
    )
  }

  return (
    <div className="price-list-container">
      <div className="price-list-header">
        <h2>Current Price List</h2>
        <span className="item-count">{priceList.length} items</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-wrapper">
        <table className="price-table">
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {priceList.map((item, index) => (
              <tr key={index}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={col === 'MODEL' ? 'model-cell' : ''}>
                    {typeof item[col] === 'number' ? item[col].toLocaleString() : item[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PriceListDisplay
