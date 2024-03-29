require("dotenv").config();

module.exports = {
  config: (configStr) => {
    const configStrParts = configStr.split(".");
    const settingsFile = configStrParts[0];
    for (const configStrPart of configStrParts) {
      if (Array.isArray(configStrPart)) {
      }
    }
  },
};
