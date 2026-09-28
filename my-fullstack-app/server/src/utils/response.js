const { HEALTH_SCORE_DISCLAIMER } = require('./constants');

const sendResponse = (res, statusCode = 200, message = 'Success', data = null, extra = {}) => {
  const payload = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
    ...extra
  };

  // If payload contains asset data or healthScore, ensure disclaimer is attached
  if (
    data &&
    (data.healthScore !== undefined ||
      data.asset?.healthScore !== undefined ||
      extra.includeDisclaimer ||
      (Array.isArray(data) && data.length > 0 && data[0].healthScore !== undefined))
  ) {
    payload.disclaimer = HEALTH_SCORE_DISCLAIMER;
  }

  return res.status(statusCode).json(payload);
};

module.exports = { sendResponse };
