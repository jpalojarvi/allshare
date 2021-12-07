# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.5.5-10.6.4-MariaDB)
# Database: birdstagram
# Generation Time: 2021-12-03 08:27:59 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table Kayttaja
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Kayttaja`;

CREATE TABLE `Kayttaja` (
  `Kayttajanumero` int(11) NOT NULL AUTO_INCREMENT,
  `Kayttajanimi` varchar(100) DEFAULT NULL,
  `Salasana` varchar(255) DEFAULT NULL,
  `Rekisteroitymisaika` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Muokkausaika` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `Lopetusaika` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `Sahkopostiosoite` varchar(100) DEFAULT NULL,
  `Roolinumero` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`Kayttajanumero`),
  KEY `Roolinumero` (`Roolinumero`),
  CONSTRAINT `kayttaja_ibfk_1` FOREIGN KEY (`Roolinumero`) REFERENCES `Rooli` (`Roolinumero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table Laji
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Laji`;

CREATE TABLE `Laji` (
  `Lajinumero` int(11) NOT NULL AUTO_INCREMENT,
  `Latinanimi` varchar(100) DEFAULT NULL,
  `Englantinimi` varchar(100) DEFAULT NULL,
  `Suominimi` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Lajinumero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table Relationship
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Relationship`;

CREATE TABLE `Relationship` (
  `Lajinumero` int(11) NOT NULL,
  `Tiedostonumero` int(11) NOT NULL,
  PRIMARY KEY (`Lajinumero`,`Tiedostonumero`),
  KEY `Tiedostonumero` (`Tiedostonumero`),
  CONSTRAINT `relationship_ibfk_1` FOREIGN KEY (`Lajinumero`) REFERENCES `Laji` (`Lajinumero`),
  CONSTRAINT `relationship_ibfk_2` FOREIGN KEY (`Tiedostonumero`) REFERENCES `Tiedosto` (`Tiedostonumero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table Rooli
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Rooli`;

CREATE TABLE `Rooli` (
  `Roolinumero` int(11) NOT NULL AUTO_INCREMENT,
  `Roolinimi` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Roolinumero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `Rooli` WRITE;
/*!40000 ALTER TABLE `Rooli` DISABLE KEYS */;

INSERT INTO `Rooli` (`Roolinumero`, `Roolinimi`)
VALUES
	(0,'admin'),
	(1,'kayttaja'),
	(2,'moderaattori');

/*!40000 ALTER TABLE `Rooli` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table Tiedosto
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Tiedosto`;

CREATE TABLE `Tiedosto` (
  `Tiedostonumero` int(11) NOT NULL AUTO_INCREMENT,
  `Tiedostonimi` varchar(100) NOT NULL,
  `Lisaysaika` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Luomispaikka` varchar(100) DEFAULT NULL,
  `Kuvaus` varchar(255) DEFAULT NULL,
  `Tykkaykset` int(11) DEFAULT NULL,
  `Kayttajanumero` int(11) NOT NULL,
  PRIMARY KEY (`Tiedostonumero`),
  KEY `Kayttajanumero` (`Kayttajanumero`),
  CONSTRAINT `tiedosto_ibfk_1` FOREIGN KEY (`Kayttajanumero`) REFERENCES `Kayttaja` (`Kayttajanumero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table Tykkaykset
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Tykkaykset`;

CREATE TABLE `Tykkaykset` (
  `Tykkaysnumero` int(11) NOT NULL AUTO_INCREMENT,
  `Kayttajanumero` int(11) DEFAULT NULL,
  `Tiedostonumero` int(11) DEFAULT NULL,
  PRIMARY KEY (`Tykkaysnumero`),
  KEY `Kayttajanumero` (`Kayttajanumero`),
  KEY `Tiedostonumero` (`Tiedostonumero`),
  CONSTRAINT `tykkaykset_ibfk_1` FOREIGN KEY (`Kayttajanumero`) REFERENCES `Kayttaja` (`Kayttajanumero`),
  CONSTRAINT `tykkaykset_ibfk_2` FOREIGN KEY (`Tiedostonumero`) REFERENCES `Tiedosto` (`Tiedostonumero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
