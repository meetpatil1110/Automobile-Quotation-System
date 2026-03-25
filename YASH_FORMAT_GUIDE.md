# YASH Automobiles Price List Format

## Overview

Your system now supports the YASH Automobiles detailed pricing format with multiple price breakdowns including:
- Ex Showroom Rate (EX S/R)
- Road Tax (RTO)
- Insurance (INSU)
- Incidental & Admin Charges
- Helmet cost
- On Road pricing
- Glass/Other components
- Standard Assembly Kit
- On Road with Assembly

## File Included

**File:** `YASH_Automobiles_PriceList.xlsx`

Contains 33 vehicles:
- 10 Scooter models
- 23 Motorcycle models

## Excel Format

### Required Columns

The Excel file must have a **MODEL** column. Other columns are flexible and will be displayed in the price list table.

### Column Names Used in YASH Format

| Column | Description | Example |
|--------|-------------|---------|
| MODEL | Vehicle model name | PLEASURE+ MCR |
| EX S/R | Ex Showroom Rate | 68401 |
| RTO | Road Tax | 8816 |
| INSU | Insurance | 7488 |
| INCIDENTAL & ADMIN CHARGES | Additional charges | 1500 |
| HELMET | Helmet cost | 1500 |
| ON ROAD | Final on-road price | 87705 |
| GL | Glass/Other component | 299 |
| STD ASSY KIT | Standard Assembly Kit cost | 4600 |
| ON ROAD WITH ASSY. | On-road price with assembly | 92604 |

## How It Works

### Upload Price List
1. Open the app: `http://localhost:5174`
2. Go to "Upload Price List" section
3. Select `YASH_Automobiles_PriceList.xlsx`
4. Click "Upload File"
5. See all columns automatically displayed in the table

### View Price List
- All uploaded columns are shown in a scrollable table
- Model names are highlighted in blue
- Numbers are formatted with thousand separators
- Table has sticky headers for easy scrolling
- Shows total item count

### Generate Quotation
1. Fill in customer name
2. Start typing a vehicle model (autocomplete will suggest matching models)
3. The system searches for the MODEL column match
4. Quotation uses the **ON ROAD** or **ON ROAD WITH ASSY.** price (depending on backend logic)
5. Add multiple vehicles as needed
6. Set tax rate and discount
7. Click "Generate Quotation"

## Key Features for Multi-Column Prices

✅ **Dynamic Column Display** - Any Excel file with a MODEL column will work
✅ **Flexible Pricing** - Use any column for quotation calculations
✅ **Number Formatting** - Prices displayed with thousand separators
✅ **Searchable** - Vehicle models auto-searched from any format
✅ **Printable** - All columns visible before printing

## Customizing Price Column

To change which column is used for quotations, edit `quotationService.js`:

```javascript
// Find the vehicle
const vehicle = this.findVehicle(item.modelName);

// Change from Price to ON ROAD (or any column)
const unitPrice = parseFloat(vehicle['ON ROAD']) || 0;
```

## Supported Formats

Your Excel file can have any columns as long as:
- **First row contains headers**
- **MODEL column exists** (exact spelling: MODEL)
- **Other columns contain numeric or text data**

Examples of compatible files:
- Simple: MODEL, Price
- Detailed: MODEL, EX S/R, RTO, INSU, etc. (like YASH)
- Custom: MODEL, Cost, Tax, Discount, etc.

## Adding Your Own Price List

To create your own YASH-compatible file:

1. **Open Excel or LibreOffice Calc**
2. **Create columns:**
   - Column A: MODEL (vehicle names)
   - Columns B-J: Pricing breakdowns
3. **Add your data:**
   - Row 1: Headers
   - Rows 2+: Vehicle data
4. **Save as .xlsx**
5. **Upload through the app**

### Example Structure

```
| MODEL          | EX S/R | RTO   | ON ROAD |
|----------------|--------|-------|---------|
| PLEASURE+ MCR  | 68401  | 8816  | 87705   |
| HF DELUXE DRS  | 63037  | 7568  | 80967   |
```

## Using the YASH File

### Quick Start
```bash
# 1. Open frontend
# 2. Click "Upload Price List"
# 3. Select: YASH_Automobiles_PriceList.xlsx
# 4. Click "Upload File"
# 5. View the 33 vehicles in the table
# 6. Generate quotations with autocomplete search
```

### Example Quotation
- Customer: Sharma Motors
- Vehicle 1: PLEASURE+ MCR (Qty: 5)
- Vehicle 2: HF DELUXE DRS (Qty: 3)
- Tax: 5%
- Discount: 10%
- Result: Professional quotation with all breakdown details

## Column Widths & Scrolling

The price list table:
- **Horizontal scrolling** - View all columns
- **Vertical scrolling** - View up to 500px height
- **Sticky headers** - Headers stay visible when scrolling
- **Responsive** - Adjusts font size on mobile devices
- **Formatte numbers** - 68401 displays as "68,401"

## Notes

- Vehicle search is **case-insensitive**
- Partial matches work: typing "PLEASURE" finds "PLEASURE+ MCR"
- Numbers are formatted for readability
- Quotations use the vehicle model and selected price
- All 10 columns can be printed in quotation if needed

## File Generator

Script included: `create_yash_pricelist.js`
- Automatically generates the YASH format file
- Contains complete 33-vehicle list
- Can be modified to create custom lists

Run it:
```bash
node create_yash_pricelist.js
```

This creates: `YASH_Automobiles_PriceList.xlsx`
