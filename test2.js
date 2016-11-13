var fs = require('fs');
var accidents = require('./accidents.json');


var data = accidents.response.docs.map(function(accident) {
   return {time: accident.policy_start_date}
})



fs.writeFileSync('./data.json', JSON.stringify(data, null, 2), 'utf-8'); 
