// src/main/ipc/debt/get/by_id.ipc.js
const debtService = require("../../../../../services/Debt");

module.exports = async (params) => {
  const { id, includeDeleted = false } = params;
  const debt = await debtService.findById(id, includeDeleted);
  return { status: true, message: "Debt retrieved", data: debt };
};