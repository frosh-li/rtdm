var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser')
var tableHeader = require('./header');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
/*
app.use(session({
	secret: '1234567890QWERTY',
	name: 'srs',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
	cookie: {maxAge: 80000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
	resave: false,
	saveUninitialized: true,
}));
*/
app.use(session({
    store: new FileStore,
    secret: '1234567890QWERTY',
    resave: true,
	cookie: {maxAge: 80000},
    saveUninitialized: true
  })
);
var getData = require('./server.js').query;

var getDataAll = require('./server.js').excel;

var offset = 0;
var limit = 10;

var sqls = require('./sqls/index.js');
var nodeExcel = require('excel-export');

//设置跨域访问  
app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
});  

var filters = ['client_name','status', 'ORDER_STATUS'];

Object.keys(sqls).forEach(function(item){
	app.get('/api/'+item, function (req, res, next) {
		console.log('current user',req.session.user);
		if(!req.session.user){
			return res.json({status: 301});
		}
		var c_offset = parseInt(req.query.offset) || offset;
	    var c_limit = parseInt(req.query.limit) || limit;
	    var end = new Date().toLocaleString().split(' ')[0];
	    var start = new Date(+new Date() - 7*24*60*60*1000).toLocaleString().split(' ')[0];
	    var dateReg = /^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/;

	    if(req.query.start && dateReg.test(req.query.start)){
	    	start = req.query.start;
	    }

	    if(req.query.end && dateReg.test(req.query.end)){
	    	end = req.query.end;
	    }
		var qFilter = [];
		filters.forEach(function(filter){
			var val = req.query[filter] && decodeURIComponent(req.query[filter]);
			if(val && val.toLowerCase() !== "all" && val!="不限"){
				qFilter.push(filter+"='"+val+"'");	
			}
		})
		

	  	var sql = sqls[item]
		  			.replace('{{start}}',start)
					.replace('{{end}}',end);
		if(qFilter.length > 0){
			sql = sql.replace('{{filters}}', " and " + qFilter.join(' and '));
		}else{
			sql = sql.replace('{{filters}}', "");
		}
			
	  	var sqlCount = sqls[item]
		  				  
						  .replace('{{start}}',start)
						  .replace('{{end}}',end);
		sqlCount = "select count(*) from (" + sqlCount + ")";
		if(qFilter.length > 0){
			sqlCount = sqlCount.replace('{{filters}}', " and " + qFilter.join(' and '));
		}else{
			sqlCount = sqlCount.replace('{{filters}}', "");
		}
	  	// res.json({status: 200, data: sql});
	  	console.log(sql);
		console.log(sqlCount);
		getData(sql,sqlCount, c_offset, c_limit).then(function(ret){
			res.json({stauts:200, data: ret.data, total:ret.total, page: c_offset/c_limit + 1});	
		}).catch(function(e){
			console.log(e);
			res.json({status: 500, msg:'服务器故障',detail:e.message});
		});
	});
});
Object.keys(sqls).forEach(function(item){
app.get('/excel/'+item, function(req, res){
  	var conf ={};
	// conf.stylesXmlFile = "styles.xml";
    conf.name = item;
	var end = new Date().toLocaleString().split(' ')[0];
	var start = new Date(+new Date() - 7*24*60*60*1000).toLocaleString().split(' ')[0];
	var dateReg = /^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/;

	if(req.query.start && dateReg.test(req.query.start)){
		start = req.query.start;
	}

	if(req.query.end && dateReg.test(req.query.end)){
		end = req.query.end;
	}
	
	var qFilter = [];
	filters.forEach(function(filter){
		var val = req.query[filter] && decodeURIComponent(req.query[filter]);
		if(val && val.toLowerCase() !== "all" && val!="不限"){
			qFilter.push(filter+"='"+val+"'");
		}
	})
	

	var sql = sqls[item]
				.replace('{{start}}',start)
				.replace('{{end}}',end);
	if(qFilter.length > 0){
		sql = sql.replace('{{filters}}', " and " + qFilter.join(' and '));
	}else{
		sql = sql.replace('{{filters}}', "");
	}
	conf.cols = [];
	for(var key in tableHeader[item]){
		var __item = 	tableHeader[item][key];
		conf.cols.push({
			caption:__item,
			type:'string'
		})
	};

	getDataAll(sql).then(function(ret){
		conf.rows = ret;

		// ret.forEach(function(item){
		// 	conf.cols.push({
		// 		caption:'string',
		// 		type:'string'				
		// 	})
		// });
		var result = nodeExcel.execute(conf);
  		res.setHeader('Content-Type', 'application/vnd.openxmlformats');
  		res.setHeader("Content-Disposition", "attachment; filename=" +item+ ".xlsx");
  		res.end(result, 'binary');
		// res.json({stauts:200, data: ret.data, total:ret.total, page: c_offset/c_limit + 1});	
	}).catch(function(e){
		console.log(e);
		res.json({status: 500, msg:'服务器故障',detail:e.message});
	});
  	
});
});

app.post('/updateSql', function(req,res, next){
	console.log(req.body);
	var filename = req.body.name;
	if(!/^[a-z]+$/.test(filename)){
		return res.json({
			status: 500,
			msg:'只能输入英文'
		})
	}
	var sqlContent = req.body.sql;
	fs.writeFile(path.resolve(__dirname+"/sqls/"+filename+".sql"), sqlContent, function(err, data){
		if(err){
			return res.json({
				status: 500,
				msg:'写文件出错'
			})
		}
		res.json({
			status:200,
			msg:'提交成功',
			sql: data
		})
	})
})

var request = require('request');



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
	return res.json(req.session.user);
});

app.get('/allsqls', function(req, res,next){
	return res.json(sqls);
});

var server = app.listen(10081, function () {
var host = server.address().address;
var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

