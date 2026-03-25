const xlsx = require('xlsx');

// Sample price list data
const priceListData = [
  { Model: 'Toyota Camry', Price: 25000, Description: 'Sedan - 2024' },
  { Model: 'Honda Accord', Price: 28000, Description: 'Sedan - 2024' },
  { Model: 'Ford F-150', Price: 35000, Description: 'Pickup Truck - 2024' },
  { Model: 'Tesla Model 3', Price: 40000, Description: 'Electric - 2024' },
  { Model: 'BMW X5', Price: 55000, Description: 'SUV - 2024' }
];

// Create a new workbook
const workbook = xlsx.utils.book_new();

// Convert data to worksheet
const worksheet = xlsx.utils.json_to_sheet(priceListData);

// Add worksheet to workbook
xlsx.utils.book_append_sheet(workbook, worksheet, 'PriceList');

// Write file
xlsx.writeFile(workbook, 'sample_price_list.xlsx');

console.log('Sample Excel file created: sample_price_list.xlsx');
