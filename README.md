# ip-addr

A simple service for looking up your IP address, returns as JSON. Available at https://ip-addr.shultzlab.com/

## Usage

```
$ curl https://ip-addr.shultzlab.com/json
```

## Why?

* Wanted simple way to get IP
* Wanted to learn about GKE, CloudBuild, and Google Container Registry
* Had GCP Credits

## Run locally (with Node.js)

1. `yarn install`
2. `yarn start:dev`

## Run locally (with Docker)

1. `docker image build -t ip-addr:stable .`
2. `docker run --rm -d -p 3000:3000/tcp ip-addr:stable`

