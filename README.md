# The Slack Archivist

This test app uses Slack's Event API to record all messages on public channels and pushes it to BigQuery using Google Cloud Functions.
The code uses [Serverless Framework](https://serverless.com/framework/docs/providers/google/).


# Requirements
- GCP Account with API's enabled
- Service account created via IAM (put it in `~/.gcloud/`)
- BigQuery Dataset and Table created with the following structure:

```
+---------------------------------+
| event_id       | string         |
| channel        | string         |
| user           | string         |
| message        | string         |
| ts             | timestamp      |
+---------------------------------+
```
# Quick Start

```bash
npm install -g serverless
npm i
serverless deploy
```
Then to test it out:
```bash
curl -X POST -d '{"event_id":"id","channel":"ch","user":"me","ts":"1515294789.000006"}' <MY_FUNC_URL>
```

