"use strict";
const { validationResult } = require("express-validator");
// birdController
const {
  getAllBirds,
  getBirdsByKeyword,
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
    const birds = await getBirdsByKeyword(next);
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
    const Luomispaikka = await getCoordinates(req.file.path);
    req.body.Luomispaikka = Luomispaikka;
  } catch (e) {
    req.body.Luomispaikka = [24.74, 60.24];
  }

  try {
    const thumb = await makeThumbnail(
      req.file.path,
      "./thumbnails/" + req.file.Tiedostonimi
    );

    const { Kuvaus, Lajinumero, Luomispaikka } = req.body;

    const tulos = await addBird(
      Kuvaus,
      Lajinumero,
      req.user.Kayttajanumero,
      req.file.Tiedostonimi,
      JSON.stringify(Luomispaikka),
      next
    );
    if (thumb) {
      if (tulos.affectedRows > 0) {
        res.json({
          message: "bird added",
          Tiedostonumero: tulos.insertId,
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
    const { Kuvaus } = req.body;
    /*let owner = req.user.user_id;
    if (req.user.role === 0) {
      owner = req.body.owner;
    }*/

    const omistaja = req.user.Roolinumero === 0 ? req.body.owner : req.user.Kayttajanumero;

    const tulos = await modifyBird(
      Tiedostonimi,
      Kuvaus,
      omistaja,
      req.params.Tiedostonumero,
      req.user.Roolinumero,
      next
    );
    if (tulos.affectedRows > 0) {
      res.json({
        message: "bird modified",
        Tiedostonumero: tulos.insertId,
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
  try {
    const vastaus = await deleteBird(
      req.params.Tiedostonumero,
      req.user.Kayttajanumero,
      req.user.Roolinumero,
      next
    );
    if (vastaus.affectedRows > 0) {
      res.json({
        message: "bird deleted",
        Tiedostonumero: vastaus.insertId,
      });
    } else {
      next(httpError("No bird found", 404));
    }
  } catch (e) {
    console.log("bird_delete error", e.message);
    next(httpError("internal server error", 500));
  }
};

module.exports = {
  bird_list_get,
  bird_list_by_keyword_get,
  bird_get,
  bird_post,
  bird_put,
  bird_delete,
};
