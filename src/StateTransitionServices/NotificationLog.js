// src/services/NotificationLogStateTransitionService.js

const NotificationLog = require("../entities/NotificationLog");
const { logger } = require("../utils/logger");

class NotificationLogStateTransitionService {
  constructor(dataSource) {
    this.dataSource = dataSource;
    this.logRepo = dataSource.getRepository(NotificationLog);
  }

  /**
   * Transition: Retry a failed delivery log
   * @param {Object} log
   * @param {string} user
   */
  async onRetry(log, user = "system") {
    logger.info(`[Transition] Retrying failed notification log #${log.id} by ${user}`);
    // TODO: Increment retry count, attempt send again
  }

  /**
   * Transition: Acknowledge that a notification was delivered successfully
   * @param {Object} log
   * @param {string} user
   */
  async onAcknowledge(log, user = "system") {
    logger.info(`[Transition] Acknowledging successful delivery of log #${log.id} by ${user}`);
    // TODO: Update status to 'delivered'
  }
}

module.exports = { NotificationLogStateTransitionService };