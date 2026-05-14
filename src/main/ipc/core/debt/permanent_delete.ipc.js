// src/main/ipc/debt/permanent_delete.ipc.js
const debtService = require("../../../../services/Debt");

module.exports = async (params, queryRunner) => {
  const { id, user = "system" } = params;
  await debtService.permanentlyDelete(id, user, queryRunner);
  return { status: true, message: "Debt permanently deleted", data: null };
};