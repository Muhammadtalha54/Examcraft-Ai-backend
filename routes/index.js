const express = require('express');
const authRoutes = require('./auth.routes');
const generateRoutes = require('./generate.routes');
const testRoutes = require('./test.routes');
const infoRoutes = require('./info.routes');
const rateRoutes = require('./rate.routes');

const router = express.Router();

// Mount all sub-routers
router.use('/auth', authRoutes);
router.use('/generate', generateRoutes);
router.use('/test', testRoutes);
router.use('/info', infoRoutes);
router.use('/rate', rateRoutes);

module.exports = router;
