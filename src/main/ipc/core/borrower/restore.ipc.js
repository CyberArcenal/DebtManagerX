// src/main/ipc/borrower/restore.ipc.js
const borrowerService = require("../../../../services/Borrower");

module.exports = async (params, queryRunner) => {
  const { id, user = "system" } = params;
  const result = await borrowerService.restore(id, user, queryRunner);
  return { status: true, message: "Borrower restored", data: result };
};