var accidents = require('./accidents.json');

//var promoCodes = {};

//accidents.response.docs.forEach(function(accident) {
//    if (promoCodes[accident.promo_codes])
//        promoCodes[accident.promo_codes]++;
//    else
//        promoCodes[accident.promo_codes] = 1
//})

//console.log(promoCodes);
var fs = require('fs');
var JSONStream = require('JSONStream');
var es = require('event-stream');

var insurance_coverage = {};
var insurance_premium = {};
var insurance_plan = {};

var family_gold = 0;
var family_gold_sum = 0;
var family_silver = 0;
var family_silver_sum = 0;
var single_gold = 0;
var single_gold_sum = 0;
var single_silver = 0;
var single_silver_sum = 0;

var getStream = function (jsonData) {
    var stream = fs.createReadStream(jsonData, {encoding: 'utf8'}),
    parser = JSONStream.parse('response.docs.*');
    return stream.pipe(parser);
};

var count = 0;
getStream('policy.json')
    .on('end', function() {
        // console.log({insurance_coverage: insurance_coverage});
        // console.log({insurance_premium: insurance_premium});
        // console.log({insurance_plan: insurance_plan});
        console.log("Family + Gold " + (family_gold_sum / family_gold));
        console.log("Family + Silver " + (family_silver_sum / family_silver));
        console.log("Single + Gold " + (single_gold_sum / single_gold));
        console.log("Single + Silver " + (single_silver_sum / single_silver));
    })
    .pipe(es.map(function(policy) {
         if (policy.insurance_product === 'Dental') {
            var val = accidents.response.docs.find(function(el) {
                return el.participant_id === policy.participant_id
            })

            if (val)
                count++;
            // if (policy.insurance_coverage === 'Family') {
            
            //     if (policy.insurance_plan === 'Gold') {
            //         family_gold ++;
            //         family_gold_sum += parseInt(policy.insurance_premium)
            //     }
            //     if (policy.insurance_plan === 'Silver') {
            //         family_silver++;
            //         family_silver_sum += parseInt(policy.insurance_premium)
            //     }
            // }

            // else if (policy.insurance_coverage === 'Single') {
            //     if (policy.insurance_plan === 'Gold') {
            //         single_gold++;
            //         single_gold_sum += parseInt(policy.insurance_premium)
            //     }
            //     if (policy.insurance_plan === 'Silver') {
            //         single_silver++;
            //         single_silver_sum += parseInt(policy.insurance_premium)
            //     }
            // }
        //     if (insurance_coverage[policy.insurance_coverage])
        //         insurance_coverage[policy.insurance_coverage]++;
        //     else
        //         insurance_coverage[policy.insurance_coverage] = 1;

        //     if (insurance_premium[policy.insurance_premium])
        //         insurance_premium[policy.insurance_premium]++;
        //     else
        //         insurance_premium[policy.insurance_premium] = 1;

        //     if (insurance_plan[policy.insurance_plan])
        //         insurance_plan[policy.insurance_plan]++;
        //     else
        //         insurance_plan[policy.insurance_plan] = 1;
            
        }
        
    }))

// var policy;
// var insurance_coverage = {};
// var insurance_premium = {};
// var insurance_plan = {};

// fs.readFile('./policy.json', 'utf8', function (err, data) {
//     if (err) throw err;
//     policy = JSON.parse(data);

//     policy.response.docs.forEach(function(policy) {
//         if (policy.insurance_product === 'Dental') {
//             if (insurance_coverage[policy.insurance_coverage])
//                 insurance_coverage[policy.insurance_coverage]++;
//             else
//                 insurance_coverage[policy.insurance_coverage] = 1;

//             if (insurance_premium[policy.insurance_premium])
//                 insurance_premium[policy.insurance_premium]++;
//             else
//                 insurance_premium[policy.insurance_premium] = 1;

//             if (insurance_plan[policy.insurance_plan])
//                 insurance_plan[policy.insurance_plan]++;
//             else
//                 insurance_plan[policy.insurance_plan] = 1;
//         }
//     })
// })

