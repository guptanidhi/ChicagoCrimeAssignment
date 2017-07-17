var fs = require('fs');
var lineReader = require('readline');
var file = './data/Crimes_-_2001_to_present.csv';
// Variables for THEFT $500 
var over500Array = [];
var underEqual500Array = [];
var all500Array = [];

// Varriables for ASSAULT Data
var arrestedAssaultArray = [];
var notArrestedAssaultArray = [];
var assaultArrestNotArrestArray = [];

function readFileLines(file){
	var rd = lineReader.createInterface({
		input: fs.createReadStream(file)
	});

	rd.on('line', function(line, index){
		var value = line.trim().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
		
		if(value[5] === "THEFT" && value[6] === "OVER $500"){
			var over500Obj = {};			
			over500Obj['Year'] = value[17];
			over500Obj['THEFT Over $500'] = 1;	

			over500Array.push(over500Obj);	
		}else if(value[5] === "THEFT" && value[6] === "$500 AND UNDER"){
			var underEqual500Obj = {};
			underEqual500Obj['Year'] = value[17];
			underEqual500Obj['THEFT Under Equal $500'] = 1;

			underEqual500Array.push(underEqual500Obj);
		}else if(value[5] === "ASSAULT" && value[8] === 'true'){
			var arrestedAssaultObj = {};
			arrestedAssaultObj['Year'] = value[17];
			arrestedAssaultObj['Arrested'] = 1;

			arrestedAssaultArray.push(arrestedAssaultObj);
		}else if(value[5] === "ASSAULT" && value[8] === 'false'){
			var notArrestedAssaultObj = {};
			notArrestedAssaultObj['Year'] = value[17];
			notArrestedAssaultObj['Not Arrested'] = 1;

			notArrestedAssaultArray.push(notArrestedAssaultObj);
		}
		
	});

	rd.on('close', function(){
		/*console.log(notArrestedAssaultArray);
		return;*/
		
		/* Theft over, under and equal $500 code starts here */
		// To arrange over $500 
		var over500Output = [];
		over500Array.forEach(function(value) {
		  var existing = over500Output.filter(function(v, i) {
		    return v.Year == value.Year;
		  });
		  if (existing.length) {
		    var existingIndex = over500Output.indexOf(existing[0]);
		    over500Output[existingIndex]['THEFT Over $500'] = over500Output[existingIndex]['THEFT Over $500'] + value['THEFT Over $500'];
		  } else {
		    over500Output.push(value);
		  }
		});
		//Sorting By Ascending Order Year
		over500Output.sort(function(a, b) {
		    return a.Year - b.Year;
		});
		// console.log(JSON.stringify(over500Output));
		
		var underEqual500Output = [];
		underEqual500Array.forEach(function(value) {
		  var existing = underEqual500Output.filter(function(v, i) {
		    return v.Year == value.Year;
		  });
		  if (existing.length) {
		    var existingIndex = underEqual500Output.indexOf(existing[0]);
		    underEqual500Output[existingIndex]['THEFT Under Equal $500'] = underEqual500Output[existingIndex]['THEFT Under Equal $500'] + value['THEFT Under Equal $500'];
		  } else {
		    underEqual500Output.push(value);
		  }
		});
		//Sorting By Ascending Order Year
		underEqual500Output.sort(function(a, b) {
		    return a.Year - b.Year;
		});
		// console.log(JSON.stringify(underEqual500Output));

		// To Combine THEFT arrays
		for(var i=0;i<over500Output.length;i++){
			var underEqualOver500Obj = {};
			underEqualOver500Obj['Year'] = over500Output[i]['Year'];
			underEqualOver500Obj['THEFT Over $500'] = over500Output[i]['THEFT Over $500'];
			underEqualOver500Obj['THEFT Under Equal $500'] = underEqual500Output[i]['THEFT Under Equal $500'];
			all500Array.push(underEqualOver500Obj);
		}
		// console.log(JSON.stringify(all500Array));
		fs.writeFileSync('output/theftData.json', JSON.stringify(all500Array), encoding = "utf8");
		/* Theft over, under and equal $500 code starts here */

		/* Assault for arrest and not arrest code starts here */
		// Arrest data
		var assaultArrestOutput = [];
		arrestedAssaultArray.forEach(function(value) {
		  var existing = assaultArrestOutput.filter(function(v, i) {
		    return v.Year == value.Year;
		  });
		  if (existing.length) {
		    var existingIndex = assaultArrestOutput.indexOf(existing[0]);
		    assaultArrestOutput[existingIndex]['Arrested'] = assaultArrestOutput[existingIndex]['Arrested'] + value['Arrested'];
		  } else {
		    assaultArrestOutput.push(value);
		  }
		});
		//Sorting By Ascending Order Year
		assaultArrestOutput.sort(function(a, b) {
		    return a.Year - b.Year;
		});
		// console.log(JSON.stringify(assaultArrestOutput));
		// Not Arrested data
		var notAssaultArrestOutput = [];
		notArrestedAssaultArray.forEach(function(value) {
		  var existing = notAssaultArrestOutput.filter(function(v, i) {
		    return v.Year == value.Year;
		  });
		  if (existing.length) {
		    var existingIndex = notAssaultArrestOutput.indexOf(existing[0]);
		    notAssaultArrestOutput[existingIndex]['Not Arrested'] = notAssaultArrestOutput[existingIndex]['Not Arrested'] + value['Not Arrested'];
		  } else {
		    notAssaultArrestOutput.push(value);
		  }
		});
		//Sorting By Ascending Order Year
		notAssaultArrestOutput.sort(function(a, b) {
		    return a.Year - b.Year;
		});
		// console.log(JSON.stringify(notAssaultArrestOutput));

		// To Combine ASSAULT arrays
		for(var i=0;i<assaultArrestOutput.length;i++){
			var assaultArrestNotArrestObj = {};
			assaultArrestNotArrestObj['Year'] = assaultArrestOutput[i]['Year'];
			assaultArrestNotArrestObj['Arrested'] = assaultArrestOutput[i]['Arrested'];
			assaultArrestNotArrestObj['Not Arrested'] = notAssaultArrestOutput[i]['Not Arrested'];
			assaultArrestNotArrestArray.push(assaultArrestNotArrestObj);
		}
		// console.log(JSON.stringify(assaultArrestNotArrestArray));
		fs.writeFileSync('output/assaultData.json', JSON.stringify(assaultArrestNotArrestArray), encoding = "utf8");
		/* Assault for arrest and not arrest code ends here*/
	})
}

readFileLines(file);