module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding comment to document new status values
    // Status 7 = poptano (Poptáno)
    // Status 8 = prodano (Prodáno)
    // No database changes needed as status is INTEGER type
    // This migration serves as documentation for the new status values
    return Promise.resolve();
  },
  down: async (queryInterface, Sequelize) => {
    // No changes to revert
    return Promise.resolve();
  },
};
