// utils/penaltyUtils.js

function validatePenaltyData(data) {
  const errors = [];
  if (data.amount === undefined || isNaN(parseFloat(data.amount)) || parseFloat(data.amount) <= 0) {
    errors.push("Amount must be a positive number");
  }
  if (!data.penaltyDate) {
    errors.push("Penalty date is required");
  } else {
    const date = new Date(data.penaltyDate);
    if (isNaN(date.getTime())) {
      errors.push("Penalty date must be a valid date");
    }
  }
  if (data.reason && typeof data.reason !== "string") {
    errors.push("Reason must be a string");
  }
  if (!data.debtId || isNaN(parseInt(data.debtId, 10))) {
    errors.push("Debt ID is required and must be a number");
  }
  return { valid: errors.length === 0, errors };
}

module.exports = { validatePenaltyData };