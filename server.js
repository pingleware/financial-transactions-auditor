const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers')

var argv = yargs(hideBin(process.argv))
.option('host', {
    alias: 'h',
    type: 'string',
    description: 'host name',
    default: 'localhost',
    required: false
})
.option('port', {
    alias: 'p',
    type: 'number',
    description: 'port',
    default: 3000,
    required: false
})
.parse()

let host = argv.host;
let port = argv.port;

const express = require("express");
const logger = require("morgan");
const compression = require("compression");

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// routes
app.use(require("./routes/api.js"));

app.listen(port,host, () => {
  console.log(`App running on port http://${host}:${port}!`);
});