"use strict";
const { validationResult } = require("express-validator");
// birdController
const {
  getAllBirds,
  getBirdsByKeyword,
  getBirdsSearch,
  getBird,
  addBird,
  modifyBird,
  deleteBird,
} = require("../models/birdModel");
const { httpError } = require("../utils/errors");
const { getCoordinates } = require("../utils/imageMeta");
const { makeThumbnail } = require("../utils/resize");

const bird_list_get = async (req, res, next) => {
  try {
    const birds = await getAllBirds(next);
    if (birds.length > 0) {
      res.json(birds);
    } else {
      next("No birds found", 404);
    }
  } catch (e) {
    console.log("bird_list_get error", e.message);
    next(httpError("internal server error", 500));
  }
};

const bird_list_by_keyword_get = async (req, res, next) => {
  try {
    const birdnames = await getBirdsByKeyword(next);
    if (birdnames.length > 0) {
      res.json(birdnames);
    } else {
      next("No keywords found", 404);
    }
  } catch (e) {
    console.log("bird_list_by_keyword_get error", e.message);
    next(httpError("internal server error", 500));
  }
};

const bird_list_by_search_get = async (req, res, next) => {
  console.log("bird search", req.query.hakusana);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("bird_search validation", errors.array());
    next(httpError("invalid data", 400));
    return;
  }
  try {
    const birdsearch = await getBirdsSearch(req.query.hakusana, next);
    if (birdsearch.length > 0) {
      res.json(birdsearch);
    } else {
      next("No birds found", 404);
    }
  } catch (e) {
    console.log("bird_list_by_search_get error", e.message);
    next(httpError("internal server error", 500));
  }
};

const bird_get = async (req, res, next) => {
  try {
    const vastaus = await getBird(req.params.id, next);
    if (vastaus.length > 0) {
      res.json(vastaus.pop());
    } else {
      next(httpError("No bird found", 404));
    }
  } catch (e) {
    console.log("bird_get error", e.message);
    next(httpError("internal server error", 500));
  }
};

const bird_post = async (req, res, next) => {
  console.log("bird_post", req.body, req.file, req.user);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("bird_post validation", errors.array());
    next(httpError("invalid data", 400));
    return;
  }

  if (!req.file) {
    const err = httpError("file not valid", 400);
    next(err);
    return;
  }

  try {
    const luomispaikka = await getCoordinates(req.file.path);
    req.body.luomispaikka = luomispaikka;
  } catch (e) {
    req.body.luomispaikka = [24.74, 60.24];
  }

  try {
    const thumb = await makeThumbnail(
      req.file.path,
      "./thumbnails/" + req.file.filename
    );

    const { kuvaus, luomispaikka, lajinumero } = req.body;

    const tulos = await addBird(
      kuvaus,
      lajinumero,
      req.user.kayttajanumero,
      req.file.filename,
      JSON.stringify(luomispaikka),
      next
    );
    if (thumb) {
      if (tulos.affectedRows > 0) {
        res.json({
          message: "bird added",
          tiedostonumero: tulos.insertId,
        });
      } else {
        next(httpError("No bird inserted", 400));
      }
    }
  } catch (e) {
    console.log("bird_post error", e.message);
    next(httpError("internal server error", 500));
  }
};

const bird_put = async (req, res, next) => {
  console.log("bird_put", req.body, req.params);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("bird_put validation", errors.array());
    next(httpError("invalid data", 400));
    return;
  }
  // pvm VVVV-KK-PP esim 2010-05-28
  try {
    const { kuvaus } = req.body;
    /*let owner = req.user.user_id;
    if (req.user.role === 0) {
      owner = req.body.owner;
    }*/

    const omistaja =
      req.user.roolinumero === 0 ? req.body.owner : req.user.kayttajanumero;
    const tulos = await modifyBird(
      req.params.id,
      kuvaus,
      req.user.kayttajanumero,
      req.user.roolinumero,
      next
    );
    if (tulos.affectedRows > 0) {
      res.json({
        message: "bird modified",
        tiedostonumero: tulos.insertId,
      });
    } else {
      next(httpError("No bird modified", 400));
    }
  } catch (e) {
    console.log("bird_put error", e.message);
    next(httpError("internal server error", 500));
  }
};

const bird_delete = async (req, res, next) => {
  console.log(req.user);
  try {
    const vastaus = await deleteBird(
      req.params.id,
      req.user.kayttajanumero,
      req.user.roolinumero,
      next
    );
    if (vastaus.affectedRows > 0) {
      res.json({
        message: "bird deleted",
        tiedostonumero: vastaus.insertId,
      });
    } else {
      next(httpError("No bird found", 404));
    }
  } catch (e) {
    console.log("bird_delete error", e.message);
    next(httpError("horrible server error", 500));
  }
};

module.exports = {
  bird_list_get,
  bird_list_by_keyword_get,
  bird_list_by_search_get,
  bird_get,
  bird_post,
  bird_put,
  bird_delete,
};
