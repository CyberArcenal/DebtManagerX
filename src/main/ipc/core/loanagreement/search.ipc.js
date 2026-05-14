// src/main/ipc/loanagreement/search.ipc.js
const loanAgreementService = require("../../../../services/LoanAgreement");

module.exports = async (params) => {
  const { searchTerm, page, limit, debtId, lenderName } = params;
  const options = {
    search: searchTerm,
    page,
    limit,
    debtId,
    lenderName,
  };
  const agreements = await loanAgreementService.findAll(options);
  return { status: true, message: "Search completed", data: agreements };
};