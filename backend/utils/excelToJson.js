const XLSX = require('xlsx');
const fs = require('fs');

// Function to convert Excel to JSON
const excelToJson = (filePath) => {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);

    // Get the first sheet name
    const sheetName = workbook.SheetNames[0];

    // Get the sheet data
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet data to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    console.log(jsonData)

    return jsonData;
};


module.exports = excelToJson