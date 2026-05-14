// src/main/ipc/audit/get/summary.ipc.js
const { AuditLog } = require("../../../../../entities/AuditLog");
const { AppDataSource } = require("../../../../db/data-source");

module.exports = async (params) => {
  const { startDate, endDate } = params;
  const repo = AppDataSource.getRepository(AuditLog);
  let qb = repo.createQueryBuilder("log");
  if (startDate && endDate) {
    qb = qb.where("log.timestamp BETWEEN :start AND :end", { start: new Date(startDate), end: new Date(endDate) });
  }
  const byAction = await qb.clone()
    .select("log.action", "action")
    .addSelect("COUNT(*)", "count")
    .groupBy("log.action")
    .getRawMany();
  const byEntity = await qb.clone()
    .select("log.entity", "entity")
    .addSelect("COUNT(*)", "count")
    .groupBy("log.entity")
    .getRawMany();
  const byUser = await qb.clone()
    .select("log.user", "user")
    .addSelect("COUNT(*)", "count")
    .groupBy("log.user")
    .getRawMany();
  return {
    status: true,
    message: "Audit summary retrieved",
    data: { byAction, byEntity, byUser },
  };
};