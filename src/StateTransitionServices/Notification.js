// src/services/NotificationStateTransitionService.js

const Notification = require("../entities/Notification");
const { logger } = require("../utils/logger");

class NotificationStateTransitionService {
  constructor(dataSource) {
    this.dataSource = dataSource;
    this.notificationRepo = dataSource.getRepository(Notification);
  }

  /**
   * Transition: Mark notification as read
   * @param {Object} notification
   * @param {string} user
   */
  async onRead(notification, user = "system") {
    logger.info(`[Transition] Marking notification #${notification.id} as read by ${user}`);
    // TODO: Update isRead = true, record read timestamp
  }

  /**
   * Transition: Send scheduled notification (trigger delivery)
   * @param {Object} notification
   * @param {string} channel - 'email', 'sms', 'inapp'
   * @param {string} user
   */
  async onSend(notification, channel = "inapp", user = "system") {
    logger.info(`[Transition] Sending notification #${notification.id} via ${channel} by ${user}`);
    // TODO: Actual delivery via email/sms, create NotificationLog
  }

  /**
   * Transition: Dismiss notification without reading
   * @param {Object} notification
   * @param {string} user
   */
  async onDismiss(notification, user = "system") {
    logger.info(`[Transition] Dismissing notification #${notification.id} by ${user}`);
    // TODO: Soft delete or set isRead = true without opening
  }
}

module.exports = { NotificationStateTransitionService };