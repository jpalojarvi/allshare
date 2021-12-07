"use strict";
const pool = require("../database/db");
const { httpError } = require("../utils/errors");
const promisePool = pool.promise();

const getAllBirds = async (next) => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner's name as ownername (from wop_user table).
    const [rows] = await promisePool.execute(`
	SELECT 
	Tiedostonumero, 
	Tiedostonimi, 
	Luomispaikka, 
	Kuvaus, 
	Kayttajanumero,
	FROM Tiedosto
	JOIN Laji ON 
	wop_bird.owner = wop_user.user_id`);
    return rows;
  } catch (e) {
    console.error("getAllBirds error", e.message);
    next(httpError("Database error", 500));
  }
};

const getBird = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
      `
	  SELECT 
	  bird_id, 
	  wop_bird.name, 
	  weight, 
	  owner, 
	  filename,
	  birthdate, 
	  coords,
	  wop_user.name as ownername 
	  FROM wop_bird 
	  JOIN wop_user ON 
	  wop_bird.owner = wop_user.user_id
	  WHERE bird_id = ?`,
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
  Lisaysaika,
  Luomispaikka,
  Kuvaus,
  Kayttajanumero,
  next
) => {
  try {
    const [rows] = await promisePool.execute(
      "INSERT INTO Tiedosto (Tiedostonimi, Lisaysaika, Luomispaikka, Kuvaus, Kayttajanumero) VALUES (?, ?, ?, ?, ?)",
      [Tiedostonimi, Lisaysaika, Luomispaikka, Kuvaus, Kayttajanumero]
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

const deleteBird = async (id, owner_id, role, next) => {
  let sql = "DELETE FROM wop_bird WHERE bird_id = ? AND owner = ?";
  let params = [id, owner_id];
  if (role === 0) {
    sql = "DELETE FROM wop_bird WHERE bird_id = ?";
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
  getBird,
  addBird,
  modifyBird,
  deleteBird,
};
