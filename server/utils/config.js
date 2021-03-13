"use strict";

var merge = require('deepmerge');
var config = require('../config.json');

// Override main config (config.json) with potential local config (config.local.json): that's
// useful when deploying the app on a server with different server url and port (Ext.Direct).
try {
    console.log("server->utils->config->try");
    config = merge(config, require('../config.local.json'));

} catch (e) {
    console.log("server->utils->config->catch");
    
}

module.exports = config;
