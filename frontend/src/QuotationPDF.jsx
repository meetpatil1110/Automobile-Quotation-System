import { useRef } from 'react'
import { useDealer } from './DealerContext'
import html2pdf from 'html2pdf.js'
import './QuotationPDF.css'

function QuotationPDF({ quotation, onClose }) {
  const { dealerProfile } = useDealer()
  const contentRef = useRef(null)

  const generatePDF = () => {
    const element = contentRef.current
    const opt = {
      margin: 10,
      filename: `Quotation_${quotation.quotationId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    }
    html2pdf().set(opt).from(element).save()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatSpecValue = (value) => {
    const numValue = parseFloat(String(value).replace(/,/g, ''))
    if (!isNaN(numValue)) {
      return Math.round(numValue)
    }
    return value
  }

  const today = new Date()
  const validUntil = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })
  }

  return (
    <div className="pdf-modal-overlay">
      <div className="pdf-modal">
        <div className="pdf-header">
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div ref={contentRef} className="quotation-template">
          {/* ===== HEADER SECTION ===== */}
          <div className="header-section">
            <div className="company-section">
              {dealerProfile?.logoPreview && (
                <img src={dealerProfile.logoPreview} alt={dealerProfile.dealershipName} className="logo-image" />
              )}
              <div className="company-details">
                <h1>{dealerProfile?.dealershipName || 'Dealership Name'}</h1>
                <div className="company-meta">
                  <p>{dealerProfile?.address || ''}</p>
                  <p>{dealerProfile?.city}, {dealerProfile?.state} {dealerProfile?.zipCode}</p>
                  <p>Phone: {dealerProfile?.phoneNumbers?.join(', ') || ''}</p>
                  {dealerProfile?.email && <p>Email: {dealerProfile.email}</p>}
                  <p>Prepared by: {quotation.preparedBy || '___________________'}</p>
                </div>
              </div>
            </div>

            <div className="quote-info-section">
              <h2 className="quote-title">QUOTATION</h2>
              <table className="quote-details-table">
                <tbody>
                  <tr>
                    <td className="label">DATE</td>
                    <td className="value">{formatDate(today)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ===== CUSTOMER SECTION ===== */}
          <div className="customer-section">
            <h3 className="section-heading">CUSTOMER</h3>
            <div className="customer-content">
              <p><strong>{quotation.customerName}</strong></p>
            </div>
          </div>

          {/* ===== PRICING TABLE ===== */}
          <div className="pricing-section">
            <h3 className="section-heading">PRICING</h3>
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Vehicle Model</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items && quotation.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.model}</td>
                    <td className="text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="pricing-totals">
              <div className="total-row">
                <span className="label">Subtotal:</span>
                <span className="amount">{formatCurrency(quotation.subtotal)}</span>
              </div>
              {quotation.discountPercent > 0 && (
                <div className="total-row">
                  <span className="label">Discount ({quotation.discountPercent}%):</span>
                  <span className="amount">-{formatCurrency(quotation.discountAmount)}</span>
                </div>
              )}
              <div className="total-row">
                <span className="label">Subtotal after Discount:</span>
                <span className="amount">{formatCurrency(quotation.amountAfterDiscount)}</span>
              </div>
              <div className="total-row">
                <span className="label">Tax ({(quotation.taxPercent).toFixed(1)}%):</span>
                <span className="amount">{formatCurrency(quotation.taxAmount)}</span>
              </div>
              <div className="total-row grand-total">
                <span className="label"><strong>Total Amount:</strong></span>
                <span className="amount"><strong>{formatCurrency(quotation.total)}</strong></span>
              </div>
            </div>
          </div>

          {/* ===== VEHICLE SPECIFICATIONS ===== */}
          <div className="specs-section-full">
            <h3 className="section-heading">VEHICLE SPECIFICATIONS</h3>
            {quotation.items && quotation.items.map((item, itemIndex) => (
              <div key={itemIndex} className="specs-vehicle-block">
                <h4 className="vehicle-name">{item.model} (Qty: {item.quantity})</h4>
                <table className="specs-table">
                  <tbody>
                    {item.vehicleData && 
                      Object.entries(item.vehicleData).map(([key, value], index) => (
                        <tr key={index}>
                          <td className="spec-label">{key}</td>
                          <td className="spec-value">{formatSpecValue(value)}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* ===== SUMMARY SECTION ===== */}
          <div className="summary-container">
            {/* Left: Terms and Conditions */}
            <div className="terms-section">
              <h3 className="section-heading">TERMS AND CONDITIONS</h3>
              <ol className="terms-list">
                <li>Booking confirmed only after advance payment</li>
                <li>Insurance and registration as per statutory norms</li>
                <li>Warranty as per manufacturer policy</li>
                <li>Customer will be billed after indicating acceptance of this quote</li>
              </ol>
            </div>
          </div>

          {/* ===== FOOTER ===== */}
          <div className="footer-section">
            <p>If you have any questions about this price quote, please contact</p>
            <p><strong>{dealerProfile?.dealershipName || 'Dealership'}</strong> - Phone: {dealerProfile?.phoneNumbers?.join(', ') || ''}</p>
            <p className="thank-you"><em>Thank You For Your Business!</em></p>
          </div>
        </div>

        <div className="pdf-actions">
          <button onClick={generatePDF} className="btn-download">
            ⬇ Download PDF
          </button>
          <button onClick={onClose} className="btn-close-modal">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuotationPDF
