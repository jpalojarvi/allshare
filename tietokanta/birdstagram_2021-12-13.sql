# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.5.5-10.6.4-MariaDB)
# Database: birdstagram
# Generation Time: 2021-12-13 11:34:32 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table kayttaja
# ------------------------------------------------------------

DROP TABLE IF EXISTS `kayttaja`;

CREATE TABLE `kayttaja` (
  `kayttajanumero` int(11) NOT NULL AUTO_INCREMENT,
  `kayttajanimi` varchar(100) DEFAULT NULL,
  `salasana` varchar(255) DEFAULT NULL,
  `rekisteroitymisaika` timestamp NOT NULL DEFAULT current_timestamp(),
  `muokkausaika` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `lopetusaika` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `sahkopostiosoite` varchar(100) DEFAULT NULL,
  `roolinumero` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`kayttajanumero`),
  KEY `Roolinumero` (`roolinumero`),
  CONSTRAINT `kayttaja_ibfk_1` FOREIGN KEY (`roolinumero`) REFERENCES `Rooli` (`roolinumero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `kayttaja` WRITE;
/*!40000 ALTER TABLE `kayttaja` DISABLE KEYS */;

INSERT INTO `kayttaja` (`kayttajanumero`, `kayttajanimi`, `salasana`, `rekisteroitymisaika`, `muokkausaika`, `lopetusaika`, `sahkopostiosoite`, `roolinumero`)
VALUES
	(2,'kekkonen','$2a$10$5RzpyimIeuzNqW7G8seBiOzBiWBvrSWroDomxMa0HzU6K2ddSgixS','2021-12-08 13:17:19','0000-00-00 00:00:00','0000-00-00 00:00:00','kekkonen@pm.fi',1),
	(3,'toinen','$2a$10$5RzpyimIeuzNqW7G8seBiOzBiWBvrSWroDomxMa0HzU6K2ddSgixS','2021-12-11 11:15:14','0000-00-00 00:00:00','0000-00-00 00:00:00','toinen@pm.fi',1);

/*!40000 ALTER TABLE `kayttaja` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table laji
# ------------------------------------------------------------

DROP TABLE IF EXISTS `laji`;

CREATE TABLE `laji` (
  `lajinumero` int(11) NOT NULL AUTO_INCREMENT,
  `latinanimi` varchar(100) DEFAULT NULL,
  `englantinimi` varchar(100) DEFAULT NULL,
  `suominimi` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`lajinumero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `laji` WRITE;
/*!40000 ALTER TABLE `laji` DISABLE KEYS */;

INSERT INTO `laji` (`lajinumero`, `latinanimi`, `englantinimi`, `suominimi`)
VALUES
	(1,'bruttis','biirdei','lintsukka'),
	(2,'killis','lipsis','birdielainen'),
	(3,'hanhilis','johnson','suohanhi'),
	(4,'predis ladis','egglet','kotkis');

/*!40000 ALTER TABLE `laji` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table relationship
# ------------------------------------------------------------

DROP TABLE IF EXISTS `relationship`;

CREATE TABLE `relationship` (
  `lajinumero` int(11) NOT NULL,
  `tiedostonumero` int(11) NOT NULL,
  PRIMARY KEY (`lajinumero`,`tiedostonumero`),
  KEY `Tiedostonumero` (`tiedostonumero`),
  CONSTRAINT `relationship_ibfk_1` FOREIGN KEY (`lajinumero`) REFERENCES `Laji` (`lajinumero`),
  CONSTRAINT `relationship_ibfk_2` FOREIGN KEY (`tiedostonumero`) REFERENCES `Tiedosto` (`tiedostonumero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table rooli
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rooli`;

CREATE TABLE `rooli` (
  `roolinumero` int(11) NOT NULL AUTO_INCREMENT,
  `roolinimi` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`roolinumero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `rooli` WRITE;
/*!40000 ALTER TABLE `rooli` DISABLE KEYS */;

INSERT INTO `rooli` (`roolinumero`, `roolinimi`)
VALUES
	(0,'admin'),
	(1,'kayttaja'),
	(2,'moderaattori');

/*!40000 ALTER TABLE `rooli` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tiedosto
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tiedosto`;

CREATE TABLE `tiedosto` (
  `tiedostonumero` int(11) NOT NULL AUTO_INCREMENT,
  `tiedostonimi` varchar(100) NOT NULL DEFAULT '',
  `lisaysaika` timestamp NOT NULL DEFAULT current_timestamp(),
  `luomispaikka` varchar(100) DEFAULT NULL,
  `kuvaus` varchar(255) DEFAULT NULL,
  `kayttajanumero` int(11) NOT NULL,
  `lajinumero` int(11) DEFAULT NULL,
  PRIMARY KEY (`tiedostonumero`),
  KEY `Kayttajanumero` (`kayttajanumero`),
  KEY `Lajinumero` (`lajinumero`),
  CONSTRAINT `tiedosto_ibfk_1` FOREIGN KEY (`kayttajanumero`) REFERENCES `Kayttaja` (`kayttajanumero`),
  CONSTRAINT `tiedosto_ibfk_2` FOREIGN KEY (`lajinumero`) REFERENCES `laji` (`lajinumero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `tiedosto` WRITE;
/*!40000 ALTER TABLE `tiedosto` DISABLE KEYS */;

INSERT INTO `tiedosto` (`tiedostonumero`, `tiedostonimi`, `lisaysaika`, `luomispaikka`, `kuvaus`, `kayttajanumero`, `lajinumero`)
VALUES
	(3,'ee998e5c216643d0cf4068de32b6d827','2021-12-13 13:11:11',NULL,'tämä lintu (kissa) on kuvattu Tohmajärvellä eräässä erämaamökissä',3,1),
	(4,'b66d41fd35b7c513d676cdb144ae011b','2021-12-13 13:11:07',NULL,'testitekstiä',3,2),
	(6,'b66d41fd35b7c513d676cdb144ae011b','2021-12-11 21:06:11','[24.74,60.24]','jotain juttuu',2,1),
	(7,'b2b65bba4a921b231cc0d6697e0eca48','2021-12-11 21:06:11','[24.74,60.24]','talvi aamuna pikkulintu laulaa minussa, voitan tai häviän, en suostu kuolemaanm',2,2),
	(8,'ee998e5c216643d0cf4068de32b6d827','2021-12-11 21:06:11','[24.74,60.24]','dippidaijee ',2,2),
	(11,'9292af2c7b722cc53596ddcec0f5ce7c','2021-12-13 13:11:11','[24.74,60.24]','jaahas ja jotain',2,3);

/*!40000 ALTER TABLE `tiedosto` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tykkaykset
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tykkaykset`;

CREATE TABLE `tykkaykset` (
  `tykkaysnumero` int(11) NOT NULL AUTO_INCREMENT,
  `kayttajanumero` int(11) DEFAULT NULL,
  `tiedostonumero` int(11) DEFAULT NULL,
  PRIMARY KEY (`tykkaysnumero`),
  KEY `Kayttajanumero` (`kayttajanumero`),
  KEY `Tiedostonumero` (`tiedostonumero`),
  CONSTRAINT `tykkaykset_ibfk_1` FOREIGN KEY (`kayttajanumero`) REFERENCES `Kayttaja` (`kayttajanumero`),
  CONSTRAINT `tykkaykset_ibfk_2` FOREIGN KEY (`tiedostonumero`) REFERENCES `Tiedosto` (`tiedostonumero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
