require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const API = require('call-of-duty-api')();

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

console.log(API.platforms);

const players = [
  {
    username: 'd_stutts',
    displayName: 'd_stutts', 
    platform: 'psn'
  },
  {
    username: 'parky914',
    displayName: 'parky914',
    platform: 'psn'
  },
  {
    username: 'waking1987',
    displayName: 'waking1987', 
    platform: 'psn'
  },
  {
    username: 'd-rabb12',
    displayName: 'd-rabb12', 
    platform: 'psn'
  },
  {
    username: 'burly1984',
    displayName: 'burly1984', 
    platform: 'psn'
  },
  {
    username: 'muskrat_mitch',
    displayName: 'musrkat_mitch', 
    platform: 'psn'
  },
  {
    username: 'robearpig',
    displayName: 'robearpig', 
    platform: 'psn'
  },
  {
    username: 'Tmank87#1253191',
    displayName: 'TMank87', 
    platform: 'uno'
  }
];

const getPlayerStats = (player) => {
  const { username, displayName, platform } = player;
  return API.MWBattleData(username, API.platforms[platform]).then(data => {
    return {
      ...data,
      playerName: displayName,
      platform
    };
  }).catch(err => {
      console.log(err);
  });
}

const getPlayerWeeklyStats = (player) => {
  const { username, platform, displayName } = player;
  return API.MWcombatwz(username, API.platforms[platform]).then(data => {
    return {
      ...data,
      playerName: displayName,
      platform
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

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server listening on ${port}`)
});