"use strict";
// birdRoute
const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");
const passport = require("../utils/pass");
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
  bird_list_by_keyword_get,
  bird_list_by_search_get,
  bird_list_by_user_get,
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
  upload.single("tiedostonimi"),
  body("suominimi"),
  body("kuvaus"),
  bird_post
);
router
.route("/names")
.get(bird_list_by_keyword_get);

router
.route("/search")
.get(bird_list_by_search_get);

router
.route("/userbirds")
.get(bird_list_by_user_get);

router
  .route("/:id")
  .get(bird_get)
  .delete(passport.authenticate("jwt", { session: false }), bird_delete)
  .put(
    passport.authenticate("jwt", { session: false }),
    body("kuvaus"),
    bird_put
  );

module.exports = router;
