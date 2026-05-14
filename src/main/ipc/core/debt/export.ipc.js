// src/main/ipc/debt/export.ipc.js
const debtService = require("../../../../services/Debt");

module.exports = async (params) => {
  const { format = "json", filters = {}, user = "system" } = params;
  const exportData = await debtService.exportDebts(format, filters, user);
  return { status: true, message: "Export completed", data: exportData };
};