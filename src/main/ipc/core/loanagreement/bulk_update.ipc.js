// src/main/ipc/loanagreement/bulk_update.ipc.js
const loanAgreementService = require("../../../../services/LoanAgreement");

module.exports = async (params, queryRunner) => {
  const { updatesArray, user = "system" } = params;
  const result = await loanAgreementService.bulkUpdate(updatesArray, user, queryRunner);
  return { status: true, message: "Bulk update completed", data: result };
};