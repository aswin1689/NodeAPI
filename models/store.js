const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
	storeName: String,
	address: String,
	phone: String,
	businessHours: [String],
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
