"use strict";
// birdRoute
const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");
const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ dest: "./uploads/", fileFilter });
const {
  bird_list_get,
  bird_get,
  bird_post,
  bird_put,
  bird_delete,
} = require("../controllers/birdController");
const router = express.Router();

router
  .route("/")
  .get(bird_list_get)
  .post(
    passport.authenticate("jwt", { session: false }),
    upload.single("bird"),
    body("name").notEmpty().escape(),
    body("birthdate").isDate(),
    body("weight").isNumeric(),
    bird_post
  );

router
  .route("/:id")
  .get(bird_get)
  .delete(bird_delete)
  .put(
    body("name").notEmpty().escape(),
    body("birthdate").isDate(),
    body("weight").isNumeric(),
    bird_put
  );

module.exports = router;
