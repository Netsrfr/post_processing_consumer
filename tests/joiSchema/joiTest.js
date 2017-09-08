const joi = require('joi');
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const postProcessingConfigJoi = require('../../conf/config.joi.js');



class testConfig {
    constructor() {
        this._basePath = __dirname;
        this.configPath = path.join(this._basePath, 'pp_config.json');

        let config;
        try {
            const data = fs.readFileSync(this.configPath,
                {encoding: 'utf-8'});
            config = JSON.parse(data);
        } catch (err) {
            throw new Error(`could not parse config file: ${err.message}`);
        }
        const parsedConfig = joi.attempt(config, postProcessingConfigJoi,
            'invalid post-processing config');
    }
}

module.exports = new testConfig();
