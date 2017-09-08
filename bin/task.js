'use strict'; // eslint-disable-line

const werelogs = require('werelogs');

const QueueProcessor = require('./PostProcessingConsumer');

const config = require('../conf/Config');
const zkConfig = config.zookeeper;
const consumerConfig = config.queueProcessor;
const tcConfig = config.queueProcessor.videoTranscode;
const tagConfig = config.queueProcessor.autoTag;

const queueProcessor = new QueueProcessor(zkConfig,
                                          consumerConfig, tcConfig,
                                          tagConfig);

werelogs.configure({ level: config.log.logLevel,
                     dump: config.log.dumpLevel });

queueProcessor.start();
