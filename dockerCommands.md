## To Run Docker Container Refer to Below Commands


## EvaluationService

docker run -d \
  --name evaluation-service \
  -p 3003:3003 \
  --env-file env.sh \
  -v /var/run/docker.sock:/var/run/docker.sock \
  codexflow/evaluation-service



## ProblemService

docker run -d \
  --name problem-service \
  -p 3001:3001 \
  --env-file env.sh \
  codexflow/problem-service



## SubmissionService
docker run -d \
  --name submission-service \
  -p 3002:3002 \
  --env-file env.sh \
  codexflow/submission-service



