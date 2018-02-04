var CKI = CKI || {};
CKI.Importers = CKI.Importers || {};

function parseCsvRow(sourceObj) {
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

CKI.Importers.coinTrackingInfo = {
	parseCsvRow: parseCsvRow
}
