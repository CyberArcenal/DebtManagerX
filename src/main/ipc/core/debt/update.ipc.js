// src/main/ipc/debt/update.ipc.js
const debtService = require("../../../../services/Debt");

module.exports = async (params, queryRunner) => {
  const { id, data, user = "system" } = params;
  const result = await debtService.update(id, data, user, queryRunner);
  return { status: true, message: "Debt updated", data: result };
};