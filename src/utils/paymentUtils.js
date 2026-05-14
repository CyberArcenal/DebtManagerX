// utils/paymentUtils.js

function validatePaymentData(data) {
  const errors = [];
  if (data.amount === undefined || isNaN(parseFloat(data.amount)) || parseFloat(data.amount) <= 0) {
    errors.push("Amount must be a positive number");
  }
  if (!data.paymentDate) {
    errors.push("Payment date is required");
  } else {
    const date = new Date(data.paymentDate);
    if (isNaN(date.getTime())) {
      errors.push("Payment date must be a valid date");
    }
  }
  if (data.reference && typeof data.reference !== "string") {
    errors.push("Reference must be a string");
  }
  if (data.notes && typeof data.notes !== "string") {
    errors.push("Notes must be a string");
  }
  if (!data.debtId || isNaN(parseInt(data.debtId, 10))) {
    errors.push("Debt ID is required and must be a number");
  }
  return { valid: errors.length === 0, errors };
}

module.exports = { validatePaymentData };