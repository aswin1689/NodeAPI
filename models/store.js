const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
	name: String,
	address: {
		street: String,
		city: String,
		state: String,
		zip: Number
	},
	location: { lat: Number, long: Number },
	products: [String]
});

const Store = mongoose.model('store', storeSchema);
module.exports = Store;
