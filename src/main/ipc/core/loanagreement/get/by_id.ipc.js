// src/main/ipc/loanagreement/get/by_id.ipc.js
const loanAgreementService = require("../../../../../services/LoanAgreement");

module.exports = async (params) => {
  const { id, includeDeleted = false } = params;
  const agreement = await loanAgreementService.findById(id, includeDeleted);
  return { status: true, message: "Loan agreement retrieved", data: agreement };
};