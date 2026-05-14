// src/main/ipc/borrower/get/all.ipc.js
//@ts-check

const borrowerService = require("../../../../../services/Borrower");

module.exports = async (params) => {
  const { page, limit, search, sortBy, sortOrder, includeDeleted, ...filters } = params;
  const options = { page, limit, search, sortBy, sortOrder, includeDeleted, ...filters };
  const borrowers = await borrowerService.findAll(options);
  return { status: true, message: "Borrowers retrieved", data: borrowers };
};