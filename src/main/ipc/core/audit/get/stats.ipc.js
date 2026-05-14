// src/main/ipc/audit/get/stats.ipc.js
const { AuditLog } = require("../../../../../entities/AuditLog");
const { AppDataSource } = require("../../../../db/data-source");

module.exports = async (params) => {
  const { startDate, endDate } = params;
  const repo = AppDataSource.getRepository(AuditLog);
  let qb = repo.createQueryBuilder("log");
  if (startDate && endDate) {
    qb = qb.where("log.timestamp BETWEEN :start AND :end", { start: new Date(startDate), end: new Date(endDate) });
  }
  const total = await qb.clone().getCount();
  const uniqueUsers = await qb.clone().select("COUNT(DISTINCT log.user)", "count").getRawOne();
  const avgPerDay = await qb.clone()
    .select("COUNT(*) / COUNT(DISTINCT DATE(log.timestamp))", "avg")
    .getRawOne();
  const mostActiveDay = await qb.clone()
    .select("DATE(log.timestamp) as day, COUNT(*) as count")
    .groupBy("DATE(log.timestamp)")
    .orderBy("count", "DESC")
    .limit(1)
    .getRawOne();
  return {
    status: true,
    message: "Audit statistics retrieved",
    data: {
      total,
      avgPerDay: parseFloat(avgPerDay?.avg) || 0,
      mostActiveDay: mostActiveDay ? { day: mostActiveDay.day, count: parseInt(mostActiveDay.count) } : null,
      uniqueUsers: parseInt(uniqueUsers?.count) || 0,
      dateRange: startDate && endDate ? { start: startDate, end: endDate } : null,
    },
  };
};