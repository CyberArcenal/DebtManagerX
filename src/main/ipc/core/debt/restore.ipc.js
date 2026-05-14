// src/main/ipc/debt/restore.ipc.js
const debtService = require("../../../../services/Debt");

module.exports = async (params, queryRunner) => {
  const { id, user = "system" } = params;
  const result = await debtService.restore(id, user, queryRunner);
  return { status: true, message: "Debt restored", data: result };
};