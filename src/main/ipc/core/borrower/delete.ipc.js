// src/main/ipc/borrower/delete.ipc.js
const borrowerService = require("../../../../services/Borrower");

module.exports = async (params, queryRunner) => {
  const { id, user = "system" } = params;
  const result = await borrowerService.delete(id, user, queryRunner);
  return { status: true, message: "Borrower soft deleted", data: result };
};