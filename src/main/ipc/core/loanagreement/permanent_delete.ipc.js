// src/main/ipc/loanagreement/permanent_delete.ipc.js
const loanAgreementService = require("../../../../services/LoanAgreement");

module.exports = async (params, queryRunner) => {
  const { id, user = "system" } = params;
  await loanAgreementService.permanentlyDelete(id, user, queryRunner);
  return { status: true, message: "Loan agreement permanently deleted", data: null };
};