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
const myData8Schema = new mongoose.Schema({
	number: Number
});
const myData8 = mongoose.model('myData8', myData8Schema);
*/

const myData8Schema = new mongoose.Schema({
	name: {type: String, default: "anon" },
  exercises: [{
    description: { type: String, default: "short one" },
    duration: { type: Number, default: 10 },
    date: { type: Date, default: Date.now }
  }]
});
const myData8 = mongoose.model('myData8', myData8Schema);





myData8.find()
    .select('name _id')
    .exec(function(err, data) {
			console.log(data);
});

app.post('/api/exercise/new-user', function(req, res) {
	let result = {};

	const datum1 = new myData8({
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

  // output on the console and page
		myData8.find()
    .select('-_id -__v -exercises._id')
    .exec(function(err, data) {
			console.log(data);
		  res.json(data);
		});
	});
});


app.post("/api/exercise/add", function(req, res){
  
  if ( !req.body._id ) {
    myData8.find(function(err,data){
       
      let lastIndex = data.length-1
      let lastObject = new myData8(data[lastIndex])
      
      console.log("no ID provided, adding to the last one -" , lastObject._id)

      add(lastObject._id)
    })
  } else {

    add(req.body._id)
  }
 
  function add(id){
    
    myData8.findById(id, function(err, data1){


      //console.log(data1)

      let exercise = {
        description: req.body.description || undefined,
        duration: req.body.duration || undefined,
      }
      if (req.body.date) {
        exercise.date = new Date(req.body.date)
      } else {
        exercise.date = undefined
      }

      data1.exercises.push(exercise)

      

      data1.save(function(err, data){

        // output on the console and page
        myData8.find()
        .select('-_id -__v -exercises._id')
        .exec(function(err, data) {

          myData8.find({name: data1.name})
          .exec(function(err, data) {
            console.log(data[0].exercises)
          })

          res.json(data);
        })
        
      })
    })
  
  }
  


})








app.post("/api/exercise/log/", function(req, res){
  
  myData8.findById(req.body._id)
  //.gt('exercises.date', req.body.from)
  //.lt('exercises.date', req.body.to)
  //.limit(req.body.limit)
  .exec(function(err, data){

    //console.log(req.body.from, req.body.to, req.body.limit)

    let result = []

    let startD = new Date(req.body.from)
    let endD = new Date(req.body.to)

    let size = data.exercises.length
    let limit = req.body.limit

    //console.log(result , startD, endD, size, limit)

    //filter according to 'from' and 'to'
    for ( let i=0; i<size-1; i++ ){

      let date = data.exercises[i].date
      if ( date>startD && date<endD ) {
        //console.log(i, date)
        result.push(date)
      }

      //console.log(data.exercises[i].date - data.exercises[i+1].date)

    }
    
    //sort ascending
    result.sort((a,b)=>a-b)
    console.log(result)


    //limit from 0th to 'limit'th



    //console.log(result)
    //res.json(result)
  })
  

  /*
  let n1 = new myData8({number:Number(req.body.username)})
  n1.save(function(err, data) {
		console.log('saved')
    console.log(data)
  })*/

  //myData8.find(function(err,data){console.log(data)})

  //myData8.find().gt('number','45').exec(function(err,data){console.log(data)})


  /*
  let d1 = new myData8({date:new Date(req.body.username)})
  d1.save(function(err, data) {
		console.log('saved')
    console.log(data)
  })*/


  //myData8.find(function(err,data){console.log(data)})


  //myData8.find().gt('date','2014-07-25').exec(function(err,data){console.log(data)})

  //myData8.find().gt('date','2014-07-25').lt('date','2014-08-03').limit(3).exec(function(err,data){console.log(data)})


  //myData8.find({name:'d78mdd'},function(err,data){console.log(data)})

  /*
  let d2 = new myData8()
  d2.exercises.push(5)
  console.log(d2)
  console.log(d2.exercises)
  d2.save(function(err, data) {
  		console.log('saved')
      console.log(data)
  })*/


  //  myData8.findById(req.body._id  /*"5f563b07ba4d6803a7ca582e"*/ , function(err,data){
  //  console.log(req.body)
  //  console.log(data)
  //  console.log(data.exercises)
  //
  //
  //})





})






const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('app listening on ' + listener.address().port);
});




