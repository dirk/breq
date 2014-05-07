var fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express()

app.use(bodyParser())
app.use(express.static(__dirname))

app.get('/', function(req,res){
  res.sendfile('test.html')
})
app.get('/breq.js', function(req,res){
  var data = fs.readFileSync(__dirname+'/../breq.js');
  res.type('application/javascript');
  res.send(data.toString())
})

app.get('/get', function(req, res){
  res.send('GET')
})
app.post('/post', function(req, res){
  res.send(req.body['foo'])
})
app.get('/timeout', function(req, res){
  setTimeout(function(){
    res.send('Waited')
  }, 1000)
})

console.log("Listening at http://localhost:3333")
app.listen(3333)
