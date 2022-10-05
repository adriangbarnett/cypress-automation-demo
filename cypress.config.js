const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '1vny3a',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
