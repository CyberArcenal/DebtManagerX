// src/main/ipc/audit/get/all.ipc.js
//@ts-check
const { AuditLog } = require("../../../../../entities/AuditLog");
const { AppDataSource } = require("../../../../db/data-source");


module.exports = async (params) => {
  const { page = 1, limit = 50 } = params;
  const repo = AppDataSource.getRepository(AuditLog);
  const [items, total] = await repo.findAndCount({
    order: { timestamp: "DESC" },
    skip: (page - 1) * limit,
    take: Math.min(limit, 100),
  });
  return {
    status: true,
    message: "Audit logs retrieved",
    data: { items, total, page, limit: Number(limit), totalPages: Math.ceil(total / limit) },
  };
};