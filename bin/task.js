'use strict'; // eslint-disable-line

const werelogs = require('werelogs');

const QueueProcessor = require('./PostProcessingConsumer');

const config = require('../conf/Config');
const zkConfig = config.zookeeper;
const sourceConfig = config.source;
const tcConfig = queueProcessor.videoTranscode;
const tagConfig = queueProcessor.autoTag;

const queueProcessor = new QueueProcessor(zkConfig,
                                          sourceConfig, tcConfig,
                                          tagConfig);

werelogs.configure({ level: config.log.logLevel,
                     dump: config.log.dumpLevel });

queueProcessor.start();
