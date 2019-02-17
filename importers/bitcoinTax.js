var CKI = CKI || {};
CKI.Importers = CKI.Importers || {};

CKI.Importers.bitcoinTax = {
	constants: {
		SYMBOL_COLUMN: "Symbol",
        CURRENCY_COLUMN: "Currency",
		ACQUIRED_COLUMN: "Date Acquired",
		SOLD_COLUMN: "Date Sold",
		COST_BASIS_COLUMN: "Cost Basis",
		PROCEEDS_COLUMN: "Proceeds",
        ONE_DAY: 24 * 60 * 60 * 1000
	},

    parseCsvRow: function(sourceObj) {
        var sold = sourceObj[this.constants.SOLD_COLUMN];
        var acquired = sourceObj[this.constants.ACQUIRED_COLUMN];

        var soldParts = sold.split('/');
        var acquiredParts = acquired.split('/');

        var soldDate = new Date(soldParts[2], soldParts[1], soldParts[0]);
        var acquiredDate = new Date(acquiredParts[2], acquiredParts[1], acquiredParts[0]);

        var longTerm = (this._daysApart(soldDate, acquiredDate) > 365);

        var obj = {
            reportingCategory: longTerm ? "6" : "3",
            description: "Sold " + sourceObj[this.constants.SYMBOL_COLUMN],
            dateAcquired: (sourceObj[this.constants.ACQUIRED_COLUMN]) ? sourceObj[this.constants.ACQUIRED_COLUMN] : 'Various',
            dateSold: (sourceObj[this.constants.SOLD_COLUMN]) ? sourceObj[this.constants.SOLD_COLUMN] : 'Various',
            salesPrice: parseFloat(sourceObj[this.constants.PROCEEDS_COLUMN]),
            costBasis: parseFloat(sourceObj[this.constants.COST_BASIS_COLUMN])
        }
        return obj;
    },

    _daysApart: function(firstDate, secondDate) {
        return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(this.constants.ONE_DAY)));
    }
};