var games;

var conn = new WebSocket('ws://localhost:8080');
conn.onopen = function(e) {
    
};

conn.onmessage = function(e) {    
    
	var message = $.parseJSON(e.data);

	switch (message.type) {
		
		case 'init':

			setupScoreboard(message);
			break;

		case 'goal':

			goal(message);
			break;

  }

};

function setupScoreboard(message) {
	
	// Create a global reference to the list of games
	games = message.games;

	var template = '<tr data-game-id="{{ game.id }}"><td class="team home"><h3>{{game.home.team}}</h3></td><td class="score home"><div id="counter-{{game.id}}-home" class="flip-counter"></div></td><td class="divider"><p>:</p></td><td class="score away"><div id="counter-{{game.id}}-away" class="flip-counter"></div></td><td class="team away"><h3>{{game.away.team}}</h3></td></tr>';

	$.each(games, function(id){		
		var game = games[id];				
		$('#scoreboard table').append(Mustache.render(template, {game:game} ));		
		game.counter_home = new flipCounter("counter-"+id+"-home", {value: game.home.score, auto: false});
		game.counter_away = new flipCounter("counter-"+id+"-away", {value: game.away.score, auto: false});
	});

}

function goal(message) {	
	games[message.game][message.team]['score']++;
	var counter = games[message.game]['counter_'+message.team];
	counter.incrementTo(games[message.game][message.team]['score']);
}

$(function () {

	$(document).on('click', '.team h3', function(e){
		var game = $(this).parent().parent().attr('data-game-id');		
		var team = ($(this).parent().hasClass('home')) ? 'home' : 'away';
		conn.send(JSON.stringify({ type: 'goal', team: team, game: game }));
	});

});



