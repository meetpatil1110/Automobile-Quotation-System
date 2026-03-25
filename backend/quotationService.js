// Service to generate quotations from price list

class QuotationService {
  constructor(priceList) {
    this.priceList = priceList;
  }

  setPriceList(priceList) {
    this.priceList = priceList;
  }

  // Find vehicle by model name
  findVehicle(modelName) {
    return this.priceList.find(item => {
      // Find MODEL column (case-insensitive)
      const modelField = Object.keys(item).find(key => key.toUpperCase() === 'MODEL');
      const modelValue = modelField ? item[modelField] : '';
      return modelValue && modelValue.toLowerCase().includes(modelName.toLowerCase());
    });
  }

  // Generate a single quotation
  generateQuotation(customerName, items, taxRate = 0.05, discount = 0, preparedBy = '') {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Items array is required');
    }

    const quotationItems = items.map(item => {
      const vehicle = this.findVehicle(item.modelName);
      
      if (!vehicle) {
        throw new Error(`Vehicle not found: ${item.modelName}`);
      }

      // Find MODEL column (case-insensitive)
      const modelField = Object.keys(vehicle).find(key => key.toUpperCase() === 'MODEL');
      const modelValue = modelField ? vehicle[modelField] : 'Unknown';

      // Find price column - try ON ROAD first, then ON ROAD WITH ASSY., then PRICE
      let unitPrice = 0;
      const priceKey = Object.keys(vehicle).find(key => {
        const normalizedKey = key.toUpperCase().trim();
        return normalizedKey === 'ON ROAD' || 
               normalizedKey === 'ON ROAD WITH ASSY.' || 
               normalizedKey === 'PRICE';
      });
      
      if (priceKey) {
        const rawValue = vehicle[priceKey];
        unitPrice = parseFloat(String(rawValue).replace(/,/g, '')) || 0;
      }
      
      const quantity = item.quantity || 1;
      const subtotal = unitPrice * quantity;

      return {
        model: modelValue,
        description: '',
        unitPrice: unitPrice,
        quantity: quantity,
        subtotal: subtotal,
        vehicleData: vehicle  // Include full vehicle data with all columns
      };
    });

    // Calculate totals
    const subtotalAmount = quotationItems.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = (subtotalAmount * discount) / 100;
    const amountAfterDiscount = subtotalAmount - discountAmount;
    const taxAmount = (amountAfterDiscount * taxRate) / 100;
    const totalAmount = amountAfterDiscount + taxAmount;

    // Generate unique quotation ID
    const quotationId = 'QT-' + Date.now();
    const quotationDate = new Date().toISOString().split('T')[0];

    return {
      quotationId,
      quotationDate,
      customerName,
      preparedBy,
      items: quotationItems,
      subtotal: parseFloat(subtotalAmount.toFixed(2)),
      discountPercent: discount,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      amountAfterDiscount: parseFloat(amountAfterDiscount.toFixed(2)),
      taxPercent: taxRate * 100,
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      total: parseFloat(totalAmount.toFixed(2))
    };
  }
}

module.exports = QuotationService;
