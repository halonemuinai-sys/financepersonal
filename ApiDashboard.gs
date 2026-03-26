function getDashboardData() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(TAB_NAME) || ss.getSheets()[0];
    
    const lastRow = sheet.getLastRow();
    
    if (lastRow < 2) {
      return { 
        success: true, 
        transactions: [], 
        summary: { income: 0, salary: 0, allowance: 0, expense: 0, tax: 0, bpjs: 0, otherExpense: 0, balance: 0 } 
      };
    }
    
    const data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
    
    let summary = {
      income: 0, salary: 0, allowance: 0,
      expense: 0, tax: 0, bpjs: 0, otherExpense: 0
    };
    
    let recentTransactions = [];
    
    for (let i = data.length - 1; i >= 0; i--) {
      const row = data[i];
      const type = row[2];
      const category = (row[3] || "").toString().trim();
      const amount = parseFloat(row[4]) || 0;
      
      const catLower = category.toLowerCase();
      
      if (type === 'Income') {
        summary.income += amount;
        if (catLower.includes('gaji')) summary.salary += amount;
        else if (catLower.includes('tunjangan')) summary.allowance += amount;
      } else if (type === 'Expense') {
        summary.expense += amount;
        if (catLower.includes('pajak')) summary.tax += amount;
        else if (catLower.includes('bpjs')) summary.bpjs += amount;
        else summary.otherExpense += amount;
      }
      
      if (recentTransactions.length < 10) {
        recentTransactions.push({
          id: row[0],
          date: Utilities.formatDate(new Date(row[1]), Session.getScriptTimeZone(), "dd MMM yyyy, HH:mm"),
          type: type,
          category: category,
          amount: amount,
          notes: row[5]
        });
      }
    }
    
    summary.balance = summary.income - summary.expense;
    
    return {
      success: true,
      summary: summary,
      transactions: recentTransactions
    };
  } catch (err) {
    return { success: false, message: err.toString() };
  }
}
