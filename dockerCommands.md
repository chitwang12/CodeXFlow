# 🐳 Docker Container Commands

## Running Services with Docker

### EvaluationService

```bash
docker run -d \
  --name evaluation-service \
  -p 3003:3003 \
  --env-file env.sh \
  -v /var/run/docker.sock:/var/run/docker.sock \
  codexflow/evaluation-service
```

**Parameters:**
- `-d` - Run in detached mode
- `--name evaluation-service` - Container name
- `-p 3003:3003` - Port mapping (host:container)
- `--env-file env.sh` - Environment variables file
- `-v /var/run/docker.sock:/var/run/docker.sock` - Docker socket mount (required for code execution)

---

### ProblemService

```bash
docker run -d \
  --name problem-service \
  -p 3001:3001 \
  --env-file env.sh \
  codexflow/problem-service
```

**Parameters:**
- `-d` - Run in detached mode
- `--name problem-service` - Container name
- `-p 3001:3001` - Port mapping (host:container)
- `--env-file env.sh` - Environment variables file

---

### SubmissionService

```bash
docker run -d \
  --name submission-service \
  -p 3002:3002 \
  --env-file env.sh \
  codexflow/submission-service
```

**Parameters:**
- `-d` - Run in detached mode
- `--name submission-service` - Container name
- `-p 3002:3002` - Port mapping (host:container)
- `--env-file env.sh` - Environment variables file

---

## Quick Commands

### Start All Services
```bash
# Start Evaluation Service
docker run -d --name evaluation-service -p 3003:3003 --env-file env.sh -v /var/run/docker.sock:/var/run/docker.sock codexflow/evaluation-service

# Start Problem Service
docker run -d --name problem-service -p 3001:3001 --env-file env.sh codexflow/problem-service

# Start Submission Service
docker run -d --name submission-service -p 3002:3002 --env-file env.sh codexflow/submission-service
```

### Stop All Services
```bash
docker stop evaluation-service problem-service submission-service
```

### Remove All Containers
```bash
docker rm evaluation-service problem-service submission-service
```

### View Logs
```bash
# View logs for specific service
docker logs evaluation-service
docker logs problem-service
docker logs submission-service

# Follow logs in real-time
docker logs -f submission-service
```

### Check Running Containers
```bash
docker ps
```

---

## Service Ports

| Service | Port | Purpose |
|---------|------|---------|
| **EvaluationService** | 3003 | Code execution worker |
| **ProblemService** | 3001 | Problem metadata API |
| **SubmissionService** | 3002 | Submission API & WebSocket |

---

## Environment Variables (env.sh)

Create an `env.sh` file with the following variables:

```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/codexflow

# RabbitMQ Connection
RABBITMQ_URL=amqp://localhost:5672

# Service Ports
EVALUATION_PORT=3003
PROBLEM_PORT=3001
SUBMISSION_PORT=3002

# WebSocket Port
WS_PORT=3003

# Docker Socket (for EvaluationService)
DOCKER_SOCKET=/var/run/docker.sock
```

---

## Using Docker Compose (Recommended)

Instead of running individual commands, use `docker-compose.yml`:

```yaml
version: '3.8'

services:
  evaluation-service:
    image: codexflow/evaluation-service
    container_name: evaluation-service
    ports:
      - "3003:3003"
    env_file:
      - env.sh
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    depends_on:
      - rabbitmq
      - mongodb

  problem-service:
    image: codexflow/problem-service
    container_name: problem-service
    ports:
      - "3001:3001"
    env_file:
      - env.sh
    depends_on:
      - mongodb

  submission-service:
    image: codexflow/submission-service
    container_name: submission-service
    ports:
      - "3002:3002"
    env_file:
      - env.sh
    depends_on:
      - rabbitmq
      - mongodb

  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq
    ports:
      - "5672:5672"
      - "15672:15672"

  mongodb:
    image: mongo:latest
    container_name: mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

**Run with:**
```bash
docker-compose up -d
```

**Stop with:**
```bash
docker-compose down
```
