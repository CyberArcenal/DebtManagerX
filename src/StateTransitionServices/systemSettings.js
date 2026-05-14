// src/services/SystemSettingStateTransitionService.js

const { SystemSetting } = require("../entities/systemSettings");
const { logger } = require("../utils/logger");

class SystemSettingStateTransitionService {
  constructor(dataSource) {
    this.dataSource = dataSource;
    this.settingRepo = dataSource.getRepository(SystemSetting);
  }

  /**
   * Transition: Apply a setting change (e.g., clear cache, reload configuration)
   * @param {Object} setting
   * @param {string} oldValue
   * @param {string} newValue
   * @param {string} user
   */
  async onApply(setting, oldValue, newValue, user = "system") {
    logger.info(
      `[Transition] Applying setting change for key "${setting.key}": ${oldValue} → ${newValue} by ${user}`
    );
    // TODO: Invalidate cached values, restart services if needed
  }

  /**
   * Transition: Reset setting to factory default
   * @param {Object} setting
   * @param {string} user
   */
  async onReset(setting, user = "system") {
    logger.info(`[Transition] Resetting setting "${setting.key}" to default by ${user}`);
    // TODO: Load default value from code/constants, save and apply
  }

  /**
   * Transition: Validate setting before applying
   * @param {Object} setting
   * @param {string} proposedValue
   * @returns {boolean}
   */
  async onValidate(setting, proposedValue) {
    logger.info(`[Transition] Validating setting "${setting.key}" with value ${proposedValue}`);
    // TODO: Perform validation (e.g., numeric range, email format, enum)
    return true; // placeholder
  }
}

module.exports = { SystemSettingStateTransitionService };