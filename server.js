require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const API = require('call-of-duty-api')(({platform: 'psn'}));
const port = 5500;

app.use(cors());

app.use(function(req, res, next)
{ res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE"); 
next(); 
});

API.login(process.env.COD_EMAIL, process.env.COD_PW).then((res) => {
  console.log(res);
}).catch((err) => {
  console.log(err);
});

const players = ['d_stutts', 'parky914', 'waking1987', 'd-rabb12', 'burly1984', 'muskrat_mitch', 'robearpig'];

const getPlayerStats = (player) => {
  return API.MWBattleData(player).then(data => {
    return {
      ...data,
      playerName: player
    };
  }).catch(err => {
      console.log(err);
  });
}

const getPlayerWeeklyStats = (player) => {
  return API.MWcombatwz(player).then(data => {
    return {
      ...data,
      playerName: player
    };
  }).catch(err => {
      console.log(err);
  });
}

app.get('/', (req, res) => {
  const results = Promise.all(players.map(getPlayerStats));
  results.then((data) => {
    res.send(data);
  })
});

app.get('/weekly', (req, res) => {
  const results = Promise.all(players.map(getPlayerWeeklyStats));
  results.then((data) => {
    res.send(data);
  })
});

app.listen(port, () => {
    console.log(`Server listening on ${port}`)
});