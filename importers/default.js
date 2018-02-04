var CKI = CKI || {};
CKI.Importers = CKI.Importers || {};

function textToLines(allText) {
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
        console.log(line);
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

function parseCsvRow(sourceObj) {
	return {
        holdingType: (sourceObj["holdingType"].toLowerCase() === "long") ? "2" : "1",
        reportingCategory: sourceObj["reportingCategory"],
        description: sourceObj['description'],
        dateAcquired: sourceObj["dateAcquired"],
        dateSold: sourceObj["dateSold"],
        salesPrice: sourceObj["salesPrice"],
        costBasis: sourceObj["costBasis"],
    }
}

CKI.Importers.default = {
	parseCsvRow: parseCsvRow,
	textToLines: textToLines
}
