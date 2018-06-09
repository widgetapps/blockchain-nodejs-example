# Simple Blockchain Example
## Written in NodeJS and ExpressJS

This example is based on the wonderful article [Learn Blockchains by Building One](https://hackernoon.com/learn-blockchains-by-building-one-117428612f46)
written by [Daniel van Flymen](https://hackernoon.com/@vanflymen?source=post_header_lockup).

Clone the repo then do the following to get a node running:

```
npm install
node client.js [port]
```

The `port` argument is optional. If you do not declare the port, then 3101 is used. If you use
a process manager (like PM2), you can pass on the port & IP via environment variable.

You'll want to get multiple instances of the client running, then you can use your favourite
URL request/response software (Postman, cURL, etc) to hit teh clients via RESTful calls.

These are the calls you can make:

```
POST /transactions/new { "sender": "hash", "recipient": "hash", "amount": 50 }
GET /chain
GET /mine
POST /nodes/register { "nodes": ["ip:port"] }
GET /consensus
```

Once you have intances installed, you should send the `POST /nodes/register` to each running
node with the list of nodes you are running.