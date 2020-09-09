const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const cors = require('cors');

const mongoose = require('mongoose');



mongoose.connect(
	process.env.MLAB_URI,
	{ useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('connected yay');
});



app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});




const myDataSchema = new mongoose.Schema({
	name: String,
  description: String,
  duration: Number,
  date: String
});
const myData = mongoose.model('myData', myDataSchema);




// readme point 1
app.post('/api/exercise/new-user', function(req, res) {
	let result = {};

	const datum1 = new myData({ name: req.body.username });

	datum1.save(function(err, data) {
		console.log('saved');

		myData.find({ name: req.body.username }, function(err, data) {
			console.log(data);

			result._id = data[0]._id;
			result.name = data[0].name;

			console.log(result);
			res.json(result);
		});
	});
});


// readme point 2
app.get('/api/exercise/users', function(req, res) {
	myData.find(function(err, data) {
		let result = []
		for (let i = 0; i < data.length; i++) {
			result[i] = {};
			result[i]._id = data[i]._id;
			result[i].name = data[i].name;
		}
		console.log(result);
		res.json(result);
	});
});



myData.find(function(err,data){
  for(let i=0; i<data.length; i++){
    console.log(data[i]["_id"])
  }
})


// readme point 3
// exercises thing should be an array?
app.post("/api/exercise/add", function(req, res){
  myData.findById(req.body._id, function(err, data){

    //console.log(data)
    
    data.description = req.body.description
    data.duration = req.body.duration
    data.date = req.body.date

    if ( !data.date ) {
      data.date = new Date()
    }

    data.save(function(err, data){console.log("saved")})
    
    let result = {
      _id: data._id,
      name: data.name,
      description: data.description,
      duration: data.duration,
      date: data.duration
    }
    console.log(result)
    res.json(result)
    
  })
})







// Not found middleware
app.use((req, res, next) => {
	return next({ status: 404, message: 'not found' });
});

// Error Handling middleware
app.use((err, req, res, next) => {
	let errCode, errMessage;

	if (err.errors) {
		// mongoose validation error
		errCode = 400; // bad request
		const keys = Object.keys(err.errors);
		// report the first validation error
		errMessage = err.errors[keys[0]].message;
	} else {
		// generic or custom error
		errCode = err.status || 500;
		errMessage = err.message || 'Internal Server Error';
	}
	res
		.status(errCode)
		.type('txt')
		.send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port);
});
