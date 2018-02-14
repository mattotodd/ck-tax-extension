var CKI = CKI || {};
CKI.Importers = CKI.Importers || {};

CKI.Importers.betterment = {
	constants: {
		DESCRIPTION_COLUMN: "Description",
		SHORT_LONG_COLUMN: "Type of Gain(Loss)",
		SHORT: "Short-term",
		LONG: "Long-term",
		REPORTING_COLUMN: "Noncovered Securities",
		WAS_REPORTED: "No",
		ACQUIRED_COLUMN: "Date Acquired",
		SOLD_COLUMN: "Date Sold",
		COST_BASIS_COLUMN: "Cost or Other Basis",
		PROCEEDS_COLUMN: "Gross Proceeds",
		ADJUSTMENT_COLUMN: "Wash Sale Loss Disallowed"
	},


	parseCsvRow: function(sourceObj) {
		var obj = {
			holdingType: (sourceObj[this.constants.SHORT_LONG_COLUMN].trim() === this.constants.LONG) ? "2" : "1",
			reportingCategory: (sourceObj[this.constants.REPORTING_COLUMN].trim() === this.constants.WAS_REPORTED) ? "1" : "2",
			description: sourceObj[this.constants.DESCRIPTION_COLUMN],
			dateAcquired: (sourceObj[this.constants.ACQUIRED_COLUMN]) ? sourceObj[this.constants.ACQUIRED_COLUMN] : 'Various',
			dateSold: (sourceObj[this.constants.SOLD_COLUMN]) ? sourceObj[this.constants.SOLD_COLUMN] : 'Various',
			salesPrice: parseFloat(sourceObj[this.constants.PROCEEDS_COLUMN].replace(/[^0-9\.-]+/g,"")),
			costBasis: parseFloat(sourceObj[this.constants.COST_BASIS_COLUMN].replace(/[^0-9\.-]+/g,"")),
			adjustmentAmount: parseFloat(sourceObj[this.constants.ADJUSTMENT_COLUMN].replace(/[^0-9\.-]+/g,""))
		}

		if (obj.adjustmentAmount !== 0.00) {
			obj.adjustmentCode = "W"; // Wash Sale
		}
		
		return obj;
	}

};
