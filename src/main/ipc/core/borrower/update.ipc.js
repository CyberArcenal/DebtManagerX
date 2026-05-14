// src/main/ipc/borrower/update.ipc.js
const borrowerService = require("../../../../services/Borrower");

module.exports = async (params, queryRunner) => {
  const { id, data, user = "system" } = params;
  const result = await borrowerService.update(id, data, user, queryRunner);
  return { status: true, message: "Borrower updated", data: result };
};