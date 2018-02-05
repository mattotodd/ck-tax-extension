var CKI = CKI || {};
CKI.Importers = CKI.Importers || {};

CKI.Importers.coinTrackingInfo = {
	textToLines: function(allText) {
		// return csv text as an array of objects
	    var allTextLines = allText.split(/\r\n|\n/);
	    var headers = allTextLines[0].split(',');
	    for (var j=0; j<headers.length; j++) {
	    	// string quotes from string
	    	var cleanData = headers[j].replace(/['"]+/g, '').trim()
	        headers[j] = cleanData;
	    }
	    var lines = [];

	    for (var i=1; i<allTextLines.length; i++) {
	        // remove commas in any numbers
	        var line = allTextLines[i].replace(/(?<=\d)(,)(?=\d)/g, '');
	        var data = line.split(',');
	        if (data.length == headers.length) {

	            var tobj = {};
	            for (var j=0; j<headers.length; j++) {
	            	// string quotes from string
	            	var cleanData = data[j].replace(/['"]+/g, '')
	                tobj[headers[j]] = cleanData;
	            }
	            lines.push(tobj);
	        }else{
	            console.log("skipping row")
	            console.log(line);
	        }
	    }
	    return lines;
	},


	parseCsvRow: function(sourceObj) {
		var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
		var rPattern = '$2/$1/$3';

		return {
			holdingType: (sourceObj["Short/Long"] === "Long") ? "2" : "1",
			reportingCategory: "3",
			description: 'Sold ' + sourceObj['Currency'] + ' on ' + sourceObj['Sell /Output at'],
			dateAcquired: sourceObj["Date Acquired"].replace(pattern, rPattern),
			dateSold: sourceObj["Date Sold"].replace(pattern, rPattern),
			salesPrice: sourceObj["Proceeds in USD"],
			costBasis: sourceObj["Cost Basis in USD"],
		}
	}
};