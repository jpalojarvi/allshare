"use strict";
const pool = require("../database/db");
const { httpError } = require("../utils/errors");
const promisePool = pool.promise();

const getAllBirds = async (next) => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner's name as ownername (from wop_user table).
    const [rows] = await promisePool.execute(`
<<<<<<< HEAD
    SELECT tiedostonumero, tiedostonimi, lisaysaika, kuvaus, tiedosto.kayttajanumero, tiedosto.lajinumero, laji.suominimi, kayttaja.kayttajanimi, kayttaja.kayttajanumero, kayttaja.sahkopostiosoite, kayttaja.roolinumero FROM tiedosto JOIN laji ON tiedosto.lajinumero = laji.lajinumero JOIN kayttaja ON tiedosto.kayttajanumero = kayttaja.kayttajanumero ORDER BY tiedostonumero DESC;`
=======
    SELECT * FROM tiedosto JOIN laji ON tiedosto.lajinumero = laji.lajinumero JOIN kayttaja ON tiedosto.kayttajanumero = kayttaja.kayttajanumero ORDER BY tiedostonumero DESC;`
>>>>>>> c1f4aa3ba8bd359d2a371a8233b47310676d5192
  );
    return rows;
  } catch (e) {
    console.error("getAllBirds error", e.message);
    next(httpError("Database error", 500));
  }
};
//select * from taulu where kenttä like ?;
//[`%${hakusana}%`]
const getBirdsByKeyword = async (next) => {
  try {
    const [rows] = await promisePool.execute(`
	SELECT 
  lajinumero,
<<<<<<< HEAD
	suominimi 
=======
	suominimi, 
>>>>>>> c1f4aa3ba8bd359d2a371a8233b47310676d5192
	FROM laji`);
    return rows;
  } catch (e) {
    console.error("getBirdsByKeyword error", e.message);
    next(httpError("Database error", 500));
  }
};

const getBird = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
      `
	  SELECT *
	  FROM tiedosto
	  JOIN laji ON
	  tiedosto.lajinumero = laji.lajinumero
	  WHERE tiedosto.lajinumero = ?`,
      [id]
    );
    return rows;
  } catch (e) {
    console.error("getBird error", e.message);
    next(httpError("Database error", 500));
  }
};

const addBird = async (
  kuvaus,
  lajinumero,
  kayttajanumero,
  tiedostonimi,
  luomispaikka,
  next
) => {
  try {
    const [rows] = await promisePool.execute(
      //"INSERT INTO tiedosto (tiedostonimi, luomispaikka, kuvaus, kayttajanumero) VALUES (?, ?, ?, ?, ?);INSERT INTO relationship (lajinumero, tiedostonumero)VALUES (?, LAST_INSERT_ID();",
      "INSERT INTO tiedosto (tiedostonimi, luomispaikka, kuvaus, kayttajanumero, lajinumero) VALUES (?, ?, ?, ?, ?);",
      [tiedostonimi, luomispaikka, kuvaus, kayttajanumero, lajinumero],
     
    );
    return rows;
  } catch (e) {
    console.error("addBird error", e.message);
    next(httpError("Database error", 500));
  }
};

const modifyBird = async (
  id,
  kuvaus,
  kayttajanumero,
  roolinumero,
  next
) => {
  let sql =
    "UPDATE tiedosto SET kuvaus = ? WHERE tiedostonumero = ? AND kayttajanumero = ?;";
  let params = [kuvaus, id, kayttajanumero];
  if (roolinumero === 0) {
    sql =
      "UPDATE tiedosto SET kuvaus = ? WHERE tiedostonumero = ?;";
    params = [kuvaus, id];
  }
  console.log("sql", sql);
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error("addBird error", e.message);
    next(httpError("Database error", 500));
  }
};

const deleteBird = async (id, kayttajanumero, roolinumero, next) => {
  let sql1 = "DELETE FROM relationship WHERE tiedostonumero = ?;";
  let params1 = [id];
  let sql = "DELETE FROM tiedosto WHERE tiedostonumero = ? AND kayttajanumero = ?;";
  let params = [id, kayttajanumero];
  if (roolinumero === 0) {
    sql = "DELETE FROM tiedosto WHERE tiedostonumero = ?;";
    params = [id];
  }
  try {
    const [rows1] = await promisePool.execute(sql1, params1);
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error("deleteBird error", e.message);
    next(httpError("Database error", 500));
  }
};

module.exports = {
  getAllBirds,
  getBirdsByKeyword,
  getBird,
  addBird,
  modifyBird,
  deleteBird,
};
