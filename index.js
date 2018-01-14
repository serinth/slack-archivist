'use strict';
const insertRowsAsStream = require('./bigquery').insertRowsAsStream

exports.http = (req, res) => {
  const projectId = '';
  const datasetId = '';
  const tableId = '';
  const challenge = req.body.challenge;

  if(challenge) {
    res.status(200);
    res.send(challenge);
  } else {    
    const record = this.getMessageEvent(req.body);

    if(record) {      
      insertRowsAsStream(datasetId, tableId, [record], projectId)
        .then(() => {
          res.status(200);
          res.send('OK');
        });
    } 
  }
};

/* 
  TODO: validations and better testing
  At the moment just let the function fail, we don't care about junk requests
*/

exports.getMessageEvent = (body) => {
  return body.event.type == 'message' ? {
    user: body.event.user,
    ts: body.event.ts,
    message: body.event.text,
    channel: body.event.channel,
    event_id: body.event_id
  } : undefined;
};
