// src/main/ipc/borrower/create.ipc.js
const borrowerService = require("../../../../services/Borrower");

module.exports = async (params, queryRunner) => {
  const { data, user = "system" } = params;
  const result = await borrowerService.create(data, user, queryRunner);
  return { status: true, message: "Borrower created", data: result };
};