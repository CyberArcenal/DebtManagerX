// src/main/ipc/debt/recalculate_remaining.ipc.js
const debtService = require("../../../../services/Debt");

module.exports = async (params, queryRunner) => {
  const { id, user = "system" } = params;
  const result = await debtService.recalculateRemainingAmount(id, user, queryRunner);
  return { status: true, message: "Remaining amount recalculated", data: result };
};