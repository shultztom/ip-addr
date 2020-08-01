docker build -t shultztom/ip-addr .
docker tag shultztom/ip-addr:latest nexus-docker-internal.shultzlab.com/shultztom/ip-addr:latest
docker push nexus-docker-internal.shultzlab.com/shultztom/ip-addr:latest
echo 'Done pushing image'