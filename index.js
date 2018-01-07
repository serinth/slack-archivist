'use strict';

exports.http = (req, res) => {
  const projectId= 'slack-chatbot-ml';
  const datasetId = 'prepare2fly';
  const tableId = 'messages';
  const challenge = req.body.challenge;

  if(challenge) {
    res.status(200).send(challenge);
  } else {
    const rows = [];
    const record = getMessageEvent(req.body);

    if(record) {
      rows.push(record);
      insertRowsAsStream(datasetId, tableId, rows, projectId)
        .then(() => {
          res.status(200).send('OK');
        });
    } else {
      res.status(400).send('Unhandled');
    }

  }
};

function insertRowsAsStream(datasetId, tableId, rows, projectId) {
  //[START bigquery_insert_stream]
  const BigQuery = require('@google-cloud/bigquery');

  //const rows = [{name: "Tom", age: 30}, {name: "Jane", age: 32}];

  const bigquery = new BigQuery({
    projectId: projectId,
  });

  return bigquery
    .dataset(datasetId)
    .table(tableId)
    .insert(rows)
    .then(() => {
      console.log(`Inserted ${rows.length} rows`);
    })
    .catch(err => {
      if (err && err.name === 'PartialFailureError') {
        if (err.errors && err.errors.length > 0) {
          console.log('Insert errors:');
          err.errors.forEach(err => console.error(err));
        }
      } else {
        console.error('ERROR:', err);
      }
    });
}

function getMessageEvent(body) {
  return body.event.type == 'message' ? {
    user: body.event.user,
    ts: body.event.ts,
    message: body.event.text,
    channel: body.event.channel,
    event_id: body.event_id
  } : undefined;
};
