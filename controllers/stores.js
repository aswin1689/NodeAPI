const Store = require('../models/store');

module.exports = {
	index: async (req, res, next) => {
		const store = await Store.find({});
		res.status(200).json(store);
	},

	newStore: async (req, res, next) => {
		const newStore = new Store(req.value.body);
		const store = await newStore.save();
		res.status(201).json(store);
	},

	getStore: async (req, res, next) => {
		const { storeId } = req.value.params;
		const store = await Store.findById(storeId);
		res.status(200).json(store);
	},

	getStoreWithItemsInStock: async (req, res, next) => {
		let productsList = req.query.products.split(',');
		const store = await Store.find({
			productsInStock: {
				$in: productsList
			}
		});
		res.status(200).json(store);
	},

	replaceStore: async (req, res, next) => {
		const { storeId } = req.value.params;
		const newStore = req.value.body;
		const store = await Store.findByIdAndUpdate(storeId, newStore);
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