function setupSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(TAB_NAME) || ss.getSheets()[0];
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["ID", "Timestamp", "Type", "Category", "Amount", "Notes"]);
    
    const headerRange = sheet.getRange(1, 1, 1, 6);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#f3f4f6");
    sheet.setFrozenRows(1);
    
    sheet.getRange("E:E").setNumberFormat("#,##0");
  }
  return "Setup Sheet Berhasil. Silakan lihat Google Sheet Anda.";
}
