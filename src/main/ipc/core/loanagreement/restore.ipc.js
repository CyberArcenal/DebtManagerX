// src/main/ipc/loanagreement/restore.ipc.js
const loanAgreementService = require("../../../../services/LoanAgreement");

module.exports = async (params, queryRunner) => {
  const { id, user = "system" } = params;
  const result = await loanAgreementService.restore(id, user, queryRunner);
  return { status: true, message: "Loan agreement restored", data: result };
};