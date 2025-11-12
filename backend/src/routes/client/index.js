const systemConfig = require('../../configs/system');
const courseRouter = require('./course');
const articleRouter = require('./article');
const userRouter = require('./user');
module.exports = (app) => {
    app.use(`${systemConfig.prefixApi}/client/user`, userRouter);
    app.use(`${systemConfig.prefixApi}/client/article`, articleRouter);
    app.use(`${systemConfig.prefixApi}/client/course`, courseRouter);
}