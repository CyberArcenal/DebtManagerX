// src/main/ipc/loanagreement/delete.ipc.js
const loanAgreementService = require("../../../../services/LoanAgreement");

module.exports = async (params, queryRunner) => {
  const { id, user = "system" } = params;
  const result = await loanAgreementService.delete(id, user, queryRunner);
  return { status: true, message: "Loan agreement soft deleted", data: result };
};