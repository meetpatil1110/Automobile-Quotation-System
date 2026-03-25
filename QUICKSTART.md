# Quick Start Guide

## 🚀 Start Both Servers (2 Terminal Windows)

### Terminal 1 - Backend
```bash
cd /Users/meetpatil/Desktop/Quotation/backend
npm start
```
✅ Server will run on: `http://localhost:3000`

### Terminal 2 - Frontend  
```bash
cd /Users/meetpatil/Desktop/Quotation/frontend
npm run dev
```
✅ Open in browser: `http://localhost:5173` (or 5174 if port taken)

## 📊 Using the App

### Step 1: Upload Excel Price List
1. Go to "Upload Price List" section
2. Click "Click to select Excel file"
3. Select `sample_price_list.xlsx` or your own Excel file
4. Click "Upload File"
5. You'll see the price list displayed in the table

### Step 2: Generate Quotation
1. Scroll to "Generate Quotation" form
2. Enter customer name (e.g., "John Doe")
3. Add vehicles:
   - Type vehicle model name (autocomplete will suggest)
   - Set quantity
   - Click "+ Add Vehicle" for more items
4. Set tax rate and discount (optional)
5. Click "Generate Quotation"
6. A modal will show the generated quotation

### Step 3: Print or Save Quotation
1. In the quotation modal, click "📄 Print / Save as PDF"
2. Choose to print or save as PDF from your browser

## 🌐 Access from Another PC on LAN

1. Find your machine's IP address:
   ```bash
   # On Mac
   ifconfig | grep "inet "
   
   # On Windows
   ipconfig
   ```
   Look for something like: `192.168.x.x`

2. From another PC on the same network, open browser and go to:
   ```
   http://192.168.x.x:5173
   ```

## 📁 Sample Excel File

A sample file is included: `sample_price_list.xlsx`

To create your own:
1. Create Excel with columns: Model, Price, Description
2. Add your vehicle data
3. Save as .xlsx
4. Upload using the app

## 🔧 Project Structure

```
Backend (Node.js/Express)
├── server.js - Main server with API endpoints
└── quotationService.js - Quotation logic

Frontend (React)
├── App.jsx - Main component
├── PriceListUpload.jsx - Upload component
├── PriceListDisplay.jsx - Display component
├── QuotationForm.jsx - Quotation form
└── QuotationDisplay.jsx - Quotation view modal
```

## ✨ Features

- ✅ Upload Excel price lists (no code changes needed)
- ✅ Auto-search/autocomplete for vehicle models
- ✅ Calculate totals with tax and discounts
- ✅ Generate professional quotations
- ✅ Print quotations
- ✅ Access from multiple devices on LAN
- ✅ Fully offline - no internet required

## ❓ Troubleshooting

**"Server Connection Failed"**
- Make sure backend is running on Terminal 1

**Can't upload Excel**
- File must be .xlsx or .xls format
- Must have Model and Price columns

**Can't access from another PC**
- Use actual IP address, not localhost
- Make sure both PCs are on same network
- Check firewall settings

**Port already in use**
- Frontend will auto-use next available port (5174, 5175, etc.)
- Check terminal output for correct port

## 📞 API Reference

### Upload Price List
```
POST /api/upload
Body: { file: <Excel file> }
```

### Get Price List
```
GET /api/price-list
```

### Search Vehicles
```
GET /api/vehicles?search=toyota
```

### Generate Quotation
```
POST /api/generate-quotation
Body: {
  customerName: "Name",
  items: [{ modelName: "Model", quantity: 1 }],
  taxRate: 0.05,
  discount: 0
}
```
