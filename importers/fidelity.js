var CKI = CKI || {};
CKI.Importers = CKI.Importers || {};

CKI.Importers.fidelity = {
	constants = {
		SUMMARY_COLUMN: "1099 Summary",
		DETAIL_COLUMN: "1099-B-Detail",
		DESCRIPTION_COLUMN: "1099-B-1a Description of property Stock or Other symbol CUSIP",
		SHORT_LONG_COLUMN: "Term",
		SHORT: "SHORT TERM",
		LONG: "LONG TERM",
		REPORTING_COLUMN: "Covered/Uncovered",
		WAS_REPORTED: "COVERED",
		WAS_NOT_REPORTED: "UNCOVERED",
		ACQUIRED_COLUMN: "1099-B-1b Date Acquired",
		SOLD_COLUMN: "1099-B-1c Date Sold or Disposed",
		COST_BASIS_COLUMN: "1099-B-1e Cost or Other Basis",
		PROCEEDS_COLUMN: "1099-B-1d Proceeds"
	}
};

function fidelityFormateDate(datestring) {
	// assuming fidelity csv spits out mm/dd/yy <-- y2k brah
	var suffix = parseInt(datestring.slice(-2));
	var rPattern = '$1/$2/20$3';
	if(suffix > 17) {
		//you bought this in the 20th century
		var rPattern = '$1/$2/19$3';
	}
	var pattern = /(\d{1,2})\/(\d{1,2})\/(\d{2})/;
	return datestring.replace(pattern, rPattern)
}


CKI.Importers.fidelity.textToLines = function(allText) {
	// return csv text as an array of objects
    var allTextLines = allText.split(/\r\n|\n/);
    var headers;
    var startLine = 1;
    if(allTextLines[0].startsWith('1099-B-Detail')){
    	headers = allTextLines[0].split(',');
    }else if(allTextLines[1].startsWith('1099-B-Detail')) {
    	startLine = 2;
    	headers = allTextLines[1].split(',');
    }else if(allTextLines[2].startsWith('1099-B-Detail')) {
    	startLine = 3;
    	headers = allTextLines[2].split(',');
    }else {
    	console.log('unable to find fidelity 199-b headers');
    }
    for (var j=0; j<headers.length; j++) {
    	// string quotes from string
    	var cleanData = headers[j].replace(/['"]+/g, '').trim()
        headers[j] = cleanData;
    }
    var lines = [];

    for (var i=startLine; i<allTextLines.length; i++) {
        var line = allTextLines[i];
        if(!line.startsWith('1099-B-Detail')) {
        	continue;
        }

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
}

CKI.Importers.fidelity.parseCsvRow = function(sourceObj) {
	var constants = CKI.Importers.fidelity.constants;
	var obj = {
		holdingType: (sourceObj[constants.SHORT_LONG_COLUMN].trim() === constants.LONG) ? "2" : "1",
		reportingCategory: (sourceObj[constants.REPORTING_COLUMN].trim() === constants.WAS_REPORTED) ? "1" : "2",
		description: sourceObj[constants.DESCRIPTION_COLUMN],
		dateAcquired: (sourceObj[constants.ACQUIRED_COLUMN]) ? fidelityFormateDate(sourceObj[constants.ACQUIRED_COLUMN]) : 'Various',
		dateSold: (sourceObj[constants.SOLD_COLUMN]) ? fidelityFormateDate(sourceObj[constants.SOLD_COLUMN]) : 'Various',
		salesPrice: parseFloat(sourceObj[constants.PROCEEDS_COLUMN]),
		costBasis: parseFloat(sourceObj[constants.COST_BASIS_COLUMN])
	}
	return obj;
}