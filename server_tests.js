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
const myDataSchema = new mongoose.Schema({
	number: Number
});
const myData = mongoose.model('myData', myDataSchema);
*/

const myDataSchema = new mongoose.Schema({
	exercises:[Number]
});
const myData = mongoose.model('myData', myDataSchema);




app.post("/api/exercise/log/", function(req, res){
/*
  myData.findById(req.query.userId).gt('exercises.date', req.query.from).lt('exercises.date', req.query.to).limit(req.query.limit).exec(function(err, data){
    console.log(data)
    res.json(data)
  })
*/

/*let n1 = new myData({number:Number(req.body.username)})
n1.save(function(err, data) {
		console.log('saved')
    console.log(data)
})*/

//myData.find(function(err,data){console.log(data)})

//myData.find().gt('number','45').exec(function(err,data){console.log(data)})


/*
let d1 = new myData({date:new Date(req.body.username)})
d1.save(function(err, data) {
		console.log('saved')
    console.log(data)
})*/

//myData.find(function(err,data){console.log(data)})

//myData.find().gt('date','2014-07-25').exec(function(err,data){console.log(data)})

//myData.find().gt('date','2014-07-25').lt('date','2014-08-03').limit(3).exec(function(err,data){console.log(data)})


//myData.find({name:'d78mdd'},function(err,data){console.log(data)})

/*
let d2 = new myData()
d2.exercises.push(5)
console.log(d2)
console.log(d2.exercises)
d2.save(function(err, data) {
		console.log('saved')
    console.log(data)
})*/


myData.findById(req.body._id, function(err,data){
  console.log(req.body)
  console.log(data)
  console.log(data.exercises)
  data.exercises.push(5)
  console.log(data)
  console.log(data.exercises)
})





})






const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port);
});


/*

result:


 npm start

> fcc-exercise-tracker@0.1.0 start /home/runner/boilerplate-project-exercisetracker-1
> node server_tests.js

Your app is listening on port 3000
connected yay
[Object: null prototype] {
  _id: '5f563b07ba4d6803a7ca582e',
  from: '',
  to: '',
  limit: ''
}
{
  exercises: [],
  _id: 5f563b07ba4d6803a7ca582e,
  name: 'd7m',
  __v: 9,
  date: '1234-12-34',
  description: '',
  duration: null
}
[]
{
  exercises: [ 5 ],
  _id: 5f563b07ba4d6803a7ca582e,
  name: 'd7m',
  __v: 9,
  date: '1234-12-34',
  description: '',
  duration: null
}
[5]
*/