// src/main/ipc/audit/get/by_entity.ipc.js
const { AuditLog } = require("../../../../../entities/AuditLog");
const { AppDataSource } = require("../../../../db/data-source");

module.exports = async (params) => {
  const { entity, entityId, page = 1, limit = 50 } = params;
  const repo = AppDataSource.getRepository(AuditLog);
  const qb = repo.createQueryBuilder("log")
    .where("log.entity = :entity", { entity })
    .orderBy("log.timestamp", "DESC");
  if (entityId !== undefined) {
    qb.andWhere("log.entityId = :entityId", { entityId });
  }
  const [items, total] = await qb
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();
  return {
    status: true,
    message: "Audit logs by entity retrieved",
    data: { items, total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};