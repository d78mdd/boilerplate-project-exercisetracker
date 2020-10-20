const express = require('express');
const app = express();
const bodyParser = require('body-parser');

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



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});



/*
const myData3Schema = new mongoose.Schema({
	number: Number
});
const myData3 = mongoose.model('myData3', myData3Schema);
*/

const myData3Schema = new mongoose.Schema({
	name: {type: String, default: "anon" },
  exercises: [{
    description: { type: String, default: "short one" },
    
    duration: { type: Number, default: 10 },
    date: { type: Date, default: Date.now }
  }]
}, { minimize: false });
const myData3 = mongoose.model('myData3', myData3Schema);




app.post('/api/exercise/new-user', function(req, res) {
	let result = {};

	const datum1 = new myData3({
    //name: req.body.username,
    name: req.body.username || undefined,
    exercises: {
      description: undefined,
      duration: undefined,
      date: undefined
    }
  });

	datum1.save(function(err, data) {
		console.log('saved');

		myData3.find( function(err, data) {
			console.log(data);
			//result._id = data[0]._id;
			//result.name = data[0].name;
			//console.log(result);
		  res.json(data);
		});
	});
});

app.post("/api/exercise/add", function(req, res){
  myData3.findById(req.body._id, function(err, data){   // findOneAndUpdate() instead ?

    //console.log(data)
    
    let obj = {}
    obj.description = req.body.description
    obj.duration = req.body.duration
    if (req.body.date)
      obj.date = req.body.date
    data.exercises.push(obj)

    data.save(function(err, data){console.log("saved")})
    
    let result = {
      _id: data._id,
      name: data.name,
      exercises: [obj]
    }
    console.log(result)
    res.json(result)
    
  })
})








app.post("/api/exercise/log/", function(req, res){
  /*
  myData3.findById(req.query.userId).gt('exercises.date', req.query.from).lt('exercises.date', req.query.to).limit(req.query.limit).exec(function(err, data){
    console.log(data)
    res.json(data)
  })
  */

  /*
  let n1 = new myData3({number:Number(req.body.username)})
  n1.save(function(err, data) {
		console.log('saved')
    console.log(data)
  })*/

  //myData3.find(function(err,data){console.log(data)})

  //myData3.find().gt('number','45').exec(function(err,data){console.log(data)})


  /*
  let d1 = new myData3({date:new Date(req.body.username)})
  d1.save(function(err, data) {
		console.log('saved')
    console.log(data)
  })*/

  myData3.find(function(err,data){console.log(data)})

  //myData3.find().gt('date','2014-07-25').exec(function(err,data){console.log(data)})

  //myData3.find().gt('date','2014-07-25').lt('date','2014-08-03').limit(3).exec(function(err,data){console.log(data)})


  //myData3.find({name:'d78mdd'},function(err,data){console.log(data)})

  /*
  let d2 = new myData3()
  d2.exercises.push(5)
  console.log(d2)
  console.log(d2.exercises)
  d2.save(function(err, data) {
  		console.log('saved')
      console.log(data)
  })*/


  //  myData3.findById(req.body._id  /*"5f563b07ba4d6803a7ca582e"*/ , function(err,data){
  //  console.log(req.body)
  //  console.log(data)
  //  console.log(data.exercises)
  //
  //
  //})





})






const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port);
});



