const Twitter = require('twitter-lite')
const polka = require("polka");
const app = polka();

var tweet_count = 0;

var twitterLogins = require("./credentials.js")
var dbconfig = require("./dbconfig.js")

//SQL PART
var mysql = require('mysql');
var schedule = require('node-schedule');
// var stream;



const client = new Twitter({
  subdomain: "api",
  consumer_key: twitterLogins.api_key, // from Twitter.
  consumer_secret: twitterLogins.api_secret_key, // from Twitter.
  access_token_key: twitterLogins.access_token, // from your User (oauth_token)
  access_token_secret: twitterLogins.access_token_secret // from your User (oauth_token_secret)
});

client
  .get("account/verify_credentials")
  .then(results => {
    console.log("authenticated")
  })
  .catch(console.error);



  const parameters = {
    track: "caruso lakers , alex caruso",
    // track: "trump",
  };

  function createStream() {
    const stream = client.stream("statuses/filter", parameters)
      .on("start", response => console.log("start"))
      .on("data", tweet => {
        tweet_count++
        console.log("data", tweet.text)
        // console.log(tweet_count)
      })
      .on("ping", () => console.log("ping"))
      .on("error", error => console.log("error", error))
      .on("end", response => console.log("end"));
    return stream
  }


let stream;



  app
    .get("/create", (req, res) => {
      stream = createStream()
      res.end("stream created")
    })

    .get('/destroy', (req, res) => {
                  // callDestroy() , if this is called , record will duplicate
                  stream.destroy()

                  res.end("stream closed")


                    const followercount = client.get("users/show", {
                        screen_name: "ACFresh21"
                      }).then((result)=>{

                          var obj = {  tweet_count : tweet_count,followers : result.followers_count }
                            pushToDb(obj)
          })

/////////////////////////////////////////////////////


    })
    .listen(3000, err => {
      if(err) throw err
      console.log("running on 3k")
    })
      // console.log(tweet_count)






//ADDITIONAL FUNCTIONS

pushToDb = (obj) =>{
      console.log('in push to db function')
      console.log(obj)

    //  CONNECTING TO THE DATABASE
      var con = mysql.createConnection({
        host: dbconfig.host,
        user: dbconfig.user,
        password: dbconfig.password,
        database : dbconfig.database
      });

          con.connect(function(err) {
            if (err) throw err;
            console.log("Connected to SQL Database!");
                  //https://www.w3schools.com/nodejs/nodejs_mysql.asp
                  //PULLING FROM DATBAASE
                var sql = `INSERT INTO twitter_data (tweet_count, follower_count) VALUES (${obj.tweet_count}, ${obj.followers}) `;
                  con.query(sql, function (err, result) {
                   if (err) throw err;
                     console.log("1 record inserted");
                   });
          });



}


//SCHEDULE FUNCTIONS
//est to gmt
//8:30PM to 12:30AM
//GMT IS 4 HOURS AHEAD

// var scheduleDate = new Date( 2020, 2, 9, 12, 40, 0);
// console.log(scheduleDate)
//
// var endTime = new Date( 2020, 2, 9, 12, 40, 1);
// console.log(scheduleDate)

// var scheduleDate = new Date( 2020, 2, 9, 0, 34, 0);
// console.log(scheduleDate)
//
// schedule.scheduleJob( scheduleDate , function(){
//   console.log('STARTING SCHEDULE');
//   });

var scheduleDate = {hour: 0, minute: 43}   //REMEMBER TO CONVERT TO GMT
var endTime = {hour: 0, minute: 43}       //REMEMBER TO CONVERT TO GMT
    //TIME OF GAME PLUS 4 HOURS



        schedule.scheduleJob(scheduleDate, function(){
          stream = createStream()
          console.log('STARTING SCHEDULE');
          });





////DESTROY FUNCTION
        schedule.scheduleJob(endTime, function(){
            callDestroy()
            });





//ADDITIONAL FUNCTIONS

          callDestroy = () =>{
            stream.destroy()
            console.log('finishing stream...')
            console.log('attempting to push into db...')

            const followercount = client.get("users/show", {
                screen_name: "ACFresh21"
                }).then((result)=>{

                  var obj = {  tweet_count : tweet_count,followers : result.followers_count }
                    pushToDb(obj)
              })


  }




//TABLE

// create table nba_stats(
//   points int NOT NULL,
//   assists int NOT null,
//   rebounds int NOT null,
//   mydatetime TimeStamp NOT NULL
// )
