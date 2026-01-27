#!/bin/bash

# =========================
# Common
# =========================
export NODE_ENV=production

# =========================
# MongoDB
# =========================
export MONGO_URL=""

# =========================
# RabbitMQ
# =========================
export RABBITMQ_URL=""
export RABBITMQ_EXCHANGE="submissions.exchange"
export RABBITMQ_QUEUE="submissions.evaluate.queue"

# =========================
# Submission Service
# =========================
export SUBMISSION_SERVICE_PORT=3002

# =========================
# Evaluation Service
# =========================
export EVALUATION_SERVICE_PORT=3003
export DOCKER_EXECUTION_TIMEOUT=5000

# =========================
# Problem Service
# =========================
export PROBLEM_SERVICE_PORT=3001

