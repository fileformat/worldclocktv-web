#!/bin/bash
#docker login -u oauth2accesstoken -p "$(gcloud auth print-access-token)" https://gcr.io

set -o errexit
set -o pipefail
set -o nounset

docker build -t worldclock-tv .
docker tag worldclock-tv:latest gcr.io/mysideprojects/worldclock-tv:latest
docker push gcr.io/mysideprojects/worldclock-tv:latest

export $(cat .env)

gcloud beta run deploy worldclock-tv \
	--allow-unauthenticated \
	--image gcr.io/mysideprojects/worldclock-tv \
	--platform managed \
	--project mysideprojects \
    --region us-central1 \
	--update-env-vars "COMMIT=$(git rev-parse --short HEAD),LASTMOD=$(date -u +%Y-%m-%dT%H:%M:%SZ),GMAPS_ID=${GMAPS_ID}"
