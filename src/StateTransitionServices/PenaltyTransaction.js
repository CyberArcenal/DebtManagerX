// src/services/PenaltyTransactionStateTransitionService.js

const PenaltyTransaction = require("../entities/PenaltyTransaction");
const { logger } = require("../utils/logger");

class PenaltyTransactionStateTransitionService {
  constructor(dataSource) {
    this.dataSource = dataSource;
    this.penaltyRepo = dataSource.getRepository(PenaltyTransaction);
  }

  /**
   * Transition: Waive a penalty
   * @param {Object} penalty
   * @param {string} reason
   * @param {string} user
   */
  async onWaive(penalty, reason = "", user = "system") {
    logger.info(`[Transition] Waiving penalty #${penalty.id} by ${user}. Reason: ${reason}`);
    // TODO: Remove penalty from debt calculations, log waiver
  }

  /**
   * Transition: Collect penalty (mark as applied)
   * @param {Object} penalty
   * @param {string} user
   */
  async onCollect(penalty, user = "system") {
    logger.info(`[Transition] Collecting penalty #${penalty.id} by ${user}`);
    // TODO: Add penalty amount to debt total or create a separate collection record
  }

  /**
   * Transition: Reverse a penalty (if applied by mistake)
   * @param {Object} penalty
   * @param {string} user
   */
  async onReverse(penalty, user = "system") {
    logger.info(`[Transition] Reversing penalty #${penalty.id} by ${user}`);
    // TODO: Adjust debt balance, create audit trail
  }
}

module.exports = { PenaltyTransactionStateTransitionService };