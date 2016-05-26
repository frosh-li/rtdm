var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser')

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

request('https://api.ffan.com/cdaservice/v3/citys/cityPlazas', function(err,_,data){
	try{
		data = JSON.parse(data);
	}catch(e){
		throw new Error(e);
	}
	data.data.forEach(function(item){
		global.plazaList = global.plazaList.concat(item.plazaList);
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


setInterval(function(){
	if(plazaList){
		io.sockets.emit('change', {plaza: plazaList[Math.random()*plazaList.length >> 0] });
	}
	
},100);
