require([

	"js/game"

], function(Game) {

	var game = new Game();

	document.getElementById("game").appendChild(game.getContainer());

	game.start();

});