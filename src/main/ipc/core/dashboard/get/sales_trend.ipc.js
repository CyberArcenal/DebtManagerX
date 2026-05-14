// src/main/ipc/dashboard/get/sales_trend.ipc.js
//@ts-check
const { AuditLog } = require("../../../../../entities/AuditLog");
const PaymentTransaction = require("../../../../../entities/PaymentTransaction");

module.exports = async (params) => {
  const { days = 7 } = params;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const payments = await PaymentTransaction
    .createQueryBuilder("payment")
    .select("DATE(payment.paymentDate)", "date")
    .addSelect("SUM(payment.amount)", "total")
    .where("payment.paymentDate >= :startDate", { startDate })
    .andWhere("payment.deletedAt IS NULL")
    .groupBy("DATE(payment.paymentDate)")
    .orderBy("date", "ASC")
    .getRawMany();

  return {
    status: true,
    message: "Sales trend retrieved",
    data: payments.map(p => ({ date: p.date, total: parseFloat(p.total) })),
  };
};