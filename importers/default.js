var CKI = CKI || {};
CKI.Importers = CKI.Importers || {};

CKI.Importers.default = {
    textToLines: function(allText) {
    	// return csv text as an array of objects
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split(',');
        for (var j=0; j<headers.length; j++) {
        	// strip quotes from string
        	var cleanData = headers[j].replace(/['"]+/g, '').trim()
            headers[j] = cleanData;
        }
        
        // if last header is empty, remove it
        if (headers.length > 0 && headers[headers.length-1] === "") {
            headers.pop();
        }

        var lines = [];

        for (var i=1; i<allTextLines.length; i++) {
            // remove commas in any numbers
            var line = allTextLines[i];
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
};
