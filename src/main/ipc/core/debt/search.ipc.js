// src/main/ipc/debt/search.ipc.js
const debtService = require("../../../../services/Debt");

module.exports = async (params) => {
  const { searchTerm, page, limit, status, borrowerId } = params;
  const options = {
    search: searchTerm,
    page,
    limit,
    status,
    borrowerId,
  };
  const debts = await debtService.findAll(options);
  return { status: true, message: "Search completed", data: debts };
};