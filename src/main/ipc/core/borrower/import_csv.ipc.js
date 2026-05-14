// src/main/ipc/borrower/import_csv.ipc.js
const borrowerService = require("../../../../services/Borrower");

module.exports = async (params, queryRunner) => {
  const { filePath, user = "system" } = params;
  const result = await borrowerService.importFromCSV(filePath, user, queryRunner);
  return { status: true, message: "CSV import completed", data: result };
};