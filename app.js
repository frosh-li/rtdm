var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser')
var redis = require('redis');
var redisClient = redis.createClient({
	host: 'w10551.sit.wdds.redis.com',
	port: 10551
})
var shakeClient = redis.createClient({
	host: 'w10551.sit.wdds.redis.com',
	port: 10551
})

var memberClient = redis.createClient({
	host: 'w10551.sit.wdds.redis.com',
	port: 10551
})

var gmvClient = redis.createClient({
	host: 'w10551.sit.wdds.redis.com',
	port: 10551
})

var beaconClient = redis.createClient({
	host: 'w10551.sit.wdds.redis.com',
	port: 10551
})


var session = require('express-session');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());
/*
app.use(session({
	secret: '1234567890QWERTY',
	name: 'srs',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
	cookie: {maxAge: 80000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
	resave: false,
	saveUninitialized: true,
}));
*/
// app.use(session({
//     store: new FileStore(),
//     secret: '1234567890QWERTY',
//     resave: true,
// 	cookie: {maxAge: 1000*60*30},
//     saveUninitialized: true
//   })
// );



console.log('current env', JSON.stringify(process.env.NODE_ENV));


//设置跨域访问  
app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
});  



var request = require('request');

global.plazaList = [];
global.plazaMap = {};
global.cityMap = {};

request('https://api.ffan.com/cdaservice/v3/citys/cityPlazas', function(err,_,data){
	try{
		data = JSON.parse(data);
	}catch(e){
		throw new Error(e);
	}
	data.data.forEach(function(item){
		for(var i = 0 ; i < item.plazaList.length ; i++){
			if(item.plazaList[i].plazaLatitude && item.plazaList[i].plazaLongitude){
				global.plazaList.push(item.plazaList[i]);
				global.cityMap[item.cityId] = item.plazaList[i];
			}
		}
	})
	global.plazaList.forEach(function(_){
		global.plazaMap[_.plazaId] = _;
	})

})

var CONFIG = require('./config.js');
var authapi = CONFIG.authapi;
var timeapi = CONFIG.timeapi;
var homelink = CONFIG.home;
app.get('/auth', function(req, res, next){
	
	if(req.session.user){
		// 需要登录， 跳转到登录
		return res.redirect(homelink);
	}
	var sessionId = req.query.sessionId;
	console.log('session id', sessionId)
	request.get(timeapi, function(err, _, data){
		if(err){
			console.log('auth fail');
			return res.redirect(authapi);
		}
		console.log(data);
		var obj = JSON.parse(data);
		var url = authapi+'interface_validateSession.do?sessionId='+sessionId+"&time="+obj.time;
		console.log(url);
		request.get(url, function(err,_, user){
			if(err){
				console.log('auth fail');
				return res.redirect(authapi);
			}
			console.log(user)
			user = JSON.parse(user);
			if(user.status){
				req.session.user = user;
			}else{
				return res.redirect(authapi);
			}
			res.redirect(homelink);
		});
	});
	console.log(req.query.sessionId);
});
app.get('/api/logout', function(req, res, next){
	delete req.session.user;
	res.redirect(authapi);
});
app.get('/api/userinfo', function(req, res,next){
	return res.json(req.session.user || {username:"nouser"});
});



var server = app.listen(10081, function () {
var host = server.address().address;
var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


var io = require('socket.io')(server);


io.on( "connection", function( socket ){
    console.log( "一个新连接" );
    io.sockets.emit('allmap', {plaza: plazaList});
});


redisClient.on('ready', function(){
	console.log('redis client ready, start sub device');
	redisClient.subscribe('ffan_bi3_app_device|pubsub', function(err, data){
		//console.log(data);
	})
	redisClient.on('message', function(channel, msg){
		//console.log(msg);
		if(plazaMap[msg]){
			io.sockets.emit('change', {plaza: plazaMap[msg], type:'device' });
		}else{
			console.log('找不到对应广场ID');
		}
	})
})

shakeClient.on('ready', function(){
	console.log('redis client ready, start sub shake');
	shakeClient.subscribe('ffan_bi3_page_shake|pubsub', function(err, data){
		//console.log(data);
	})
	shakeClient.on('message', function(channel, msg){
		//console.log(msg);
		if(cityMap[msg]){
			io.sockets.emit('change', {plaza: cityMap[msg], type:'shake' });
		}else{
			console.log('找不到对应城市ID');
		}
	})
	// randomPoint();
})


//新用户的pubsub
memberClient.on('ready', function(){
	console.log('redis client ready, start sub new member');
	memberClient.subscribe('ffan_bi3_new_member|pubsub', function(err, data){
		//console.log(data);
	})
	memberClient.on('message', function(channel, msg){
		//console.log(msg);
		if(plazaMap[msg]){
			io.sockets.emit('change', {plaza: plazaMap[msg], type:'member' });
		}else{
			console.log('找不到对应广场ID');
		}
	})
})

// beacon搖一搖
beaconClient.on('ready', function(){
	console.log('redis client ready, start sub new member');
	beaconClient.subscribe('ffan_bi3_beacon_shake|pubsub', function(err, data){
		//console.log(data);
	})
	beaconClient.on('message', function(channel, msg){
		//console.log(msg);
		if(plazaMap[msg]){
			io.sockets.emit('change', {plaza: plazaMap[msg], type:'beacon' });
		}else{
			console.log('找不到对应广场ID');
		}
	})
})

// beacon搖一搖
gmvClient.on('ready', function(){
	console.log('redis client ready, start sub trade');
	gmvClient.subscribe('ffan-bi3-trade|pubsub', function(err, data){
		//console.log(data);
	})
	gmvClient.on('message', function(channel, msg){
		//console.log(msg);
		if(plazaMap[msg]){
			io.sockets.emit('change', {plaza: plazaMap[msg], type:'gmv' });
		}else{
			console.log('找不到对应广场ID');
		}
	})
})


function randomPoint(){
	var type = Math.random()*3 >> 0;
	if(type == 1){
		var allkeys = Object.keys(cityMap);
		io.sockets.emit('change', {
			plaza: cityMap[allkeys[Math.random()*allkeys.length >> 0]],
			type:'shake'
		})
	}else if(type == 2){
		var pkeys = Object.keys(plazaMap);
		io.sockets.emit('change', {plaza: plazaMap[pkeys[Math.random()*pkeys.length >> 0]], type:'device' });
	}else {
		var pkeys = Object.keys(plazaMap);
		io.sockets.emit('change', {plaza: plazaMap[pkeys[Math.random()*pkeys.length >> 0]], type:'member' });
	}
	setTimeout(randomPoint, 5);
}



