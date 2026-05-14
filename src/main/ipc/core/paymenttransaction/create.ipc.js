// src/main/ipc/paymenttransaction/create.ipc.js
const paymentTransactionService = require("../../../../services/PaymentTransaction");

module.exports = async (params, queryRunner) => {
  const { data, user = "system" } = params;
  const result = await paymentTransactionService.create(data, user, queryRunner);
  return { status: true, message: "Payment created", data: result };
};