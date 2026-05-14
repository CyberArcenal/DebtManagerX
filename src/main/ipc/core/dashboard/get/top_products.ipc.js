// src/main/ipc/dashboard/get/top_products.ipc.js
// Assuming may SaleItem entity; dito ay placeholder gamit ang Debt name
//@ts-check
const { AuditLog } = require("../../../../../entities/AuditLog");
const Debt = require("../../../../../entities/Debt");
const { AppDataSource } = require("../../../../db/data-source");

module.exports = async (params) => {
  const { limit = 5 } = params;
  const debtRepo = AppDataSource.getRepository(Debt);
  const topDebts = await debtRepo
    .createQueryBuilder("debt")
    .select("debt.name", "name")
    .addSelect("SUM(debt.totalAmount)", "totalValue")
    .where("debt.deletedAt IS NULL")
    .groupBy("debt.name")
    .orderBy("totalValue", "DESC")
    .limit(limit)
    .getRawMany();

  return {
    status: true,
    message: "Top products retrieved",
    data: topDebts.map(item => ({ name: item.name, totalValue: parseFloat(item.totalValue) })),
  };
};