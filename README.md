# ip-addr

A simple service for looking up your IP address, returns as JSON. Available at https://ip-addr.shultzlab.com/. Hosted on GKE

## Usage

```
$ curl https://ip-addr.shultzlab.com/json
```

## Run locally (with Node.js)

1. `yarn install`
2. `yarn start:dev`

## Run locally (with Docker)

1. `docker image build -t ip-addr:stable .`
2. `docker run --rm -d -p 3000:3000/tcp ip-addr:stable`

## Setup for ECS

1. Upload docker image to AWS ECR or Docker Hub
2. Create Task
    * Fargate
    * None for Task Role
    * 0.5 vCPU / 1GB memory
    * Add container, ensure port 3000 is open
3. Create Cluster
    * Powered by AWS Fargate
    * Create a new VPC (Need two subnets for Application Load Balancer)
4. Create load balancer
    * Allow http and https
    * Select the VPC and both subnets from cluster creation
    * Upload or create a SSL cert
        * If creating one, use DNS validation
    * Set target group name (ip-addr-target-group, IP type, port 3000)
5. Create Service
    * Fargate
    * 1 (or as many as you want) tasks
    * Select your task definition from step 2
    * Select both subnets from cluster creation
    * Create security group to allow access to your port (3000)
    * Use application load balancer created in previous step
        * Use 443 as listener port
        * Use target group from previous step
    * Uncheck Service discovery
6. Go back to load balancer to get DNS name and set up CNAME record