// src/services/BorrowerStateTransitionService.js

const Borrower = require("../entities/Borrower");
const { logger } = require("../utils/logger");

class BorrowerStateTransitionService {
  constructor(dataSource) {
    this.dataSource = dataSource;
    this.borrowerRepo = dataSource.getRepository(Borrower);
  }

  /**
   * Transition: Activate a borrower (set deletedAt = null)
   * @param {Object} borrower
   * @param {string} user
   */
  async onActivate(borrower, user = "system") {
    logger.info(`[Transition] Activating borrower #${borrower.id} by ${user}`);
    // TODO: Add side effects (e.g., restore related debts, send notification)
  }

  /**
   * Transition: Deactivate (soft delete) a borrower
   * @param {Object} borrower
   * @param {string} user
   */
  async onDeactivate(borrower, user = "system") {
    logger.info(`[Transition] Deactivating borrower #${borrower.id} by ${user}`);
    // TODO: Add side effects (e.g., prevent new debts, notify admin)
  }

  /**
   * Transition: Merge duplicate borrower into another
   * @param {Object} sourceBorrower
   * @param {Object} targetBorrower
   * @param {string} user
   */
  async onMerge(sourceBorrower, targetBorrower, user = "system") {
    logger.info(
      `[Transition] Merging borrower #${sourceBorrower.id} into #${targetBorrower.id} by ${user}`
    );
    // TODO: Reassign all debts, payments, penalties, agreements, notifications
  }
}

module.exports = { BorrowerStateTransitionService };