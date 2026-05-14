// src/main/ipc/audit/get/recent.ipc.js
const { AuditLog } = require("../../../../../entities/AuditLog");
const { AppDataSource } = require("../../../../db/data-source");

module.exports = async (params) => {
  const { limit = 10 } = params;
  const repo = AppDataSource.getRepository(AuditLog);
  const items = await repo.find({
    order: { timestamp: "DESC" },
    take: Math.min(limit, 50),
  });
  return {
    status: true,
    message: "Recent activities retrieved",
    data: { items, limit },
  };
};