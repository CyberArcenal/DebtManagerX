// src/main/ipc/borrower/export.ipc.js
const borrowerService = require("../../../../services/Borrower");

module.exports = async (params) => {
  const { format = "json", filters = {}, user = "system" } = params;
  const exportData = await borrowerService.exportBorrowers(format, filters, user);
  return { status: true, message: "Export completed", data: exportData };
};