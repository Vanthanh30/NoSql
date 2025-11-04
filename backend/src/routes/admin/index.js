const accountRoutes = require('./account');
const systemConfig = require('../../configs/system');
const authRoutes = require('./auth');
module.exports = (app) => {
    app.use(`${systemConfig.prefixApi}/admin/accounts`, accountRoutes);
    app.use(`${systemConfig.prefixApi}/admin/auth`, authRoutes);
}