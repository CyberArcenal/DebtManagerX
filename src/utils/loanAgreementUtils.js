// utils/loanAgreementUtils.js

function validateLoanAgreementData(data) {
  const errors = [];
  if (data.agreementDate && isNaN(new Date(data.agreementDate).getTime())) {
    errors.push("Agreement date must be a valid date");
  }
  if (data.lenderName && typeof data.lenderName !== "string") {
    errors.push("Lender name must be a string");
  }
  if (data.termsText && typeof data.termsText !== "string") {
    errors.push("Terms text must be a string");
  }
  if (!data.debtId || isNaN(parseInt(data.debtId, 10))) {
    errors.push("Debt ID is required and must be a number");
  }
  return { valid: errors.length === 0, errors };
}

module.exports = { validateLoanAgreementData };