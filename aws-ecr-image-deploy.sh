$(aws ecr get-login --no-include-email --region us-east-1)
docker build -t shultztom/ip-addr .
docker tag shultztom/ip-addr:latest 965336086931.dkr.ecr.us-east-1.amazonaws.com/shultztom/ip-addr:latest
docker push 965336086931.dkr.ecr.us-east-1.amazonaws.com/shultztom/ip-addr:latest
echo 'Done pushing image'