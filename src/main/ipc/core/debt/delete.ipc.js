// src/main/ipc/debt/delete.ipc.js
const debtService = require("../../../../services/Debt");

module.exports = async (params, queryRunner) => {
  const { id, user = "system" } = params;
  const result = await debtService.delete(id, user, queryRunner);
  return { status: true, message: "Debt soft deleted", data: result };
};