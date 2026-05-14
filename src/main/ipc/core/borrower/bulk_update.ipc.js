// src/main/ipc/borrower/bulk_update.ipc.js
const borrowerService = require("../../../../services/Borrower");

module.exports = async (params, queryRunner) => {
  const { updatesArray, user = "system" } = params;
  const result = await borrowerService.bulkUpdate(updatesArray, user, queryRunner);
  return { status: true, message: "Bulk update completed", data: result };
};