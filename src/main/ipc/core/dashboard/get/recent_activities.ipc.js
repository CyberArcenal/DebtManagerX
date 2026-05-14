// src/main/ipc/dashboard/get/recent_activities.ipc.js
//@ts-check

const { AuditLog } = require("../../../../../entities/AuditLog");
const PaymentTransaction = require("../../../../../entities/PaymentTransaction");
const { AppDataSource } = require("../../../../db/data-source");

module.exports = async (params) => {
  const { limit = 10 } = params;
  const auditRepo = AppDataSource.getRepository(AuditLog);
  const paymentRepo = AppDataSource.getRepository(PaymentTransaction);

  // Kunin ang latest audit logs
  const recentAuditLogs = await auditRepo.find({
    order: { timestamp: "DESC" },
    take: Math.min(limit, 20),
  });

  // Kunin ang latest payment transactions (alternatibong aktibidad)
  const recentPayments = await paymentRepo.find({
    where: { deletedAt: null },
    relations: ["debt", "debt.borrower"],
    order: { paymentDate: "DESC" },
    take: Math.min(limit, 10),
  });

  // Pagsamahin at i-format ang mga aktibidad
  const activities = [];

  // I-convert ang audit logs sa generic activities
  for (const log of recentAuditLogs) {
    activities.push({
      id: log.id,
      action: log.action,
      entity: log.entity,
      entityId: log.entityId,
      user: log.user || "system",
      timestamp: log.timestamp.toISOString(),
      details: `${log.action} on ${log.entity}${log.entityId ? ` #${log.entityId}` : ""}`,
    });
  }

  // I-convert ang payments sa activities (optional)
  for (const payment of recentPayments) {
    activities.push({
      id: `payment_${payment.id}`,
      action: "PAYMENT",
      entity: "PaymentTransaction",
      entityId: payment.id,
      user: payment.reference || "customer",
      timestamp: payment.paymentDate.toISOString(),
      details: `Payment of ${payment.amount} for debt #${payment.debt?.id}`,
    });
  }

  // Pagbukud-bukurin ayon sa timestamp (pinakabago muna)
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Limitahan sa hinihinging bilang
  const limitedActivities = activities.slice(0, limit);

  return {
    status: true,
    message: "Recent activities retrieved",
    data: limitedActivities,
  };
};