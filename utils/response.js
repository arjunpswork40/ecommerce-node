module.exports = {
  makeJsonResponse: (message, data = {}, errors = {}, statusCode, success = true, verificationStatus=true,extraFlags = {}) => {
    const response = {
      statusCode,
      message,
      data,
      errors,
      success,
      extraFlags,
    };

    // Conditionally include verificationStatus if provided
    if (verificationStatus !== undefined) {
      response.verificationStatus = verificationStatus;
    }

    return response;
  },
};
