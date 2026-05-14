// src/main/ipc/audit/get/by_date_range.ipc.js
const { AuditLog } = require("../../../../../entities/AuditLog");
const { AppDataSource } = require("../../../../db/data-source");
const { Between } = require("typeorm");

module.exports = async (params) => {
  const { startDate, endDate, page = 1, limit = 50 } = params;
  const repo = AppDataSource.getRepository(AuditLog);
  const qb = repo.createQueryBuilder("log")
    .where("log.timestamp BETWEEN :start AND :end", { start: new Date(startDate), end: new Date(endDate) })
    .orderBy("log.timestamp", "DESC");
  const [items, total] = await qb
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();
  return {
    status: true,
    message: "Audit logs by date range retrieved",
    data: { items, total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};