// src/main/ipc/debt/bulk_create.ipc.js
//@ts-check

const debtService = require("../../../../services/Debt");


module.exports = async (params, queryRunner) => {
  const { debtsArray, user = "system" } = params;
  const result = await debtService.bulkCreate(debtsArray, user, queryRunner);
  return { status: true, message: "Bulk create completed", data: result };
};