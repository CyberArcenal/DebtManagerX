// src/services/PaymentTransactionStateTransitionService.js

const PaymentTransaction = require("../entities/PaymentTransaction");
const { logger } = require("../utils/logger");

class PaymentTransactionStateTransitionService {
  constructor(dataSource) {
    this.dataSource = dataSource;
    this.paymentRepo = dataSource.getRepository(PaymentTransaction);
  }

  /**
   * Transition: Void a payment (before it's applied)
   * @param {Object} payment
   * @param {string} user
   */
  async onVoid(payment, user = "system") {
    logger.info(`[Transition] Voiding payment transaction #${payment.id} by ${user}`);
    // TODO: Reverse debt paidAmount, update inventory if payment was for purchase
  }

  /**
   * Transition: Refund a payment
   * @param {Object} payment
   * @param {number} refundAmount
   * @param {string} user
   */
  async onRefund(payment, refundAmount, user = "system") {
    logger.info(`[Transition] Refunding ${refundAmount} from payment #${payment.id} by ${user}`);
    // TODO: Create refund transaction, adjust debt balances
  }

  /**
   * Transition: Confirm payment (e.g., after bank verification)
   * @param {Object} payment
   * @param {string} user
   */
  async onConfirm(payment, user = "system") {
    logger.info(`[Transition] Confirming payment #${payment.id} by ${user}`);
    // TODO: Mark as verified, trigger receipt generation
  }
}

module.exports = { PaymentTransactionStateTransitionService };