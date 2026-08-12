const xlsx = require('xlsx');
const fs = require('fs');
const wb = xlsx.readFile('d:\\undangan\\TaskList_SaaS_Undangan_Digital.xlsx');
const csv = xlsx.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
fs.writeFileSync('d:\\undangan\\output.csv', csv, 'utf8');
