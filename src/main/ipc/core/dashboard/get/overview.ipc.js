// src/main/ipc/dashboard/get/overview.ipc.js
//@ts-check
const { AuditLog } = require("../../../../../entities/AuditLog");
const { Between } = require("typeorm");
const { AppDataSource } = require("../../../../db/data-source");
const PaymentTransaction = require("../../../../../entities/PaymentTransaction");
const Borrower = require("../../../../../entities/Borrower");
const Debt = require("../../../../../entities/Debt");

module.exports = async (params) => {
  const paymentRepo = AppDataSource.getRepository(PaymentTransaction);
  const borrowerRepo = AppDataSource.getRepository(Borrower);
  const debtRepo = AppDataSource.getRepository(Debt);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayRevenue = await paymentRepo
    .createQueryBuilder("payment")
    .select("SUM(payment.amount)", "total")
    .where("payment.paymentDate BETWEEN :start AND :end", { start: today, end: tomorrow })
    .andWhere("payment.deletedAt IS NULL")
    .getRawOne();

  const totalCustomers = await borrowerRepo.count({ where: { deletedAt: null } });
  const activeDebts = await debtRepo.count({ where: { status: "active", deletedAt: null } });
  const overdueDebts = await debtRepo.count({ where: { status: "overdue", deletedAt: null } });

  return {
    status: true,
    message: "Overview data retrieved",
    data: {
      todayRevenue: parseFloat(todayRevenue.total) || 0,
      totalCustomers,
      activeDebts,
      overdueDebts,
    },
  };
};