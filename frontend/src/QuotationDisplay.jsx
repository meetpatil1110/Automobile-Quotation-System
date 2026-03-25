import { useState } from 'react'
import QuotationPDF from './QuotationPDF'
import './QuotationDisplay.css'

function QuotationDisplay({ quotation, onClose }) {
  const [showPDF, setShowPDF] = useState(false)

  if (!quotation) {
    return null
  }

  if (showPDF) {
    return <QuotationPDF quotation={quotation} onClose={() => setShowPDF(false)} />
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Generated Quotation</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div id="quotation-content" className="quotation-content">
          <div className="quotation-header">
            <h1>QUOTATION</h1>
            <p>Invoice #{quotation.quotationId}</p>
            <p>{quotation.quotationDate}</p>
          </div>

          <div className="quotation-info">
            <div>
              <h3>Customer Name:</h3>
              <p>{quotation.customerName}</p>
            </div>
          </div>

          <table className="quotation-table">
            <thead>
              <tr>
                <th>Vehicle Model</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.model}</td>
                  <td className="text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="quotation-totals">
            <div className="totals-row">
              <span className="label">Subtotal:</span>
              <span className="amount">{formatCurrency(quotation.subtotal)}</span>
            </div>
            {quotation.discountPercent > 0 && (
              <div className="totals-row">
                <span className="label">Discount ({quotation.discountPercent}%):</span>
                <span className="amount">-{formatCurrency(quotation.discount)}</span>
              </div>
            )}
            <div className="totals-row">
              <span className="label">Subtotal after Discount:</span>
              <span className="amount">{formatCurrency(quotation.subtotal - quotation.discount)}</span>
            </div>
            <div className="totals-row">
              <span className="label">Tax ({(quotation.taxRate * 100).toFixed(1)}%):</span>
              <span className="amount">{formatCurrency(quotation.tax)}</span>
            </div>
            <div className="totals-row total">
              <span className="label"><strong>Total:</strong></span>
              <span className="amount"><strong>{formatCurrency(quotation.total)}</strong></span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={() => setShowPDF(true)} className="btn btn-primary">
            📄 View Professional PDF
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuotationDisplay
