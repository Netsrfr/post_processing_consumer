const Logger = require('werelogs').Logger;
const QueueEntry = require('../lib/QueueEntry');
const BackbeatConsumer = require('../lib/BackbeatConsumer');

const CONSUMER_FETCH_MAX_BYTES = 5000020;

class QueueProcessor {

    /**
     * Create a queue processor object to activate Cross-Region
     * Replication from a kafka topic dedicated to store replication
     * entries to a target S3 endpoint.
     *
     * @constructor
     * @param {Object} zkConfig - zookeeper configuration object
     * @param {string} zkConfig.connectionString - zookeeper connection string
     *   as "host:port[/chroot]"
     * @param {Object} sourceConfig - source S3 configuration
     * @param {Object} sourceConfig.s3 - s3 endpoint configuration object
     * @param {Object} sourceConfig.auth - authentication info on source
     * @param {Object} tcConfig - target S3 configuration
     * @param {Object}
     * @param {Object} tagConfig - replication configuration object
     * @param {String} tagConfig.topic - replication topic name
     * @param {String} tagConfig.queueProcessor - config object
     *   specific to queue processor
     * @param {String} tagConfig.queueProcessor.groupId - kafka
     *   consumer group ID
     * @param {String} tagConfig.queueProcessor.retryTimeoutS -
     *   number of seconds before giving up retries of an entry
     *   replication
     */
    constructor(zkConfig, topicConfig, tcConfig, tagConfig) {
        this.zkConfig = zkConfig;
        this.topicConfig = topicConfig;
        this.tcConfig = tcConfig;
        this.tagConfig = tagConfig;

        this.logger = new Logger('Backbeat:PostProcessing:QueueProcessor');

    }


    /**
     * Proceed to the replication of an object given a kafka
     * replication queue entry
     *
     * @param {object} kafkaEntry - entry generated by the queue populator
     * @param {string} kafkaEntry.key - kafka entry key
     * @param {string} kafkaEntry.value - kafka entry value
     * @param {function} done - callback function
     * @return {undefined}
     */
    processKafkaEntry(kafkaEntry, done) {
        const log = this.logger.newRequestLogger();

        const sourceEntry = QueueEntry.createFromKafkaEntry(kafkaEntry);
        if (sourceEntry.error) {
            log.error('error processing source entry',
                {error: sourceEntry.error});
            return process.nextTick(() => done(errors.InternalError));
        }
        return this._processQueueEntry(sourceEntry, log, done);
    }

    _processQueueEntry(sourceEntry, log, done) {
        //TODO: Return to log.debug
        log.info('processing entry',
            {entry: sourceEntry.getLogInfo()});
        /**
         *  Pull data to local
         *  Validate file type
         *  Split calls between transcoding and auto-tagging here.
         *  Transcoding:
         *
         *  Auto-Tagging:
         *      call AI program on image
         *      parse tags into appropriate data structure
         *      Add tags to AWS //May not do this step
         *      Replace Bucket with new version with meta tags
         */
        return done();

    }

    start() {
        const consumer = new BackbeatConsumer({
            zookeeper: this.zkConfig,
            topic: this.tagConfig.topic,
            groupId: this.tagConfig.queueProcessor.groupId,
            concurrency: 1, // replication has to process entries in
                            // order, so one at a time
            queueProcessor: this.processKafkaEntry.bind(this),
            fetchMaxBytes: CONSUMER_FETCH_MAX_BYTES,
        });
        consumer.on('error', () => {
        });
        consumer.subscribe();

        this.logger.info('queue processor is ready to consume ' +
            'replication entries');
    }
}
module.exports = QueueProcessor;