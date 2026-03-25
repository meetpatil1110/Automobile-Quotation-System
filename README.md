# Automobile Quotation System - LAN Version

A complete offline, Local Area Network (LAN) hosted automobile quotation web application built with Node.js + Express (Backend) and React (Frontend).

## Features

- ✅ **Fully Offline**: Works completely on LAN with no cloud services
- ✅ **Excel Price List**: Upload and manage vehicle pricing via Excel files
- ✅ **Dynamic Quotation Generation**: Create professional quotations with tax and discount calculations
- ✅ **Multi-Device Access**: Access from multiple PCs on the same network via browser
- ✅ **Print/Save as PDF**: Generate and save quotations as documents
- ✅ **No Authentication Required**: Simple, beginner-friendly setup
- ✅ **Real-time Price Updates**: Upload new price lists without restarting

## Project Structure

```
Quotation/
├── backend/
│   ├── server.js                 # Express server with API endpoints
│   ├── quotationService.js       # Quotation generation logic
│   ├── package.json              # Node dependencies
│   ├── uploads/                  # Excel files storage (auto-created)
│   └── node_modules/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main React component
│   │   ├── App.css               # App styles
│   │   ├── PriceListUpload.jsx   # Upload Excel files
│   │   ├── PriceListUpload.css   # Upload styles
│   │   ├── PriceListDisplay.jsx  # Display price list table
│   │   ├── PriceListDisplay.css  # Table styles
│   │   ├── QuotationForm.jsx     # Generate quotations
│   │   ├── QuotationForm.css     # Form styles
│   │   ├── QuotationDisplay.jsx  # Show quotation modal
│   │   ├── QuotationDisplay.css  # Modal styles
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── vite.config.js            # Vite configuration
│   ├── index.html                # HTML template
│   ├── package.json              # React dependencies
│   └── node_modules/
│
├── sample_price_list.xlsx        # Example Excel file for testing
└── create_sample_excel.js        # Script to generate sample files
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Navigate to project directory:**
   ```bash
   cd /Users/meetpatil/Desktop/Quotation
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Backend runs on: `http://localhost:3000`

3. **Frontend Setup (in new terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173` (or `http://localhost:5174` if port 5173 is in use)

## API Endpoints

### 1. Upload Excel File
```
POST /api/upload
Content-Type: multipart/form-data
Body: { file: <xlsx file> }

Response: {
  success: true,
  message: "Uploaded X items",
  itemCount: X,
  columns: ["Model", "Price", "Description"]
}
```

### 2. Get Price List
```
GET /api/price-list

Response: [
  { Model: "Toyota Camry", Price: 25000, Description: "Sedan - 2024" },
  ...
]
```

### 3. Search Vehicles
```
GET /api/vehicles?search=toyota

Response: [
  { model: "Toyota Camry", price: 25000, description: "Sedan - 2024" },
  ...
]
```

### 4. Generate Quotation
```
POST /api/generate-quotation
Content-Type: application/json
Body: {
  customerName: "John Doe",
  items: [
    { modelName: "Toyota Camry", quantity: 2 },
    { modelName: "Honda Accord", quantity: 1 }
  ],
  taxRate: 0.05,
  discount: 10
}

Response: {
  success: true,
  quotation: {
    quotationId: "QT-1234567890",
    quotationDate: "2024-01-03",
    customerName: "John Doe",
    items: [
      {
        model: "Toyota Camry",
        description: "Sedan - 2024",
        unitPrice: 25000,
        quantity: 2,
        subtotal: 50000
      },
      ...
    ],
    subtotal: 78000,
    discountPercent: 10,
    discountAmount: 7800,
    amountAfterDiscount: 70200,
    taxPercent: 5,
    taxAmount: 3510,
    total: 73710
  }
}
```

## Excel File Format

Your Excel file should have the following structure:

| Model | Price | Description |
|-------|-------|-------------|
| Toyota Camry | 25000 | Sedan - 2024 |
| Honda Accord | 28000 | Sedan - 2024 |
| Ford F-150 | 35000 | Pickup Truck - 2024 |

**Requirements:**
- First row contains column headers (Model, Price, Description)
- Model column: Required (vehicle name)
- Price column: Required (numeric value)
- Description column: Optional (additional details)
- File format: .xlsx or .xls

## Usage

1. **Upload Price List:**
   - Click "Upload Price List" section
   - Select your Excel file (sample_price_list.xlsx provided)
   - View the uploaded data in the table below

2. **Generate Quotation:**
   - Fill in customer name
   - Add vehicles by typing model name (autocomplete available)
   - Set quantity for each vehicle
   - Adjust tax rate and discount if needed
   - Click "Generate Quotation"
   - View and print the generated quotation

3. **Access from LAN:**
   - Find your machine's local IP: `ifconfig` or `ipconfig`
   - Access from other PC: `http://<your-ip>:5173`

## Network Access

### From Your Machine
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

### From Other PCs on LAN
- Find your machine IP (e.g., 192.168.x.x)
- Frontend: `http://192.168.x.x:5173`
- Backend API: `http://192.168.x.x:3000`

## Troubleshooting

### Port Already in Use
If port 5173 is busy, Vite will use 5174 or the next available port. The terminal output shows which port is being used.

### Can't Connect from LAN
1. Check firewall settings - allow Node.js through firewall
2. Verify both machines are on same network
3. Use actual IP address (not localhost) from other PC

### Excel Upload Fails
1. File must be .xlsx or .xls format
2. First row must contain column headers
3. Model and Price columns are required

## Sample Data

A sample Excel file (`sample_price_list.xlsx`) is included with 5 test vehicles:
- Toyota Camry: $25,000
- Honda Accord: $28,000
- Ford F-150: $35,000
- Tesla Model 3: $40,000
- BMW X5: $55,000

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Multer** - File upload handling
- **XLSX** - Excel file processing
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling

## Features to Add

Potential enhancements:
- Customer management
- Quotation history/archive
- Email quotations
- Invoice generation
- User authentication
- Multiple price lists
- Bulk operations

## License

ISC

## Notes

- No database required - uses in-memory storage
- All data is stored locally on the server
- Uploads are stored in `/backend/uploads` folder
- Each new file upload replaces the previous price list
