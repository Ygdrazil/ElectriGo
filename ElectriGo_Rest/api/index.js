var cors = require('cors')
var express = require('express')

var app = express();

app.use(cors());

app.use(express.json());

app.post('/cost', (req, res) => {
    let distance = req.body.distance;
    let cost = distance * 16 / (100 * 1000) * 0.1582;
    res.send({cost: cost});
})

app.listen(3000, () => { console.log("Server running on port 3000"); });

module.exports = app;
