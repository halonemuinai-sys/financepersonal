function addTransaction(data) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(TAB_NAME) || ss.getSheets()[0];
    
    if (!data.type || !data.amount || !data.category) {
      throw new Error("Terdapat field wajib yang kosong!");
    }
    
    const id = Utilities.getUuid();
    const timestamp = new Date();
    
    sheet.appendRow([
      id,
      timestamp,
      data.type,
      data.category,
      parseFloat(data.amount),
      data.notes || ""
    ]);
    
    return { success: true, message: "Transaksi berhasil ditambahkan." };
  } catch (err) {
    return { success: false, message: err.toString() };
  }
}
