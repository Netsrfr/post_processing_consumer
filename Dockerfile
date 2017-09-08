# Build completes everything needed to start using AI to identify images
# Installs tensorflow
# Clones models and executes imagenet to gather library

FROM ubuntu

ENV TF_CPP_MIN_LOG_LEVEL=2
RUN add-apt-repository ppa:stebbins/handbrake-releases; \
	apt-get update; \
	apt-get install -y python3-pip python3-dev python-virtualenv git curl \
	handbrake-cli; \
	curl -sL https://deb.nodesource.com/setup_8.x | bash -; \
	apt-get install -y nodejs; \
	apt-get install -y npm; \
	apt-get install -y default-jdk; \
	npm install aws-sdk; \
	pip3 install --upgrade pip; \
	pip3 install --upgrade tensorflow; \
	git clone https://github.com/tensorflow/models.git; \
	cd /models/tutorials/image/imagenet; \
	python3 classify_image.py
WORKDIR /opt/post_processing
RUN git clone https://github.com/Netsrfr/post_processing_consumer.git consumer
WORKDIR /opt/post_processing/consumer
RUN npm install

#COPY config.json /opt/post_processing/consumer/conf
#COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
#CMD supervisord -c /etc/supervisor/supervisord.conf -n