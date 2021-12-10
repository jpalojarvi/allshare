"use strict";
const pool = require("../database/db");
const { httpError } = require("../utils/errors");
const promisePool = pool.promise();

const getAllBirds = async (next) => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner's name as ownername (from wop_user table).
    const [rows] = await promisePool.execute(`
    SELECT * FROM tiedosto;`
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
    // TODO: do the LEFT (or INNER) JOIN to get owner's name as ownername (from wop_user table).
    const [rows] = await promisePool.execute(`
	SELECT 
  Lajinumero,
	Suominimi, 
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
	  JOIN relationship ON 
	  tiedosto.Tiedostonumero = relationship.Tiedostonumero
	  WHERE Lajinumero = ?`,
      [id]
    );
    return rows;
  } catch (e) {
    console.error("getBird error", e.message);
    next(httpError("Database error", 500));
  }
};

const addBird = async (
  Tiedostonimi,
  Luomispaikka,
  Kuvaus,
  Kayttajanumero,
  Lajinumero,
  next
) => {
  try {
    const [rows] = await promisePool.execute(
      "INSERT INTO tiedosto (Tiedostonimi, Luomispaikka, Kuvaus, Kayttajanumero) VALUES (?, ?, ?, ?, ?);INSERT INTO relationship (Lajinumero, Tiedostonumero)VALUES (?, LAST_INSERT_ID();",
      [Tiedostonimi, Luomispaikka, Kuvaus, Kayttajanumero, Lajinumero],
     
    );
    return rows;
  } catch (e) {
    console.error("addBird error", e.message);
    next(httpError("Database error", 500));
  }
};

const modifyBird = async (
  name,
  weight,
  owner,
  birthdate,
  bird_id,
  role,
  next
) => {
  let sql =
    "UPDATE wop_bird SET name = ?, weight = ?, birthdate = ? WHERE bird_id = ? AND owner = ?;";
  let params = [name, weight, birthdate, bird_id, owner];
  if (role === 0) {
    sql =
      "UPDATE wop_bird SET name = ?, weight = ?, birthdate = ?, owner = ? WHERE bird_id = ?;";
    params = [name, weight, birthdate, owner, bird_id];
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

const deleteBird = async (Tiedostonumero, Kayttajanumero, Roolinumero, next) => {
  let sql = "DELETE FROM tiedosto WHERE Tiedostonumero = ? AND Kayttajanumero = ?";
  let params = [Tiedostonumero, Kayttajanumero];
  if (Roolinumero === 0) {
    sql = "DELETE FROM tiedosto WHERE Tiedostonumero = ?";
    params = [id];
  }
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error("getBird error", e.message);
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
