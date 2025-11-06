const accountRoutes = require('./account');
const systemConfig = require('../../configs/system');
const authRoutes = require('./auth');
const categoryRoutes = require('./category');
const courseRoutes = require('./course');
module.exports = (app) => {
    app.use(`${systemConfig.prefixApi}/admin/accounts`, accountRoutes);
    app.use(`${systemConfig.prefixApi}/admin/auth`, authRoutes);
    app.use(`${systemConfig.prefixApi}/admin/categories`, categoryRoutes);
    app.use(`${systemConfig.prefixApi}/admin/course`, courseRoutes);
}