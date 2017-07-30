const express = require('express')
var request = require('request');
var cheerio = require('cheerio');
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/standings', function (req, res) {
  var teams = {};

  var url = 'http://www.cbssports.com/mlb/standings'
  request(url, function(error, response, html){
      if(!error){

          var $ = cheerio.load(html);

          $('tr').each(function(tr_index, tr) {
            var teamRow = $(this)
            var children = $(this).children();
            var teamName = normalizeTeam($(children[0]).text())
            var wins = Number($(children[1]).text())
            var losses = Number($(children[2]).text())

            teams[teamName] = {wins: wins, losses: losses}

          });
          res.send(formatResponse(players, teams))
        }

  })

})

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
})

var normalizeTeam = function(team) {
  var index = team.indexOf('(')
  var normalizedTeam = team.substring(0, index != -1 ? index : team.length);
  normalizedTeam = normalizedTeam.trim()
  return normalizedTeam;
}

var formatResponse = function(players, teams) {
  players.forEach(function(player){
    player = updatePlayer(player, teams)
  })

  var sortedPlayers = players.sort(compare)

  return toStringResponse(sortedPlayers);
}

var toStringResponse = function(players) {
  var response = "Standings are as follows: \n"
  players.forEach(function(player, index){
    response += index +1 + ". " + player.name + "- Wins: " + player.wins + " Losses: " + player.losses + " Win %: " + player.winPct.toFixed(3) +  "\n"
  })

  var responseBody = {
  "speech": response,
  "displayText": response,
  "source": "JeffBot"
  }

  return responseBody;
}

var updatePlayer = function(player, teams) {
  player.wins = 0
  player.losses = 0
  player.winPct = 0
  player.teams.forEach(function(team) {
    player.wins +=  teams[team].wins
    player.losses += teams[team].losses
  })
  player.winPct = player.wins / (player.wins + player.losses)
}

var compare = function(player1, player2) {
  if (player1.winPct > player2.winPct) {
    return -1;
  }
  if (player1.winPct < player2.winPct) {
    return 1;
  }
  return 0;
}

var tyler = {name: 'Tyler', teams: ['Boston', 'Tampa Bay', 'L.A. Angels', 'Milwaukee'] }
var mike = {name: 'Mike', teams: ['Chi. Cubs', 'Baltimore', 'Pittsburgh', 'Oakland'] }
var russ = {name: 'Russ', teams: ['Cleveland', 'Toronto', 'Colorado', 'Minnesota'] }
var tim = {name: 'Tim', teams: ['L.A. Dodgers', 'Texas', 'Kansas City', 'Chi. White Sox'] }
var jeff = {name: 'Jeff', teams: ['Washington', 'Seattle', 'Arizona', 'Atlanta'] }
var mark = {name: 'Mark', teams: ['St. Louis', 'San Francisco', 'Detroit', 'Philadelphia'] }
var rob = {name: 'Rob', teams: ['N.Y. Yankees', 'Houston', 'N.Y. Mets', 'Miami']}

var players = [rob, jeff, tyler, mike, russ, tim, mark]
