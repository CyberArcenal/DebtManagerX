// src/main/ipc/loanagreement/get/all.ipc.js
//@ts-check

const loanAgreementService = require("../../../../../services/LoanAgreement");

module.exports = async (params) => {
  const {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    includeDeleted,
    debtId,
    borrowerId,
    lenderName,
    agreementDateFrom,
    agreementDateTo,
  } = params;
  const options = {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    includeDeleted,
    debtId,
    borrowerId,
    lenderName,
    agreementDateFrom,
    agreementDateTo,
  };
  const agreements = await loanAgreementService.findAll(options);
  return { status: true, message: "Loan agreements retrieved", data: agreements };
};