// src/main/ipc/loanagreement/create.ipc.js
const loanAgreementService = require("../../../../services/LoanAgreement");

module.exports = async (params, queryRunner) => {
  const { data, user = "system" } = params;
  // data may contain fileBuffer, fileName, etc.
  const result = await loanAgreementService.create(data, user, queryRunner);
  return { status: true, message: "Loan agreement created", data: result };
};