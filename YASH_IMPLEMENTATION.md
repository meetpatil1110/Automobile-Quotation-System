# YASH Automobiles Format - Implementation Guide

## ✅ What's New

Your quotation system now fully supports the YASH Automobiles detailed pricing format!

### Files Ready to Use

**1. YASH_Automobiles_PriceList.xlsx** (25 KB)
   - 33 complete vehicle models
   - 10 columns of pricing details
   - Ready to upload and use

**2. sample_price_list.xlsx** (16 KB)
   - Original simple format
   - 5 vehicles for testing
   - Still works perfectly

## 📊 YASH Format Details

### Columns in YASH File

```
MODEL | EX S/R | RTO | INSU | INCIDENTAL & ADMIN CHARGES | HELMET | ON ROAD | GL | STD ASSY KIT | ON ROAD WITH ASSY.
```

**What each means:**
- **MODEL** - Vehicle name (e.g., "PLEASURE+ MCR")
- **EX S/R** - Ex-Showroom Rate (base price)
- **RTO** - Road Tax
- **INSU** - Insurance cost
- **INCIDENTAL & ADMIN CHARGES** - Additional charges
- **HELMET** - Helmet cost
- **ON ROAD** - Final on-road price without assembly
- **GL** - Glass or other component cost
- **STD ASSY KIT** - Standard assembly kit cost
- **ON ROAD WITH ASSY.** - Final price with assembly

### Sample Data Structure

```
PLEASURE+ MCR          | 68401 | 8816 | 7488 | 1500 | 1500 | 87705  | 299 | 4600  | 92604
PLEASURE+ XTEC DRZ     | 77454 | 9837 | 7703 | 1500 | 1500 | 97994  | 299 | 4600  | 102893
HF DELUXE DRS          | 63037 | 7568 | 7362 | 1500 | 1500 | 80967  | 299 | 2100  | 83366
...and 30 more vehicles
```

## 🚀 How to Use

### Step 1: Upload YASH File
```
1. Visit: http://localhost:5174
2. Section: "Upload Price List"
3. Click: "Click to select Excel file"
4. Select: YASH_Automobiles_PriceList.xlsx
5. Click: "Upload File"
```

✅ Result: All 33 vehicles loaded with all 10 columns visible

### Step 2: View Price Table
- Scroll horizontally to see all columns
- Scroll vertically to browse vehicles
- Model names highlighted in blue
- Numbers formatted with commas

### Step 3: Generate Quotation
```
1. Customer Name: (e.g., "ABC Motors")
2. Add Vehicles:
   - Type: "PLEASURE" (autocomplete shows matches)
   - Select: "PLEASURE+ MCR"
   - Qty: 5
3. Add more vehicles as needed
4. Set Tax: 5% (default)
5. Set Discount: 10% (optional)
6. Click: "Generate Quotation"
```

### Step 4: View & Print
- Modal shows professional quotation
- All calculations done automatically
- Click: "📄 Print / Save as PDF"
- Print or save as PDF from browser

## 🎯 Key Features

✅ **All Columns Displayed** - Every Excel column visible in table
✅ **Dynamic Search** - Type "PLEASURE" to find all PLEASURE models
✅ **Automatic Formatting** - Numbers show as 68,401 (with commas)
✅ **Flexible Pricing** - Can use any column for quotations
✅ **Scrollable Table** - Handles many columns & rows
✅ **Mobile Friendly** - Works on phones and tablets
✅ **Print Ready** - Professional quotation format

## 📁 Files Structure

```
/Quotation/
├── YASH_Automobiles_PriceList.xlsx  ← Use this for full list
├── sample_price_list.xlsx            ← Use this for testing
├── YASH_FORMAT_GUIDE.md              ← Detailed documentation
├── backend/
│   ├── server.js (handles any Excel format)
│   └── quotationService.js (flexible pricing logic)
└── frontend/
    ├── PriceListDisplay.jsx (auto-detects columns)
    └── QuotationDisplay.jsx (clean quotation format)
```

## 🔧 How It Works (Technical)

### Excel Upload Process
```
1. Upload Excel file
2. Backend reads all sheets
3. First sheet converted to JSON
4. Column names extracted: MODEL, EX S/R, RTO, INSU...
5. Stored in memory
6. All columns displayed in frontend table
```

### Quotation Generation
```
1. User selects vehicle: "PLEASURE+ MCR"
2. System searches for "PLEASURE+ MCR" in MODEL column
3. Finds matching row with all data
4. Uses "ON ROAD" price as unit price (configurable)
5. Calculates: unitPrice × quantity
6. Applies tax and discount
7. Shows professional quotation
```

### Search Feature
```
User types: "HF DEL"
System finds: "HF DELUXE DRS", "HF DELUXE BLA", "HF DELUXE I3S"
Autocomplete suggests all matches
User selects one
```

## 📋 Vehicle Categories

### SCOOTERS (10 vehicles)
- PLEASURE+ MCR
- PLEASURE+ XTEC DRZ
- PLEASURE+ XTEC HBZ JVL
- DESTINY PRIME
- DESTINI 110 VX / ZX
- DESTINI 125 VX / ZX / ZX+
- XOOM 125 ZX

### MOTORCYCLES (23 vehicles)
- HF DELUXE (various: DRS, BLA, I3S, PRO)
- SPLENDOR (various models)
- PASSION (various models)
- SUPER XTECH (DRS, DSS)
- GLAMOUR (X DRS, X DSS, DRS, DSS)
- XTREME (125R IBS, 125R ABS, 125R ABS LCD)
- XPULSE 200 T
- XTREME 160 R

## 💡 Customization Options

### To Change Price Column
Edit `/backend/quotationService.js`:
```javascript
// Current: uses "ON ROAD"
const unitPrice = parseFloat(vehicle['ON ROAD']) || 0;

// Change to ON ROAD WITH ASSY:
const unitPrice = parseFloat(vehicle['ON ROAD WITH ASSY.']) || 0;

// Or use EX S/R:
const unitPrice = parseFloat(vehicle['EX S/R']) || 0;
```

### To Add More Vehicles
1. Open YASH_Automobiles_PriceList.xlsx
2. Add new rows with vehicle data
3. Keep MODEL column same
4. Add prices for other columns
5. Save and upload
6. All new vehicles instantly available

### To Create Custom Price List
Run the generator script:
```bash
node create_yash_pricelist.js
```

Or create your own Excel with format:
```
Row 1: MODEL | Price1 | Price2 | Price3...
Row 2: Vehicle Name | 50000 | 5000 | 55000...
...
```

## 🎓 Example Quotation

**Customer:** Sharma Motors  
**Date:** 2026-01-03  
**Quotation ID:** QT-1234567890

| Vehicle Model | Unit Price | Qty | Subtotal |
|---|---|---|---|
| PLEASURE+ MCR | 87,705 | 5 | 438,525 |
| HF DELUXE DRS | 80,967 | 3 | 242,901 |

**Calculations:**
- Subtotal: 681,426
- Discount (10%): -68,143
- After Discount: 613,283
- Tax (5%): 30,664
- **GRAND TOTAL: 643,947**

All numbers formatted with commas and decimals!

## ✨ Advanced Features

✅ **Multiple File Uploads** - Replace price list anytime
✅ **No Code Changes** - Just upload new Excel
✅ **Flexible Columns** - Works with any column structure
✅ **Dynamic Search** - Case-insensitive model search
✅ **Professional Output** - Print-ready quotations
✅ **Mobile Responsive** - Works on all devices
✅ **Offline Capable** - No internet required

## 🚀 Ready to Use!

Your system is now fully configured for:
- YASH Automobiles pricing format
- Any custom Excel format
- Multiple vehicles per quotation
- Professional quotation generation
- LAN-wide access

**Next step:** Upload the YASH file and start generating quotations!

## 📞 Support

For format questions, see: `YASH_FORMAT_GUIDE.md`
For technical details, see: `README.md`
For quick start, see: `QUICKSTART.md`
