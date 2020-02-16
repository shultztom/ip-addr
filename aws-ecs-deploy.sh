./aws-ecr-image-deploy.sh
aws ecs update-service --cluster fargate-cluster-1 --service ip-addr-service --force-new-deployment
echo 'Done deploying'