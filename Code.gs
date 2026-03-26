const SHEET_ID = '1axSVE8Lat8My1EZ3vUTLyZaUKXF2VcX0ID0qQ2ZrlfA';
const TAB_NAME = 'Sheet1'; // Default, ubah jika nama sheet berbeda

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Personal Finance Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Jalankan ini sekali saja di editor Apps Script untuk setup header di Google Sheet
function setupSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(TAB_NAME) || ss.getSheets()[0];
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["ID", "Timestamp", "Type", "Category", "Amount", "Notes"]);
    
    // Memberikan styling dasar untuk header
    const headerRange = sheet.getRange(1, 1, 1, 6);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#f3f4f6");
    sheet.setFrozenRows(1);
    
    // Format kolom Amount menjadi angka/currency
    sheet.getRange("E:E").setNumberFormat("#,##0");
  }
  return "Setup Sheet Berhasil. Silakan lihat Google Sheet Anda.";
}

function addTransaction(data) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(TAB_NAME) || ss.getSheets()[0];
    
    // Validasi sederhana
    if (!data.type || !data.amount || !data.category) {
      throw new Error("Terdapat field wajib yang kosong!");
    }
    
    const id = Utilities.getUuid();
    const timestamp = new Date();
    
    // Simpan data ke baris paling bawah
    sheet.appendRow([
      id,
      timestamp,
      data.type,      // "Income" atau "Expense"
      data.category,
      parseFloat(data.amount),
      data.notes || ""
    ]);
    
    return { success: true, message: "Transaksi berhasil ditambahkan." };
  } catch (err) {
    return { success: false, message: err.toString() };
  }
}

function getDashboardData() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(TAB_NAME) || ss.getSheets()[0];
    
    const lastRow = sheet.getLastRow();
    
    // Jika hanya ada header
    if (lastRow < 2) {
      return { 
        success: true, 
        transactions: [], 
        summary: { income: 0, expense: 0, balance: 0 } 
      };
    }
    
    // Ambil semua data kecuali header
    const data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
    
    let totalIncome = 0;
    let totalExpense = 0;
    let recentTransactions = [];
    
    // Baca dari baris terbawah (data terbaru) ke atas
    for (let i = data.length - 1; i >= 0; i--) {
      const row = data[i];
      const type = row[2];
      const amount = parseFloat(row[4]) || 0;
      
      if (type === 'Income') totalIncome += amount;
      if (type === 'Expense') totalExpense += amount;
      
      // Ambil maksimal 10 transaksi terbaru untuk tabel history
      if (recentTransactions.length < 10) {
        recentTransactions.push({
          id: row[0],
          date: Utilities.formatDate(new Date(row[1]), Session.getScriptTimeZone(), "dd MMM yyyy, HH:mm"),
          type: type,
          category: row[3],
          amount: amount,
          notes: row[5]
        });
      }
    }
    
    return {
      success: true,
      summary: {
        income: totalIncome,
        expense: totalExpense,
        balance: totalIncome - totalExpense
      },
      transactions: recentTransactions
    };
  } catch (err) {
    return { success: false, message: err.toString() };
  }
}