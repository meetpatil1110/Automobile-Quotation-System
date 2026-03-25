❌ ERROR ENCOUNTERED: "Connection error: Unexpected token '<'"

═══════════════════════════════════════════════════════════════════════════

🔍 WHAT THIS MEANS

The error "'<', '<!DOCTYPE" indicates the backend is returning HTML instead 
of JSON. This typically means:

1. Price list hasn't been uploaded yet
2. Backend couldn't find the vehicle in the price list
3. CORS or connection issue

═══════════════════════════════════════════════════════════════════════════

✅ SOLUTIONS (TRY IN ORDER)

STEP 1: Upload Price List First
  ───────────────────────────────
  ☐ Don't skip this step!
  ☐ Go to: "Upload Price List" section (above "Generate Quotation")
  ☐ Click: "Click to select Excel file"
  ☐ Select: YASH_Automobiles_PriceList.xlsx
  ☐ Click: "Upload File"
  ☐ Wait for confirmation message
  ☐ See the price table with 33 vehicles below
  
  👉 You MUST see the price table before generating quotations!

STEP 2: Check Backend is Running
  ────────────────────────────────
  Open terminal and run:
    curl http://localhost:3000/
  
  Should return: "Quotation Server Running"
  
  If error, restart backend:
    cd /Users/meetpatil/Desktop/Quotation/backend
    node server.js

STEP 3: Check Frontend Console
  ─────────────────────────────
  1. Open browser DevTools (F12 or Cmd+Option+I)
  2. Go to "Console" tab
  3. Look for any error messages
  4. Check what server is returning
  
  This shows the actual problem!

STEP 4: Verify Network Connection
  ────────────────────────────────
  Open new terminal:
    curl -X GET http://localhost:3000/api/price-list
  
  Should return JSON with vehicle data
  If returns <html>, backend has error

═══════════════════════════════════════════════════════════════════════════

🚨 COMMON CAUSES & FIXES

Issue #1: Price List Not Uploaded
  ─────────────────────────────────
  Symptom: See form but no price table above
  Fix: 
    1. Upload YASH_Automobiles_PriceList.xlsx
    2. Wait for success message
    3. See table with 33 vehicles
    4. Then try quotation

Issue #2: Wrong Server Port
  ──────────────────────────
  Symptom: Backend running on different port
  Check: 
    ps aux | grep node
  
  Fix: Update frontend vite.config.js if needed
    File: /frontend/vite.config.js
    Change target port in proxy section

Issue #3: CORS Issue
  ──────────────────
  Symptom: Request blocked by browser
  Check: Browser console for CORS errors
  Fix: Backend already has CORS enabled
    (cors middleware is active)

Issue #4: Backend Error
  ────────────────────
  Symptom: 500 error in network tab
  Fix:
    1. Check backend console for error messages
    2. Restart backend: node server.js
    3. Check if file uploaded successfully

═══════════════════════════════════════════════════════════════════════════

🔧 DETAILED TROUBLESHOOTING

1. Check if Backend Responds
   ──────────────────────────
   Terminal:
     curl -X GET http://localhost:3000/
   
   Should return: "Quotation Server Running"

2. Check if Price List Loaded
   ──────────────────────────
   Terminal:
     curl -X GET http://localhost:3000/api/price-list
   
   Should return JSON with vehicle data
   
   If empty or error:
     • Upload YASH_Automobiles_PriceList.xlsx first!

3. Check Vehicle Search
   ────────────────────
   Terminal:
     curl -X GET "http://localhost:3000/api/vehicles?search=PLEASURE"
   
   Should return matching vehicles
   
   If empty:
     • Price list not uploaded yet

4. Test Quotation API
   ──────────────────
   Terminal (paste as one line):
     curl -X POST http://localhost:3000/api/generate-quotation \
       -H "Content-Type: application/json" \
       -d '{"customerName":"Test","items":[{"modelName":"PLEASURE+ MCR","quantity":1}],"taxRate":0.05,"discount":0}'
   
   Should return quotation JSON
   
   If error:
     • Check price list is uploaded
     • Check MODEL column exists
     • Check "PLEASURE+ MCR" is exact spelling

═══════════════════════════════════════════════════════════════════════════

📋 STEP-BY-STEP FIX

1. ☐ Ensure both servers running:
     Terminal 1: cd backend && node server.js
     Terminal 2: cd frontend && npm run dev

2. ☐ Open http://localhost:5174 in browser

3. ☐ UPLOAD PRICE LIST FIRST:
     • Scroll to "Upload Price List" section
     • Click "Click to select Excel file"
     • Select YASH_Automobiles_PriceList.xlsx
     • Click "Upload File"
     • Wait for "✓ Uploaded 33 items" message
     • See price table with 33 vehicles

4. ☐ Now generate quotation:
     • Customer Name: Meet Patil
     • Vehicle: PLEASURE+ MCR (type it)
     • Qty: 1
     • Tax: 5%
     • Discount: 0%
     • Click "Generate Quotation"

5. ☐ If still error:
     • Open browser DevTools (F12)
     • Go to "Console" tab
     • Look for error messages
     • Screenshot and check what it says

═══════════════════════════════════════════════════════════════════════════

💻 BROWSER DEVELOPER TOOLS

To see the actual error:

1. Press F12 (Windows) or Cmd+Option+I (Mac)

2. Click "Network" tab

3. In form, click "Generate Quotation"

4. Look for request to "generate-quotation"

5. Click on it and see:
   • Request body (what you sent)
   • Response status (200, 400, 500, etc.)
   • Response body (actual error message)

6. Also check "Console" tab for JavaScript errors

═══════════════════════════════════════════════════════════════════════════

⚠️ IMPORTANT

❌ Don't generate quotation before uploading price list
❌ The form won't work without data in the backend
❌ Check that server is running on localhost:3000

✅ Upload price list FIRST
✅ Wait for confirmation message
✅ See the price table
✅ Then generate quotation

═══════════════════════════════════════════════════════════════════════════

If issue persists:

1. Check browser console (F12) for specific error
2. Check backend terminal for server errors
3. Verify YASH_Automobiles_PriceList.xlsx exists
4. Restart both servers
5. Try uploading file again
6. Test with sample_price_list.xlsx if YASH fails

═══════════════════════════════════════════════════════════════════════════
