const Joi = require('joi');

const locationSchema = Joi.object()
	.keys({
		lat: Joi.number().required(),
		long: Joi.number().required()
	})
	.required();

module.exports = {
	//schema: schema we want to validate against; name: name of param(can be multiple params)
	validateParam: (schema, name) => {
		return (req, res, next) => {
			const result = Joi.validate({ param: req['params'][name] }, schema);
			if (result.error) {
				return res.status(400).json(result.error);
			} else {
				//to handle validating multiple params
				if (!req.value) {
					req.value = {};
				}
				if (!req.value['params']) {
					req.value['params'] = {};
				}
				req.value['params'][name] = result.value.param;
				next();
			}
		};
	},

	validateBody: schema => {
		return (req, res, next) => {
			const result = Joi.validate(req.body, schema);
			if (result.error) {
				return res.status(400).json(result.error);
			} else {
				if (!req.value) {
					req.value = {};
				}
				if (!req.value['body']) {
					req.value['body'] = {};
				}
				req.value['body'] = result.value;
				next();
			}
		};
	},

	schemas: {
		userSchema: Joi.object().keys({
			firstName: Joi.string().required(),
			lastName: Joi.string().required(),
			email: Joi.string()
				.email()
				.required()
		}),
		userOptionalSchema: Joi.object().keys({
			firstName: Joi.string(),
			lastName: Joi.string(),
			email: Joi.string()
		}),
		productSchema: Joi.object().keys({
			name: Joi.string().required(),
			category: Joi.string().required(),
			year: Joi.number().required()
		}),
		idSchema: Joi.object().keys({
			param: Joi.string()
				.regex(/^[0-9a-fA-F]{24}$/)
				.required()
		}),
		storeSchema: Joi.object().keys({
			storeName: Joi.string().required(),
			location: Joi.object()
				.keys({
					type: Joi.string()
						.required()
						.valid(['Point']),
					coordinates: Joi.array().ordered([
						Joi.number()
							.min(-90)
							.max(90)
							.required(),
						Joi.number()
							.min(-180)
							.max(180)
							.required()
					])
				})
				.description('Please use this format [latitude, longitude]'),
			address: Joi.object()
				.keys({
					street: Joi.string().required(),
					city: Joi.string().required(),
					state: Joi.string().required(),
					zip: Joi.number().required()
				})
				.required(),
			businessHours: Joi.object().keys({
				open: Joi.string().required(),
				close: Joi.string().required()
			}),
			phone: Joi.string().required(),
			products: Joi.object().keys({
				inStock: Joi.array()
					.items(Joi.string())
					.required(),
				outOfStock: Joi.array()
					.items(Joi.string())
					.required()
			})
		})
	}
};
