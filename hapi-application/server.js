var Hapi = require('hapi'),
	uuid = require('uuid'),
    server = new Hapi.Server();

server.connection( {port: 3000});
var data = {};
var cards = {};

server.ext('onRequest', function(request, reply) {
	console.log("Request received: " + request.path);
	reply.continue();
	var ip = request.info.remoteAddress;
});

server.route({
	path: '/',
	method: 'GET',
	handler: {
		file: 'templates/index.html'
	}
});

server.route({
	path: '/cards/new',
	method: ['GET', 'POST'],
	handler: newCardHandler
});



server.route({
	path: '/cards',
	method: 'GET',
	handler: cardsHandler
})

server.route({
	path: '/assets/{path*}',
	method: 'GET',
	handler: {
		directory: {
			path: './public',
			listing: false
		}
	}
});
    
function newCardHandler(request, reply) {
	if(request.method === 'get') {
		console.log('GET request')
		reply.file('templates/new.html');
	} else {

		data = {
			name: 				request.payload.name,
			recipient_email: 	request.payload.recipient_email,
			sender_name: 		request.payload.sender_name,
			sender_email: 		request.payload.sender_email,
			card_image: 		request.payload.card_image
		}

		saveCard(data);
		console.log(cards);
		reply.redirect('/cards');
	}
} 


function saveCard(card) {
	var id = uuid.v1();
	card.id = id;
	cards[id] = card;
}
function cardsHandler(request, reply) {
	reply.file('templates/cards.html');
}


server.start(function() {
	console.log("Listening on port" + server.info.uri);
});




