// utils/debtUtils.js

function validateDebtData(data) {
  const errors = [];
  if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
    errors.push("Debt name is required");
  }
  if (data.totalAmount === undefined || isNaN(parseFloat(data.totalAmount)) || parseFloat(data.totalAmount) <= 0) {
    errors.push("Total amount must be a positive number");
  }
  if (data.paidAmount !== undefined && (isNaN(parseFloat(data.paidAmount)) || parseFloat(data.paidAmount) < 0)) {
    errors.push("Paid amount must be a non-negative number");
  }
  if (!data.dueDate) {
    errors.push("Due date is required");
  } else {
    const date = new Date(data.dueDate);
    if (isNaN(date.getTime())) {
      errors.push("Due date must be a valid date");
    }
  }
  if (data.status && !["active", "paid", "overdue", "defaulted"].includes(data.status)) {
    errors.push("Status must be one of: active, paid, overdue, defaulted");
  }
  if (data.interestRate !== undefined && (isNaN(parseFloat(data.interestRate)) || parseFloat(data.interestRate) < 0)) {
    errors.push("Interest rate must be a non-negative number");
  }
  if (data.penaltyRate !== undefined && (isNaN(parseFloat(data.penaltyRate)) || parseFloat(data.penaltyRate) < 0)) {
    errors.push("Penalty rate must be a non-negative number");
  }
  if (!data.borrowerId || isNaN(parseInt(data.borrowerId, 10))) {
    errors.push("Borrower ID is required and must be a number");
  }
  return { valid: errors.length === 0, errors };
}

module.exports = { validateDebtData };