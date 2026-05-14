// src/main/ipc/loanagreement/bulk_create.ipc.js
//@ts-check

const loanAgreementService = require("../../../../services/LoanAgreement");


module.exports = async (params, queryRunner) => {
  const { agreementsArray, user = "system" } = params;
  const result = await loanAgreementService.bulkCreate(agreementsArray, user, queryRunner);
  return { status: true, message: "Bulk create completed", data: result };
};