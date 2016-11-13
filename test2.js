// var fs = require('fs');
// var accidents = require('./accidents.json');


// var data = accidents.response.docs.map(function(accident) {
//    return {time: accident.policy_start_date}
// })



// fs.writeFileSync('./data.json', JSON.stringify(data, null, 2), 'utf-8'); 

var demographics = require('./demographics.js');

var i = 0;
for (var val in demographics) {
  demographics[val] = (demographics[val] / 50000)
    i += 1;
}

console.log(i);
console.log(demographics);
