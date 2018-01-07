const expect = require('chai').expect;
const chai = require('chai');
const getMessageEvent = require('./index').getMessageEvent;
const handler = require('./index').http;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require("chai-as-promised");
const proxyquire = require('proxyquire');

chai.use(chaiAsPromised);
chai.use(sinonChai);

const eventBody = {
  event: {
    type: 'message',
    ts: '1515294789',
    user: 'UXXX',
    text: 'Hello World!',
    channel: 'CHXXX'
  },
  event_id: 'eventId'
};

describe("getMessageEvent", () => {
  it('should return undefined on non message type', () => {
    const eventBody = {
      event: {
        type: 'notMessage'
      }
    };

    expect(getMessageEvent(eventBody)).to.be.undefined;
  });

  it('should return BigQuery message table object', () => {
    const expectedMessage = {
      user: 'UXXX',
      ts: '1515294789',
      message: 'Hello World!',
      channel: 'CHXXX',
      event_id: 'eventId'
    };

    const message = getMessageEvent(eventBody);

    expect(message).to.eql(expectedMessage);
  });
});

describe('http handler', () => {
  let res, sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    res = {
      status: sandbox.spy(),
      send: sandbox.spy()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should handle Slack challenge and return the challenge value', () => {
    const req = {
      body: { challenge: 'CHALLENGE' }
    };

    handler(req, res);
    expect(res.status).to.be.calledWith(200);
    expect(res.send).to.be.calledWith('CHALLENGE');
  });
});
