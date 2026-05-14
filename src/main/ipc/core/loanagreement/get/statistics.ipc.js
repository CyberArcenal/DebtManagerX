// src/main/ipc/loanagreement/get/statistics.ipc.js
const loanAgreementService = require("../../../../../services/LoanAgreement");

module.exports = async () => {
  const stats = await loanAgreementService.getStatistics();
  return { status: true, message: "Statistics retrieved", data: stats };
};