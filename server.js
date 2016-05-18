var request = require('request');
var Promise = require('promise');

var options = {
	url:"http://10.209.22.34:10070/kylin/api/query",
	method:"post",
	headers: {
		"Content-Type": "application/json;charset=UTF-8",
		"Authorization": "Basic YWRtaW46S1lMSU4=",
		"accept": "*/*",
		"connection": "Keep-Alive",
		"user-agent": "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)"
	}
};
var query = function(sql,sqlCount, offset, limit){
	console.log(sql)
	console.log(sqlCount)
	return new Promise(function(resolve, reject){
		if(!sql || !sqlCount){
			return reject('sql can not be empty');
		}

		options.body = JSON.stringify({
			sql:sql,
			offset: offset || 0,
			limit:limit || limit,
			acceptPartial: true,
			project:'wanda'

		});

		request(options, function(err, res, body){
			if(err){
				return reject(err);
			}

			try{
				var ret = JSON.parse(body);
				// console.log('get data success', ret);
				if(ret.exception){
					console.log(ret.exception);
					return reject(ret.exception+sql);
				}
				return resolve(ret.results);
			}catch(error){				
				return reject('can not parse data to json');
			};
		});	
	}).then(function(results){
		options.body = JSON.stringify({
			sql:sqlCount,
			acceptPartial: true,
			project:'wanda'

		});
		return new Promise(function(resolve, reject){
			request(options, function(err, res, body){
				if(err){
					return reject(err);
				}

				try{
					var ret = JSON.parse(body);
					// console.log('get data success', ret);
					if(ret.exception){
						console.log(ret.exception);
						return reject(ret.exception+sqlCount);
					}
					return resolve({
						data: results,
						total: parseInt(ret.results && ret.results[0] && ret.results[0][0]) || 0
					});
				}catch(error){
					console.log(body)				
					return reject('can not parse data to json count');
				};
			});	
		});
	}).catch(function(e){
		console.log(e);
	});
};

function queryExcel(sql){
	return new Promise(function(resolve, reject){
		if(!sql){
			return reject('sql can not be empty');
		}

		options.body = JSON.stringify({
			sql:sql,
			acceptPartial: true,
			project:'wanda'
		});

		request(options, function(err, res, body){
			if(err){
				return reject(err);
			}

			try{
				var ret = JSON.parse(body);
				// console.log('get data success', ret);
				if(ret.exception){
					console.log(ret.exception);
					return reject(ret.exception+sql);
				}
				return resolve(ret.results);
			}catch(error){				
				return reject('can not parse data to json');
			};
		});	
	}).catch(function(e){
		console.log(e);
	});
}
function queryall(sql){
	return new Promise(function(resolve, reject){
		if(!sql){
			return reject('sql can not be empty');
		}

		options.body = JSON.stringify({
			sql:sql,
			acceptPartial: true,
			project:'wanda'
		});

		request(options, function(err, res, body){
			if(err){
				return reject(err);
			}

			try{
				var ret = JSON.parse(body);
				// console.log('get data success', ret);
				if(ret.exception){
					console.log(ret.exception);
					return reject(ret.exception+sql);
				}
				return resolve(ret.results);
			}catch(error){				
				return reject('can not parse data to json');
			};
		});	
	}).then(function(results){
		options.body = JSON.stringify({
			acceptPartial: true,
			project:'wanda'

		});
		return new Promise(function(resolve, reject){
			request(options, function(err, res, body){
				if(err){
					return reject(err);
				}

				try{
					var ret = JSON.parse(body);
					// console.log('get data success', ret);
					if(ret.exception){
						console.log(ret.exception);
						return reject(ret.exception);
					}
					return resolve({
						data: results,
						total: parseInt(ret.results && ret.results[0] && ret.results[0][0]) || 0
					});
				}catch(error){
					console.log(body)				
					return reject('can not parse data to json count');
				};
			});	
		});
	}).catch(function(e){
		console.log(e);
	});
}
module.exports = {
	query:query,
	excel:queryExcel,
	queryallAll: queryall
};