// src/services/DebtStateTransitionService.js

const Debt = require("../entities/Debt");
const { logger } = require("../utils/logger");

class DebtStateTransitionService {
  constructor(dataSource) {
    this.dataSource = dataSource;
    this.debtRepo = dataSource.getRepository(Debt);
  }

  /**
   * Transition: Mark debt as paid
   * @param {Object} debt
   * @param {string} user
   */
  async onPaid(debt, user = "system") {
    logger.info(`[Transition] Marking debt #${debt.id} as paid by ${user}`);
    // TODO: Update status to 'paid', close related notifications, log completion
  }

  /**
   * Transition: Mark debt as overdue
   * @param {Object} debt
   * @param {string} user
   */
  async onOverdue(debt, user = "system") {
    logger.info(`[Transition] Marking debt #${debt.id} as overdue by ${user}`);
    // TODO: Calculate penalties, send reminders, update status
  }

  /**
   * Transition: Mark debt as defaulted
   * @param {Object} debt
   * @param {string} user
   */
  async onDefaulted(debt, user = "system") {
    logger.info(`[Transition] Marking debt #${debt.id} as defaulted by ${user}`);
    // TODO: Escalate to collections, block further payments, notify legal
  }

  /**
   * Transition: Restore debt from paid/overdue/defaulted back to active
   * @param {Object} debt
   * @param {string} user
   */
  async onRestoreToActive(debt, user = "system") {
    logger.info(`[Transition] Restoring debt #${debt.id} to active by ${user}`);
    // TODO: Recalculate remaining amount, clear default flags
  }

  /**
   * Transition: Forgive a portion of the debt (reduce totalAmount)
   * @param {Object} debt
   * @param {number} amountForgiven
   * @param {string} user
   */
  async onForgiveness(debt, amountForgiven, user = "system") {
    logger.info(
      `[Transition] Forgiving ${amountForgiven} from debt #${debt.id} by ${user}`
    );
    // TODO: Adjust totalAmount, log forgiveness reason
  }
}

module.exports = { DebtStateTransitionService };