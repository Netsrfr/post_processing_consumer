'use strict'; // eslint-disable-line

const joi = require('joi');
const { hostPortJoi, bootstrapListJoi, logJoi } =
    require('../lib/config/configItems.joi.js');

const authJoi = joi.object({
    type: joi.alternatives().try('account', 'role').required(),
    account: joi.string(),
    vault: hostPortJoi.keys({
        adminPort: joi.number().greater(0).optional(),
    }),
});

const transportJoi = joi.alternatives().try('http', 'https')
    .default('http');

const joiSchema = {
    log: logJoi,
    zookeeper: {
        connectionString: joi.string().required(),
    },
    kafka: {
        hosts: joi.string().required(),
    },
    source: {
        transport: transportJoi,
        s3: hostPortJoi.required(),
        auth: authJoi.required(),
        logSource: joi.alternatives().try('bucketd', 'dmd').required(),
        bucketd: hostPortJoi,
        dmd: hostPortJoi.keys({
            logName: joi.string().default('s3-recordlog'),
        }),
    },
    queueProcessor: {
        topic: joi.string().required(),
        groupId: joi.string().required(),
        retryTimeoutS: joi.number().default(300),
        videoTranscode: {
            enabled: joi.bool().required(),
            output: {
                mp4: joi.bool().required(),
                mkv: joi.bool().required(),
                m4v: joi.bool().required()
            },

        },
        autoTag: {
            enabled: joi.bool().required(),
            input: joi.string().valid('JPEG', 'JPG').insensitive().required()
        },
    },
};

module.exports = joiSchema;
