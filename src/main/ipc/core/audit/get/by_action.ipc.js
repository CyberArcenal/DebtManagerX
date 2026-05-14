// src/main/ipc/audit/get/by_action.ipc.js
//@ts-check
const { AuditLog } = require("../../../../../entities/AuditLog");
const { AppDataSource } = require("../../../../db/data-source");

module.exports = async (params) => {
  const { action, page = 1, limit = 50 } = params;
  const repo = AppDataSource.getRepository(AuditLog);
  const qb = repo.createQueryBuilder("log")
    .where("log.action = :action", { action })
    .orderBy("log.timestamp", "DESC");
  const [items, total] = await qb
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();
  return {
    status: true,
    message: "Audit logs by action retrieved",
    data: { items, total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};