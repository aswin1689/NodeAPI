const router = require('express-promise-router')();

const UsersController = require('../controllers/users');
const StoresController = require('../controllers/stores');

const {
	validateBody,
	validateParam,
	schemas
} = require('../helpers/routeHelpers');

router
	.route('/users')
	.get(UsersController.index)
	.post(validateBody(schemas.userSchema), UsersController.newUser);

router
	.route('/users/:userId')
	.get(validateParam(schemas.idSchema, 'userId'), UsersController.getUser)
	.put(
		[
			validateParam(schemas.idSchema, 'userId'),
			validateBody(schemas.userSchema)
		],
		UsersController.replaceUser
	)
	.patch(
		[
			validateParam(schemas.idSchema, 'userId'),
			validateBody(schemas.userOptionalSchema)
		],
		UsersController.updateUser
	)
	.delete(
		validateParam(schemas.idSchema, 'userId'),
		UsersController.deleteUser
	);

router
	.route('/users/:userId/products')
	.get(
		validateParam(schemas.idSchema, 'userId'),
		UsersController.getUserProducts
	)
	.post(
		[
			validateParam(schemas.idSchema, 'userId'),
			validateBody(schemas.productSchema)
		],
		UsersController.newUserProduct
	);

router
	.route('/stores')
	.get(StoresController.index)
	.post(validateBody(schemas.storeSchema), StoresController.createStore);

router.route('/stores/inStock').get(StoresController.getStoreWithItemsInStock);

router
	.route('/stores/:storeId')
	.get(validateParam(schemas.idSchema, 'storeId'), StoresController.getStore)
	.put(
		[
			validateParam(schemas.idSchema, 'storeId'),
			validateBody(schemas.storeSchema)
		],
		StoresController.updateStore
	)
	.delete(
		validateParam(schemas.idSchema, 'storeId'),
		StoresController.deleteStore
	);

module.exports = router;
