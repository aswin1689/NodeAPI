var union = require('lodash/union');
var difference = require('lodash/difference');
const Store = require('../models/store');

module.exports = {
	index: async (req, res, next) => {
		const store = await Store.find({});
		res.status(200).json(store);
	},

	getStore: async (req, res, next) => {
		const { storeId } = req.value.params;
		const store = await Store.findById(storeId);
		res.status(200).json(store);
	},

	getStoreWithItemsInStock: async (req, res, next) => {
		let productsList = req.query.products.split(',');
		let location = req.query.location.split(',');
		const latitude = parseFloat(location[0]);
		const longitude = parseFloat(location[1]);

		const store = await Store.aggregate([
			{
				$geoNear: {
					near: {
						type: 'Point',
						coordinates: [latitude, longitude]
					},
					spherical: true,
					maxDistance: 25 * 1609.34,
					distanceMultiplier: 1 / 1609.34,
					distanceField: 'distance'
				}
			},
			{
				$match: {
					'products.inStock': {
						$in: productsList
					}
				}
			}
		]);
		res.status(200).json(store);
	},

	createStore: async (req, res, next) => {
		const requestBody = req.value.body;
		const coordinates = requestBody.location.coordinates;
		const latitude = coordinates[0];
		const longitude = coordinates[1];

		const existingStore = await Store.find({
			'location.coordinates': { $eq: [latitude, longitude] }
		});

		if (existingStore.length > 0) {
			const updatedInStockList = difference(
				union(
					existingStore[0].products.inStock,
					requestBody.products.inStock
				),
				requestBody.products.outOfStock
			);

			const updatedOutOfStockList = difference(
				union(
					existingStore[0].products.outOfStock,
					requestBody.products.outOfStock
				),
				requestBody.products.inStock
			);

			const updatedProductsList = {
				inStock: updatedInStockList,
				outOfStock: updatedOutOfStockList
			};

			const store = await Store.findOneAndUpdate(
				{ 'location.coordinates': { $eq: [latitude, longitude] } },
				{ $set: { products: updatedProductsList } },
				{ upsert: true, new: true, runValidators: true },
				function(err, doc) {
					if (err) return res.send(500, { error: err });
					return res.send('Successfully saved.');
				}
			);
		} else {
			const newStore = new Store(req.value.body);
			const store = await newStore.save();
			res.status(201).json(store);
		}
	},

	updateStore: async (req, res, next) => {
		const { storeId } = req.value.params;
		const createStore = req.value.body;
		const store = await Store.findByIdAndUpdate(storeId, createStore);
		res.status(200).json({ success: true });
	},

	deleteStore: async (req, res, next) => {
		const { storeId } = req.value.params;
		await Store.findByIdAndRemove(storeId);
		res.status(200).json({
			message: 'store deleted successfully'
		});
	}
};
