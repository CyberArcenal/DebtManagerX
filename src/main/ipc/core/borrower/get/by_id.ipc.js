// src/main/ipc/borrower/get/by_id.ipc.js
//@ts-check
const borrowerService = require("../../../../../services/Borrower");

module.exports = async (params) => {
  const { id, includeDeleted = false } = params;
  const borrower = await borrowerService.findById(id, includeDeleted);
  return { status: true, message: "Borrower retrieved", data: borrower };
};