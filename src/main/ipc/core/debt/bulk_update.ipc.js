// src/main/ipc/debt/bulk_update.ipc.js
const debtService = require("../../../../services/Debt");

module.exports = async (params, queryRunner) => {
  const { updatesArray, user = "system" } = params;
  const result = await debtService.bulkUpdate(updatesArray, user, queryRunner);
  return { status: true, message: "Bulk update completed", data: result };
};