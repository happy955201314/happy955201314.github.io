require('dotenv').config();

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000;
const db = require('./query')
const path = require('path');

app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname,'dist')));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get(/^\/page\/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist','index.html'));
})

app.get('/data/trackingData', db.getTrackingData);

app.get('/data/objectTable', db.getObjectTable);

app.get('/data/lbeaconTable', db.getLbeaconTable);

app.get('/data/gatewayTable', db.getGatewayTable);

app.post('/data/trackingData', db.getTrackingData);

app.listen(PORT, () => {
    console.log(`App running on PORT ${PORT}.`)

})

