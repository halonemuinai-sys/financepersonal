function getDashboardData() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(TAB_NAME) || ss.getSheets()[0];
    
    const lastRow = sheet.getLastRow();
    
    if (lastRow < 2) {
      return { 
        success: true, 
        transactions: [], 
        summary: { income: 0, expense: 0, balance: 0 } 
      };
    }
    
    const data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
    
    let totalIncome = 0;
    let totalExpense = 0;
    let recentTransactions = [];
    
    for (let i = data.length - 1; i >= 0; i--) {
      const row = data[i];
      const type = row[2];
      const amount = parseFloat(row[4]) || 0;
      
      if (type === 'Income') totalIncome += amount;
      if (type === 'Expense') totalExpense += amount;
      
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
