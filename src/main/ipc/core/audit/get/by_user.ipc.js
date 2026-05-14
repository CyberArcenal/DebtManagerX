// src/main/ipc/audit/get/by_user.ipc.js
const { AuditLog } = require("../../../../../entities/AuditLog");
const { AppDataSource } = require("../../../../db/data-source");

module.exports = async (params) => {
  const { user, page = 1, limit = 50 } = params;
  const repo = AppDataSource.getRepository(AuditLog);
  const qb = repo.createQueryBuilder("log")
    .where("log.user = :user", { user })
    .orderBy("log.timestamp", "DESC");
  const [items, total] = await qb
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();
  return {
    status: true,
    message: "Audit logs by user retrieved",
    data: { items, total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};