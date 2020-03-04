const Twitter = require('twitter-lite')
const polka = require("polka");
const app = polka();

var tweet_count = 0;



//SQL PART
var mysql = require('mysql');


// var con = mysql.createConnection({
//   host: "imc.kean.edu",
//   user: "niedzwid",
//   password: "1014915",
//   dbname : "2020S_niedzwid"
// });
//
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected to SQL Database!");
//         //https://www.w3schools.com/nodejs/nodejs_mysql.asp
//         //PULLING FROM DATBAASE
// });

//
// $server = 'imc.kean.edu';
// $login = 'niedzwid';
// $password = '1014915';
// $dbname = 'CPS3740';







////

// API key: 2mBHVx1TSXQXM6HiiFYbdhlyz
// API secret key: zUiIIO6W7stK1zADcwuB5tMCgkMQiXmGS0J1O0hs7YNkrB3LLN

// access token 3379767821-K86jLQaVMvFaHpir8Q4usrEbxdVW055ByZfy434
// access token secret C7waFtUwsMRGe3Ou6jYMEoo1rPFHvwB1ppqQCDeYN34dG

// Consumer Key = API Key
// Consumer Secret = API Secret

var api_key = "2mBHVx1TSXQXM6HiiFYbdhlyz";
var api_secret_key = "zUiIIO6W7stK1zADcwuB5tMCgkMQiXmGS0J1O0hs7YNkrB3LLN";
var access_token = "3379767821-K86jLQaVMvFaHpir8Q4usrEbxdVW055ByZfy434";
var access_token_secret = "C7waFtUwsMRGe3Ou6jYMEoo1rPFHvwB1ppqQCDeYN34dG"

const client = new Twitter({
  subdomain: "api",
  consumer_key: api_key, // from Twitter.
  consumer_secret: api_secret_key, // from Twitter.
  access_token_key: access_token, // from your User (oauth_token)
  access_token_secret: access_token_secret // from your User (oauth_token_secret)
});

client
  .get("account/verify_credentials")
  .then(results => {
    console.log("authenticated")
  })
  .catch(console.error);



  const parameters = {
    track: "lakers",
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
        stream.destroy()

        res.end("stream closed")

        var obj = {}

        // var d = new Date()
        // var year = d.getFullYear()
        // var month = d.getMonth()
        // var day = d.getDate()
        // var hour = d.getHours()-5
        //
        // var min = d.getMinutes()
        // var second = d.getSeconds()
        //
        // currentTime = `${month}/${day}/${year} : ${hour}:${min}:${second}`


        const followercount = client.get("users/show", {
            screen_name: "ACFresh21"
            }).then((result)=>{
              // console.log(`Alex Caruso follower count :${result.followers_count}`)
                 var obj = {  tweet_count : tweet_count,
                              followers : result.followers_count }
                              // console.log(obj) //showing object
                              pushToDb(obj)

          })





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
    host: "imc.kean.edu",
    user: "niedzwid",
    password: "1014915",
    database : "2020S_niedzwid"
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to SQL Database!");
          //https://www.w3schools.com/nodejs/nodejs_mysql.asp
          //PULLING FROM DATBAASE

        var sql = `INSERT INTO twitter_data (tweet_count, follower_count) VALUES (${obj.tweet_count}, ${obj.followers}) `;
        // var sql = `INSERT INTO twitter_data (${name}, ${address}) VALUES (${Company Inc}, ${Highway 37}) `;
          con.query(sql, function (err, result) {
           if (err) throw err;
             console.log("1 record inserted");
           });

  });




  // con.connect(function(err) {
  //   if (err) throw err;
  //   console.log("Connected!");
  //   // var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
  //   // con.query(sql, function (err, result) {
  //   //   if (err) throw err;
  //   //   console.log("1 record inserted");
  //   // });
  // });













  //create tables for database NEXT
  //push to datbase NEXT
}
























//TABLE

// create table twitter_data(
//   tweet_count int NOT NULL,
//   follower_count int not null,
//   mydatetime TimeStamp NOT NULL
// )
