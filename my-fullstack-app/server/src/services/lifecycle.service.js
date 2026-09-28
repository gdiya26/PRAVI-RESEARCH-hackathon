const { LIFECYCLE_STAGES } = require('../utils/constants');
const ApiError = require('../utils/ApiError');

class LifecycleService {
  /**
   * Validates if transition from currentStage to targetStage is permissible.
   * Allowed transitions:
   * 1. Forward exactly one step in the sequence:
   *    PLAN_DESIGN -> BUILD -> OPERATE -> MAINTAIN -> RECONSTRUCTION_REPLACEMENT_RETIREMENT
   * 2. Plus MAINTAIN -> OPERATE
   * Anything else throws 400.
   */
  isValidTransition(currentStage, targetStage) {
    if (!currentStage || !targetStage) return false;
    if (currentStage === targetStage) return false;

    // Special allowance: MAINTAIN -> OPERATE
    if (currentStage === 'MAINTAIN' && targetStage === 'OPERATE') {
      return true;
    }

    const currentIndex = LIFECYCLE_STAGES.indexOf(currentStage);
    const targetIndex = LIFECYCLE_STAGES.indexOf(targetStage);

    if (currentIndex === -1 || targetIndex === -1) {
      return false;
    }

    // Forward exactly one step
    return targetIndex === currentIndex + 1;
  }

  /**
   * Advances or transitions an asset's lifecycle stage.
   * @param {Object} asset - Mongoose asset document
   * @param {Object} transitionData
   * @param {string} transitionData.targetStage
   * @param {string} transitionData.description
   * @param {string} [transitionData.by]
   * @param {number} [transitionData.cost]
   * @param {string} [transitionData.docRef]
   * @param {Date} [transitionData.date]
   */
  async transitionStage(asset, { targetStage, description, by = 'System Admin', cost = 0, docRef = '', date = new Date() }) {
    if (!this.isValidTransition(asset.lifecycleStage, targetStage)) {
      throw new ApiError(
        400,
        `Invalid lifecycle transition from '${asset.lifecycleStage}' to '${targetStage}'. Allowed: forward one step or MAINTAIN -> OPERATE.`
      );
    }

    if (!description) {
      throw new ApiError(400, 'A description is required for every lifecycle stage transition.');
    }

    // Append-only history record
    asset.lifecycleHistory.push({
      stage: targetStage,
      date: date || new Date(),
      description,
      by,
      cost: Number(cost) || 0,
      docRef: docRef || ''
    });

    asset.lifecycleStage = targetStage;
    await asset.save();

    return asset;
  }
}

module.exports = new LifecycleService();
