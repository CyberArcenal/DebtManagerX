// src/main/ipc/borrower/permanent_delete.ipc.js
const borrowerService = require("../../../../services/Borrower");

module.exports = async (params, queryRunner) => {
  const { id, user = "system" } = params;
  await borrowerService.permanentlyDelete(id, user, queryRunner);
  return { status: true, message: "Borrower permanently deleted", data: null };
};