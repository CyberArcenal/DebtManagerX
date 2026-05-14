// src/main/ipc/borrower/bulk_create.ipc.js
//@ts-check

const borrowerService = require("../../../../services/Borrower");

module.exports = async (params, queryRunner) => {
  const { borrowersArray, user = "system" } = params;
  const result = await borrowerService.bulkCreate(borrowersArray, user, queryRunner);
  return { status: true, message: "Bulk create completed", data: result };
};