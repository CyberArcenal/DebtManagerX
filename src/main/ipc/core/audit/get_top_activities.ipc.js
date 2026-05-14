// src/main/ipc/audit/get_top_activities.ipc.js
//@ts-check
const { AuditLog } = require("../../../../entities/AuditLog");
const { AppDataSource } = require("../../../db/data-source");

module.exports = async (params) => {
  const { limit = 10, startDate, endDate } = params;
  const repo = AppDataSource.getRepository(AuditLog);
  let qb = repo.createQueryBuilder("log");
  if (startDate && endDate) {
    qb = qb.where("log.timestamp BETWEEN :start AND :end", { start: new Date(startDate), end: new Date(endDate) });
  }
  const topActions = await qb.clone()
    .select("log.action", "action")
    .addSelect("COUNT(*)", "count")
    .groupBy("log.action")
    .orderBy("count", "DESC")
    .limit(limit)
    .getRawMany();
  const topEntities = await qb.clone()
    .select("log.entity", "entity")
    .addSelect("COUNT(*)", "count")
    .groupBy("log.entity")
    .orderBy("count", "DESC")
    .limit(limit)
    .getRawMany();
  const topUsers = await qb.clone()
    .select("log.user", "user")
    .addSelect("COUNT(*)", "count")
    .groupBy("log.user")
    .orderBy("count", "DESC")
    .limit(limit)
    .getRawMany();
  return {
    status: true,
    message: "Top activities retrieved",
    data: { topActions, topEntities, topUsers },
  };
};