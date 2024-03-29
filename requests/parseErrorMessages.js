module.exports = {
  parseMessages: (validationErrors) => {
    const errorDetails = validationErrors.details;
    let validationMessages = [];
    for (const detail of errorDetails) {
      const fieldName = detail?.context?.label;
      let message = detail?.message?.replaceAll(/"/g, "");
      validationMessages.push({
        [fieldName]: message,
      });
    }
    return validationMessages;
  },
};
