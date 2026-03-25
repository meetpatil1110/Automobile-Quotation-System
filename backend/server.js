const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const QuotationService = require('./quotationService');

const app = express();

const PORT = 3000;
const HOST = '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, 'price_list.xlsx');
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Only .xlsx and .xls files are allowed'));
    }
  }
});

// Store current price list in memory
let priceList = [];
let quotationService = new QuotationService([]);

// Test route
app.get('/', (req, res) => {
  res.send('Quotation Server Running');
});

// Upload Excel file endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Read the Excel file
    const filePath = path.join(uploadsDir, req.file.filename);
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON - this will use the first row with data as headers
    let data = xlsx.utils.sheet_to_json(worksheet);
    
    console.log(`[UPLOAD] Total rows read: ${data.length}`);
    if (data.length > 0) {
      console.log(`[UPLOAD] First row MODEL:`, data[0].MODEL || 'NOT FOUND');
      console.log(`[UPLOAD] Sample row:`, JSON.stringify(data[0]).substring(0, 150));
    }
    
    // Clean up the data - remove header rows and category labels
    let filteredData = data.filter(item => {
      // Must have a MODEL field
      if (!item.MODEL) return false;
      
      const modelValue = String(item.MODEL).trim();
      
      // Skip empty values
      if (!modelValue || modelValue.length === 0) return false;
      
      // Skip header rows (exact matches)
      if (modelValue === 'MODEL') return false;
      
      // Skip category labels
      if (['SCOOTER', 'MOTORCYCLE', 'CATEGORY'].includes(modelValue.toUpperCase())) {
        return false;
      }
      
      // Skip company/title rows
      const lower = modelValue.toLowerCase();
      if (lower.includes('yash') || lower.includes('price list') || lower.includes('shahada')) {
        return false;
      }
      
      return true;
    });
    
    console.log(`[UPLOAD] After filtering: ${filteredData.length} rows`);
    
    if (filteredData.length === 0) {
      console.log('[UPLOAD] ERROR: No valid vehicle rows found');
      console.log('[UPLOAD] Debug - all MODEL values:', data.map(r => r.MODEL).slice(0, 10));
      return res.status(400).json({ error: 'Excel file is empty or has no valid vehicle rows' });
    }

    priceList = filteredData;
    quotationService.setPriceList(filteredData);
    
    const columns = Object.keys(data[0] || {});
    res.json({
      success: true,
      message: `Uploaded ${filteredData.length} items`,
      itemCount: filteredData.length,
      columns: columns
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get price list endpoint
app.get('/api/price-list', (req, res) => {
  res.json(priceList);
});

// Generate quotation endpoint
app.post('/api/generate-quotation', (req, res) => {
  try {
    const { customerName, items, taxRate, discount, preparedBy } = req.body;

    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({
        error: 'Missing required fields: customerName and items array'
      });
    }

    const quotation = quotationService.generateQuotation(
      customerName,
      items,
      taxRate || 0.05,
      discount || 0,
      preparedBy || ''
    );

    res.json({
      success: true,
      quotation: quotation
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// Get available vehicles for search
app.get('/api/vehicles', (req, res) => {
  try {
    const search = req.query.search || '';
    
    let vehicles = priceList;
    
    if (search) {
      vehicles = priceList.filter(item => {
        // Check for MODEL column (case-insensitive)
        const modelField = Object.keys(item).find(key => key.toUpperCase() === 'MODEL');
        const modelValue = modelField ? item[modelField] : '';
        return modelValue && modelValue.toLowerCase().includes(search.toLowerCase());
      });
    }

    const result = vehicles.map(item => {
      // Find MODEL column (case-insensitive)
      const modelField = Object.keys(item).find(key => key.toUpperCase() === 'MODEL');
      const modelValue = modelField ? item[modelField] : 'Unknown';
      
      // Find price column (try multiple variations)
      let priceValue = 0;
      const priceField = Object.keys(item).find(key => {
        const normalizedKey = key.toUpperCase().trim();
        return normalizedKey === 'ON ROAD' || 
               normalizedKey === 'PRICE' || 
               normalizedKey === 'ON ROAD WITH ASSY.';
      });
      if (priceField) {
        priceValue = parseFloat(item[priceField]) || 0;
      }
      
      return {
        model: modelValue,
        price: priceValue,
        description: ''
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error in /api/vehicles:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`LAN access available at http://<your-machine-ip>:${PORT}`);
});
