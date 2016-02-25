var fs = require('fs');
var path = require('path');

var sqls = fs.readdirSync(path.resolve(__dirname));
var ret = {};
sqls.forEach(function(sql){
	if(/\.sql$/.test(sql)){
		var data = fs.readFileSync(path.resolve(__dirname+'/'+sql)).toString('utf-8');
		ret[sql.replace('.sql','')] = data.replace(/[\n\r]/gm, " ");
	}
});

module.exports = ret;
