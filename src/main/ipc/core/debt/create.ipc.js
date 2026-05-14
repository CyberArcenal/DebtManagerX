// src/main/ipc/debt/create.ipc.js
const debtService = require("../../../../services/Debt");

module.exports = async (params, queryRunner) => {
  const { data, user = "system" } = params;
  const result = await debtService.create(data, user, queryRunner);
  return { status: true, message: "Debt created", data: result };
};