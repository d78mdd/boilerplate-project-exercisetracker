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

          myData8.find({_id: data1._id})
          .exec(function(err, data) {
            console.log(data[0].exercises)
          })

          //res.json(data);
        })
        
      })
    })
  
  }
  


})








app.post("/api/exercise/log/", function(req, res){
  
  if (!req.body._id ) {
    let errMsg = "invalid id" 

    console.log(errMsg)
    res.json(errMsg)
    
  } else {
    log()
  }

  function log (){
    
    myData8.findById(req.body._id)
    .exec(function(err, data){

      //console.log(req.body.from, req.body.to, req.body.limit)

      let resultTemp = []
      let result = []

      let startD = new Date(req.body.from)
      let endD = new Date(req.body.to)

      let fromOk  =  startD != "Invalid Date"
      let toOk  =  endD != "Invalid Date"

      let size = data.exercises.length
      let limit = Number(req.body.limit)   // make sure it's a number

      //console.log(resultTemp , startD, endD, size, limit)

      //filter according to 'from' and 'to'
      for ( let i=0; i<size; i++ ){

        let date = data.exercises[i].date
        let ex = data.exercises[i]

        if ( fromOk  &&  !toOk ) {
          if ( date > startD ) {
            resultTemp.push(ex)
          }
        } else if ( !fromOk  &&  toOk ) { 
          if ( date < endD ) {
            resultTemp.push(ex)
          }
        } else if ( fromOk  &&  toOk) {
          if ( date>startD && date<endD ) {
            resultTemp.push(ex)
          }
        } else if ( !fromOk  &&  !toOk ) {
          resultTemp.push(ex)
        }
        //console.log(data.exercises[i].date - data.exercises[i+1].date)
      }
      //console.log(resultTemp)


      //sort ascending
      resultTemp.sort((a,b)=>a.date-b.date)
      //console.log(resultTemp)


      //limit from 0th to 'limit'th
      if ( !!limit ) {    // if valid
        for ( let i=0; i<limit; i++ ){
          result.push(resultTemp[i])
        }
      } else {          // if empty or invalid
        result = [...resultTemp]
      }
      console.log(result)
      res.json(result)

    })
  
  }

})




const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('app listening on ' + listener.address().port);
});











/*
  TODO
  todo1   (assuming "todo1 resides somewhere in the code")
    ...
  todo2
    ...
*/