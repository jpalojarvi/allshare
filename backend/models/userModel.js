"use strict";
const pool = require("../database/db");
const { httpError } = require("../utils/errors");
const promisePool = pool.promise();

const getAllUsers = async (next) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT Kayttajanumero, Kayttajanimi, Sahkopostiosoite, Roolinumero FROM kayttaja"
    );
    return rows;
  } catch (e) {
    console.error("getAllUsers error", e.message);
    next(httpError("Database error", 500));
  }
};

const getUser = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT Kayttajanumero, Kayttajanimi, Sahkopostiosoite, Roolinumero FROM kayttaja WHERE Kayttajanumero = ?",
      [id]
    );
    return rows;
  } catch (e) {
    console.error("getUser error", e.message);
    next(httpError("Database error", 500));
  }
};

const addUser = async (name, email, password, next) => {
  try {
    const [rows] = await promisePool.execute(
      "INSERT INTO kayttaja (Kayttajanimi, Sahkopostiosoite, Salasana) VALUES (?, ?, ?)",
      [name, email, password]
    );
    return rows;
  } catch (e) {
    console.error("addUser error", e.message);
    next(httpError("Database error", 500));
  }
};

const getUserLogin = async (params) => {
  try {
    console.log("getUserLogin", params);
    const [rows] = await promisePool.execute(
      "SELECT * FROM kayttaja WHERE Sahkopostiosoite = ?;",
      params
    );
    return rows;
  } catch (e) {
    console.log("getUserLogin error", e.message);
    return [];
  }
};

module.exports = {
  getAllUsers,
  getUser,
  addUser,
  getUserLogin,
};
