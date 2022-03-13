const express = require('express');
const Bundler = require('parcel-bundler');
const router = express.Router();

const bundler = new Bundler(global.dirname + '/src/website/index.html', { cache: false });
router.use(bundler.middleware())

module.exports = router;