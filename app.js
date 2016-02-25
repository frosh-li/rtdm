var express = require('express');
var app = express();
var getData = require('./server.js');

var offset = 0;
var limit = 10;

var sqls = require('./sqls/index.js');
/*
var sqls = {
	'trade': 'SELECT DIM_DAY.DATEKEY,D05_TRADE_ORDER_CODE.ORDER_CODE_name,count(1) as order_cnts,sum(S06_FFAN_TRADE_ORDER_SUM.ORIG_AMOUNT) as ORIG_AMOUNT ,sum(S06_FFAN_TRADE_ORDER_SUM.TRADE_AMOUNT) as TRADE_AMOUNT FROM DWS.S06_FFAN_TRADE_ORDER_SUM as S06_FFAN_TRADE_ORDER_SUM  LEFT JOIN FFAN.DIM_DAY as DIM_DAY ON S06_FFAN_TRADE_ORDER_SUM.TRANS_DT = DIM_DAY.DATEKEY LEFT JOIN DIM.D05_TRADE_ORDER_CODE as D05_TRADE_ORDER_CODE ON S06_FFAN_TRADE_ORDER_SUM.ORDER_CODE = D05_TRADE_ORDER_CODE.ORDER_CODE where DIM_DAY.DATEKEY >=\'{{start}}\' and DIM_DAY.DATEKEY <= \'{{end}}\' {{filters}} group by D05_TRADE_ORDER_CODE.ORDER_CODE_name,DIM_DAY.DATEKEY',
	'movie':'SELECT A06_PRODUCT_KPI_MOVIE.DATE_KEY,D06_APP_CLIENT.client_name,sum(A06_PRODUCT_KPI_MOVIE.MOVIE_PAGE),sum(A06_PRODUCT_KPI_MOVIE.DETAIL_PAGE),sum(A06_PRODUCT_KPI_MOVIE.CHOOSETICKET),sum(A06_PRODUCT_KPI_MOVIE.SELECTSEAT),sum(A06_PRODUCT_KPI_MOVIE.ORDER_PAGE),sum(A06_PRODUCT_KPI_MOVIE.ORDER_CNTS),sum(A06_PRODUCT_KPI_MOVIE.TICKET_CNTS),sum(A06_PRODUCT_KPI_MOVIE.PAY_SUCCESS),sum(A06_PRODUCT_KPI_MOVIE.PAY_ORDER_CNTS),sum(A06_PRODUCT_KPI_MOVIE.CHANGE_ORDER_RATE),sum(A06_PRODUCT_KPI_MOVIE.REFUND_ORDER_CNTS) FROM APP.A06_PRODUCT_KPI_MOVIE as A06_PRODUCT_KPI_MOVIE LEFT JOIN FFAN.DIM_DAY as DIM_DAY ON A06_PRODUCT_KPI_MOVIE.DATE_KEY = DIM_DAY.DATEKEY LEFT JOIN DIM.D06_APP_CLIENT as D06_APP_CLIENT ON A06_PRODUCT_KPI_MOVIE.OS_VERSION = D06_APP_CLIENT.ID where DIM_DAY.DATEKEY >=\'{{start}}\' and DIM_DAY.DATEKEY <= \'{{end}}\' {{filters}} group by  D06_APP_CLIENT.client_name,A06_PRODUCT_KPI_MOVIE.DATE_KEY',
	'shake':'SELECT A06_PRODUCT_KPI_MARKETING.DATE_KEY,D06_APP_CLIENT.CLIENT_NAME,sum(A06_PRODUCT_KPI_MARKETING.PV) as PV,sum(A06_PRODUCT_KPI_MARKETING.UV) as UV,sum(A06_PRODUCT_KPI_MARKETING.BEACON_PV) as BEACON_PV,sum(A06_PRODUCT_KPI_MARKETING.BEACON_UV) as BEACON_UV,sum(A06_PRODUCT_KPI_MARKETING.GET_NUM) as GET_NUM,sum(A06_PRODUCT_KPI_MARKETING.GET_USERS) as GET_USERS,sum(A06_PRODUCT_KPI_MARKETING.USED_NUM) as USED_NUM,sum(A06_PRODUCT_KPI_MARKETING.USED_USERS) as USED_USERS FROM APP.A06_PRODUCT_KPI_MARKETING as A06_PRODUCT_KPI_MARKETING INNER JOIN DIM.D06_PLAZA_REGION_INFO as D06_PLAZA_REGION_INFO ON A06_PRODUCT_KPI_MARKETING.PLAZA_ID = D06_PLAZA_REGION_INFO.PLAZA_ID INNER JOIN DIM.D06_APP_CLIENT as D06_APP_CLIENT ON A06_PRODUCT_KPI_MARKETING.OS_TYPE = D06_APP_CLIENT.ID where A06_PRODUCT_KPI_MARKETING.DATE_KEY >=\'{{start}}\' and A06_PRODUCT_KPI_MARKETING.DATE_KEY <= \'{{end}}\' {{filters}} group by A06_PRODUCT_KPI_MARKETING.DATE_KEY,A06_PRODUCT_KPI_MARKETING.PLAZA_ID,D06_PLAZA_REGION_INFO.PLAZA_NAME,A06_PRODUCT_KPI_MARKETING.OS_TYPE,D06_APP_CLIENT.CLIENT_NAME',	
	'redbag':'SELECT A06_PRODUCT_KPI_RED_LOTTERY.DATE_KEY,A06_PRODUCT_KPI_RED_LOTTERY.PRODUCT_NAME,sum(A06_PRODUCT_KPI_RED_LOTTERY.TOTAL_NUM) as TOTAL_NUM,sum(A06_PRODUCT_KPI_RED_LOTTERY.GET_NUM) as GET_NUM,sum(A06_PRODUCT_KPI_RED_LOTTERY.GET_USERS) as GET_USERS,sum(A06_PRODUCT_KPI_RED_LOTTERY.USED_NUM) as USED_NUM,sum(A06_PRODUCT_KPI_RED_LOTTERY.USED_USERS) as USED_USERS,sum(A06_PRODUCT_KPI_RED_LOTTERY.USED_MONEY) as USED_MONEY FROM APP.A06_PRODUCT_KPI_RED_LOTTERY as A06_PRODUCT_KPI_RED_LOTTERY  INNER JOIN FFAN.DIM_DAY as DIM_DAY ON A06_PRODUCT_KPI_RED_LOTTERY.DATE_KEY = DIM_DAY.DATEKEY where DIM_DAY.DATEKEY >=\'{{start}}\' and DIM_DAY.DATEKEY <= \'{{end}}\' {{filters}} group by A06_PRODUCT_KPI_RED_LOTTERY.PRODUCT_NAME,A06_PRODUCT_KPI_RED_LOTTERY.DATE_KEY',
	'coupon':'SELECT A06_PRODUCT_KPI_COUPON.DATE_KEY,sum(A06_PRODUCT_KPI_COUPON.GOODS_COUPON_STOCK) as GOODS_COUPON_STOCK,sum(A06_PRODUCT_KPI_COUPON.GOODS_COUPON) as GOODS_COUPON,sum(A06_PRODUCT_KPI_COUPON.GOODS_USED_COUPON) as GOODS_USED_COUPON,sum(A06_PRODUCT_KPI_COUPON.MARKET_COUPON_STOCK) as MARKET_COUPON_STOCK,sum(A06_PRODUCT_KPI_COUPON.MARKET_COUPON) as MARKET_COUPON,sum(A06_PRODUCT_KPI_COUPON.MARKET_USED_COUPON) as MARKET_USED_COUPON FROM APP.A06_PRODUCT_KPI_COUPON as A06_PRODUCT_KPI_COUPON LEFT JOIN FFAN.DIM_DAY as DIM_DAY ON A06_PRODUCT_KPI_COUPON.DATE_KEY = DIM_DAY.DATEKEY Where DIM_DAY.DATEKEY >= \'{{start}}\' and DIM_DAY.DATEKEY <= \'{{end}}\' {{filters}} group by A06_PRODUCT_KPI_COUPON.DATE_KEY',
	'carorder':'SELECT A06_FFAN_BI_KPI_PARKING_PARKING_ORDER_STATISTICS.DT,SUM(A06_FFAN_BI_KPI_PARKING_PARKING_ORDER_STATISTICS.ORDER_NUM),SUM(A06_FFAN_BI_KPI_PARKING_PARKING_ORDER_STATISTICS.NUM_9003),SUM(A06_FFAN_BI_KPI_PARKING_PARKING_ORDER_STATISTICS.NUM_9004),SUM(A06_FFAN_BI_KPI_PARKING_PARKING_ORDER_STATISTICS.COUPON_ORDER_NUM),SUM(A06_FFAN_BI_KPI_PARKING_PARKING_ORDER_STATISTICS.REDUCE_ORDER_NUM),SUM(A06_FFAN_BI_KPI_PARKING_PARKING_ORDER_STATISTICS.COUPON_REDUCE_NUM) ,SUM(A06_FFAN_BI_KPI_PARKING_PARKING_ORDER_STATISTICS.ORDER_AVERAGE_TIME) FROM APP.A06_FFAN_BI_KPI_PARKING_PARKING_ORDER_STATISTICS as A06_FFAN_BI_KPI_PARKING_PARKING_ORDER_STATISTICS  Where A06_FFAN_BI_KPI_PARKING_PARKING_ORDER_STATISTICS.DT >= \'{{start}}\' and A06_FFAN_BI_KPI_PARKING_PARKING_ORDER_STATISTICS.DT <= \'{{end}}\' {{filters}} GROUP BY A06_FFAN_BI_KPI_PARKING_PARKING_ORDER_STATISTICS.DT',
	'cartrade':'select A06_FFAN_BI_KPI_PARKING_PARKING_TRADE_STATISTICS.DT,SUM(A06_FFAN_BI_KPI_PARKING_PARKING_TRADE_STATISTICS.E_CASH),SUM(A06_FFAN_BI_KPI_PARKING_PARKING_TRADE_STATISTICS.CASH),SUM(A06_FFAN_BI_KPI_PARKING_PARKING_TRADE_STATISTICS.COUPON_MONEY),SUM(A06_FFAN_BI_KPI_PARKING_PARKING_TRADE_STATISTICS.REDUCE_MONEY),SUM(A06_FFAN_BI_KPI_PARKING_PARKING_TRADE_STATISTICS.MONEY) FROM APP.A06_FFAN_BI_KPI_PARKING_PARKING_TRADE_STATISTICS as A06_FFAN_BI_KPI_PARKING_PARKING_TRADE_STATISTICS Where A06_FFAN_BI_KPI_PARKING_PARKING_TRADE_STATISTICS.DT >= \'{{start}}\' and A06_FFAN_BI_KPI_PARKING_PARKING_TRADE_STATISTICS.DT <= \'{{end}}\' {{filters}} GROUP BY A06_FFAN_BI_KPI_PARKING_PARKING_TRADE_STATISTICS.DT'
};
*/
// 获取总记录数的sql
/*
var sqlsCount = {
	'trade': 'SELECT count(1) FROM DWS.S06_FFAN_TRADE_ORDER_SUM as S06_FFAN_TRADE_ORDER_SUM  LEFT JOIN FFAN.DIM_DAY as DIM_DAY ON S06_FFAN_TRADE_ORDER_SUM.TRANS_DT = DIM_DAY.DATEKEY LEFT JOIN DIM.D05_TRADE_ORDER_CODE as D05_TRADE_ORDER_CODE ON S06_FFAN_TRADE_ORDER_SUM.ORDER_CODE = D05_TRADE_ORDER_CODE.ORDER_CODE where DIM_DAY.DATEKEY >=\'{{start}}\' and DIM_DAY.DATEKEY <= \'{{end}}\' {{filters}}',
	'movie':'SELECT count(1) FROM APP.A06_PRODUCT_KPI_MOVIE as A06_PRODUCT_KPI_MOVIE LEFT JOIN FFAN.DIM_DAY as DIM_DAY ON A06_PRODUCT_KPI_MOVIE.DATE_KEY = DIM_DAY.DATEKEY LEFT JOIN DIM.D06_APP_CLIENT as D06_APP_CLIENT ON A06_PRODUCT_KPI_MOVIE.OS_VERSION = D06_APP_CLIENT.ID where DIM_DAY.DATEKEY >=\'{{start}}\' and DIM_DAY.DATEKEY <= \'{{end}}\' {{filters}}',
	'shake':'SELECT count(1) FROM APP.A06_PRODUCT_KPI_MARKETING as A06_PRODUCT_KPI_MARKETING INNER JOIN DIM.D06_PLAZA_REGION_INFO as D06_PLAZA_REGION_INFO ON A06_PRODUCT_KPI_MARKETING.PLAZA_ID = D06_PLAZA_REGION_INFO.PLAZA_ID INNER JOIN DIM.D06_APP_CLIENT as D06_APP_CLIENT ON A06_PRODUCT_KPI_MARKETING.OS_TYPE = D06_APP_CLIENT.ID where A06_PRODUCT_KPI_MARKETING.DATE_KEY >=\'{{start}}\' and A06_PRODUCT_KPI_MARKETING.DATE_KEY <= \'{{end}}\' {{filters}}',	
	'redbag':'SELECT count(1) FROM APP.A06_PRODUCT_KPI_RED_LOTTERY as A06_PRODUCT_KPI_RED_LOTTERY  INNER JOIN FFAN.DIM_DAY as DIM_DAY ON A06_PRODUCT_KPI_RED_LOTTERY.DATE_KEY = DIM_DAY.DATEKEY where DIM_DAY.DATEKEY >=\'{{start}}\' and DIM_DAY.DATEKEY <= \'{{end}}\' {{filters}}',
	'coupon':'SELECT count(1) FROM APP.A06_PRODUCT_KPI_COUPON as A06_PRODUCT_KPI_COUPON LEFT JOIN FFAN.DIM_DAY as DIM_DAY ON A06_PRODUCT_KPI_COUPON.DATE_KEY = DIM_DAY.DATEKEY Where DIM_DAY.DATEKEY >= \'{{start}}\' and DIM_DAY.DATEKEY <= \'{{end}}\' {{filters}}',
	'carorder':'SELECT count(1) FROM APP.A06_FFAN_BI_KPI_PARKING_PARKING_ORDER_STATISTICS as A06_FFAN_BI_KPI_PARKING_PARKING_ORDER_STATISTICS Where A06_FFAN_BI_KPI_PARKING_PARKING_ORDER_STATISTICS.DT >= \'{{start}}\' and A06_FFAN_BI_KPI_PARKING_PARKING_ORDER_STATISTICS.DT <= \'{{end}}\' {{filters}}',
	'cartrade':'select count(1) FROM APP.A06_FFAN_BI_KPI_PARKING_PARKING_TRADE_STATISTICS as A06_FFAN_BI_KPI_PARKING_PARKING_TRADE_STATISTICS Where A06_FFAN_BI_KPI_PARKING_PARKING_TRADE_STATISTICS.DT >= \'{{start}}\' and A06_FFAN_BI_KPI_PARKING_PARKING_TRADE_STATISTICS.DT <= \'{{end}}\' {{filters}}'	
};
*/

//设置跨域访问  
app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
});  


console.log(sqls, Object.keys(sqls));
Object.keys(sqls).forEach(function(item){
	app.get('/api/'+item, function (req, res) {
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
		var filters = ['client_name'];
		var qFilter = [];
		filters.forEach(function(filter){
			if(req.query[filter] && req.query[filter].toLowerCase() !== "all"){
				qFilter.push(filter+"='"+req.query[filter]+"'");	
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
		  				  .replace(/select.*from+?/gi, 'select count(1) from')
						  .replace(/group\s+by.*$/,"")
						  .replace('{{start}}',start)
						  .replace('{{end}}',end);
		if(qFilter.length > 0){
			sqlCount = sqlCount.replace('{{filters}}', " and " + qFilter.join(' and '));
		}else{
			sqlCount = sqlCount.replace('{{filters}}', "");
		}
	  	// res.json({status: 200, data: sql});
	  	console.log(sql);
		console.log(sqlCount);
		getData(sql,sqlCount, c_offset, c_limit).then(function(ret){
			res.json({stauts:200, data: ret.data, total:ret.total});	
		}).catch(function(e){
			console.log(e);
			res.json({status: 500, msg:'服务器故障',detail:e.message});
		});
	});
});

app.post('/updateSql', function(req,res, next){
	var filename = req.body.name;
	if(!/^[a-z]+$/.test(filename)){
		return res.json({
			status: 500,
			msg:'只能输入英文'
		})
	}
	var sqlContent = req.body.sql;
	fs.writeFile(path.resovle(__dirname+"/"+slqs+"/"+filename+".sql"), sqlContent, function(err, data){
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

var server = app.listen(10000, function () {
var host = server.address().address;
var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});