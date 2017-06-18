const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/standings', function (req, res) {
  res.send(response)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

var response = {
"speech": "1. Rob Miller, 2. Jeff Hebert",
"displayText": "1. Rob Miller, 2. Jeff Hebert... ",
"source": "JeffBot"
}
