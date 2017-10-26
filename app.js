var express = require('express'); 
var compress = require('compression');
var cookieParser = require('cookie-parser');

var app = express();
app.set('view engine', 'pug');
app.use(compress({ threshold: 0 , filter: shouldCompress })); //gzip
app.use(express.static(__dirname + '/public'))
    .use(cookieParser());
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Routes
var home = require('./routes/home.js');

//Pages
app.get('/', home.index);

///////////////////////
//Handle closing node//
///////////////////////
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) console.log('clean');
    if (err){
      console.log(err.stack);
      emailError('Uncaught Exception', err.stack);
    } 
    if (options.exit) process.exit();
}

//compression
function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header 
    return false
  }
 
  // fallback to standard filter function 
  return compress.filter(req, res)
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));


//Run the app

var port = Number(process.env.PORT || 3500)
console.log('Listening on '+port);
app.listen(port);