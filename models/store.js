const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
	storeName: String,
	address: {
		street: String,
		city: String,
		state: String,
		zip: Number
	},
	phone: String,
	businessHours: {
		open: String,
		close: String
	},
	location: {
		type: {
			type: String,
			enum: ['Point'],
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	products: {
		inStock: [String],
		outOfStock: [String]
	}
});

storeSchema.index({ location: '2dsphere' });

const Store = mongoose.model('store', storeSchema);
module.exports = Store;
