const express = require("express");
const router = require("express-promise-router")();

const UsersController = require("../controllers/users");

const {
  validateBody,
  validateParam,
  schemas
} = require("../helpers/routeHelpers");

router
  .route("/")
  .get(UsersController.index)
  .post(validateBody(schemas.userSchema), UsersController.newUser);

router
  .route("/:userId")
  .get(validateParam(schemas.idSchema, "userId"), UsersController.getUser)
  .put(
    [
      validateParam(schemas.idSchema, "userId"),
      validateBody(schemas.userSchema)
    ],
    UsersController.replaceUser
  )
  .patch(
    [
      validateParam(schemas.idSchema, "userId"),
      validateBody(schemas.userOptionalSchema)
    ],
    UsersController.updateUser
  )
  .delete(
    validateParam(schemas.idSchema, "userId"),
    UsersController.deleteUser
  );

router
  .route("/:userId/products")
  .get(
    validateParam(schemas.idSchema, "userId"),
    UsersController.getUserProducts
  )
  .post(
    [
      validateParam(schemas.idSchema, "userId"),
      validateBody(schemas.productSchema)
    ],
    UsersController.newUserProduct
  );

module.exports = router;
