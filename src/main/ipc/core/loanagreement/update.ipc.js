// src/main/ipc/loanagreement/update.ipc.js
const loanAgreementService = require("../../../../services/LoanAgreement");

module.exports = async (params, queryRunner) => {
  const { id, data, user = "system" } = params;
  // data may contain fileBuffer, fileName, removeFile, etc.
  const result = await loanAgreementService.update(id, data, user, queryRunner);
  return { status: true, message: "Loan agreement updated", data: result };
};