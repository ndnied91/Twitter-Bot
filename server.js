const Twitter = require('twitter-lite')
const polka = require("polka");
const app = polka();

var tweet_count = 0;

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
    track: "ronaldo",
  };

  function createStream() {
    const stream = client.stream("statuses/filter", parameters)
      .on("start", response => console.log("start"))
      .on("data", tweet => {
        tweet_count++
        console.log("data", tweet.text)
        console.log(tweet_count)
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
    })
    .listen(3000, err => {
      if(err) throw err
      console.log("running on 3k")
    })
      // console.log(tweet_count)
