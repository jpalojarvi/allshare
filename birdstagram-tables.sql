/* Test from ERDPlus */

CREATE TABLE Rooli
(
  Roolinumero INT NOT NULL,
  Roolinimi INT NOT NULL,
  PRIMARY KEY (Roolinumero)
);

CREATE TABLE Laji
(
  Lajinumero INT NOT NULL,
  Latinanimi INT NOT NULL,
  Englantinimi INT NOT NULL,
  Suominimi INT NOT NULL,
  PRIMARY KEY (Lajinumero)
);

CREATE TABLE Kayttaja
(
  Kayttajanumero INT NOT NULL,
  Kayttajanimi INT NOT NULL,
  Salasana INT NOT NULL,
  Rekisteroitymisaika INT NOT NULL,
  Muokkausaika INT NOT NULL,
  Lopetusaika INT NOT NULL,
  Sahkopostiosoite INT NOT NULL,
  Roolinumero INT NOT NULL,
  PRIMARY KEY (Kayttajanumero),
  FOREIGN KEY (Roolinumero) REFERENCES Rooli(Roolinumero)
);

CREATE TABLE Tiedosto
(
  Tiedostonumero INT NOT NULL,
  Tiedostonimi INT NOT NULL,
  Luomispaivamaara INT NOT NULL,
  Lisaysaika INT NOT NULL,
  Luomispaikka INT NOT NULL,
  Kuvaus INT NOT NULL,
  Tykkaykset INT NOT NULL,
  Kayttajanumero INT,
  PRIMARY KEY (Tiedostonumero),
  FOREIGN KEY (Kayttajanumero) REFERENCES Kayttaja(Kayttajanumero)
);

CREATE TABLE Relationship
(
  Lajinumero INT NOT NULL,
  Tiedostonumero INT NOT NULL,
  PRIMARY KEY (Lajinumero, Tiedostonumero),
  FOREIGN KEY (Lajinumero) REFERENCES Laji(Lajinumero),
  FOREIGN KEY (Tiedostonumero) REFERENCES Tiedosto(Tiedostonumero)
);