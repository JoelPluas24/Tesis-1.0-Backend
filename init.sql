-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: rehabilitacion_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cumplimiento_ejercicios`
--

DROP TABLE IF EXISTS `cumplimiento_ejercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cumplimiento_ejercicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `ejercicio_id` int NOT NULL,
  `fecha` date NOT NULL,
  `completado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `paciente_id` (`paciente_id`),
  KEY `ejercicio_id` (`ejercicio_id`),
  CONSTRAINT `cumplimiento_ejercicios_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cumplimiento_ejercicios_ibfk_2` FOREIGN KEY (`ejercicio_id`) REFERENCES `ejercicios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cumplimiento_ejercicios`
--

LOCK TABLES `cumplimiento_ejercicios` WRITE;
/*!40000 ALTER TABLE `cumplimiento_ejercicios` DISABLE KEYS */;
INSERT INTO `cumplimiento_ejercicios` VALUES (1,1,1,'2026-06-15',1),(2,1,2,'2026-06-15',1),(3,1,2,'2026-06-16',1),(4,2,4,'2026-06-16',1),(5,2,3,'2026-06-16',1),(6,10,14,'2026-06-18',1),(7,10,12,'2026-06-18',1),(8,9,37,'2026-06-18',1),(9,9,41,'2026-06-18',1),(10,9,40,'2026-06-18',1),(11,4,12,'2026-06-18',1),(12,4,14,'2026-06-18',1),(13,4,11,'2026-06-18',1);
/*!40000 ALTER TABLE `cumplimiento_ejercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ejercicios`
--

DROP TABLE IF EXISTS `ejercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ejercicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text,
  `indicaciones` text,
  `contraindicaciones` text,
  `nivel_dificultad` enum('BAJO','MEDIO','ALTO') NOT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo_ejercicio` enum('MOVILIDAD','ESTIRAMIENTO','FORTALECIMIENTO','EQUILIBRIO','FUNCIONAL') DEFAULT 'MOVILIDAD',
  `requiere_carga` tinyint(1) DEFAULT '0',
  `impacto_articular` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejercicios`
--

LOCK TABLES `ejercicios` WRITE;
/*!40000 ALTER TABLE `ejercicios` DISABLE KEYS */;
INSERT INTO `ejercicios` VALUES (1,'Flexion Plantar','Flexione su tobillo hacia arriba','1. Sentado o acostado lleve su tobillo hacia arriba.','No lleve su tobillo hacia el lado izquierdo o derecho','BAJO','https://www.youtube.com/watch?v=xfKjFtES5fk&t=484s',1,'2026-06-16 00:10:07','MOVILIDAD',0,0),(2,'Flexi├│n Dorsal','Flexione el tobillo hacia abajo, solo el tobillo, no la planta del pie.','1. Acostado, lleve su tobillo hacia abajo.','No lleve su tobillo hacia el lado izquierdo o derecho','BAJO','https://youtube.com/video-demo',1,'2026-06-16 00:11:11','MOVILIDAD',0,0),(3,'Puente Lumbar','sadasdas','asdasdasda','dasdasdasd','BAJO','https://youtube.com/video-demo',1,'2026-06-16 12:20:55','FORTALECIMIENTO',0,0),(4,'Estiramiento de Gato','sdasdasdas','asdasdas','asdasdasd','BAJO','https://youtube.com/video-demo',1,'2026-06-16 12:21:38','ESTIRAMIENTO',0,0),(5,'Estiramiento lumbar acostado (rodillas al pecho)	','','','','BAJO','',1,'2026-06-18 00:33:27','ESTIRAMIENTO',0,0),(6,'Puente de gl├║teos en el suelo	','','','','MEDIO','',1,'2026-06-18 00:33:38','FORTALECIMIENTO',0,0),(7,'Inclinaci├│n p├®lvica acostado boca arriba	','','','','MEDIO','',1,'2026-06-18 00:33:49','FORTALECIMIENTO',0,0),(8,'Plancha abdominal con apoyo en rodillas	','','','','ALTO','',1,'2026-06-18 00:45:40','FORTALECIMIENTO',0,0),(9,'Sentadilla sin peso apoy├índose en la pared	','','','','ALTO','',1,'2026-06-18 00:45:46','FUNCIONAL',0,1),(10,'Flexi├│n y extensi├│n del tobillo con banda el├ística	','','','','ALTO','',1,'2026-06-18 00:52:06','FORTALECIMIENTO',1,0),(11,'Elevaci├│n de talones sentado en silla	','','','','MEDIO','',1,'2026-06-18 00:52:14','FORTALECIMIENTO',0,0),(12,'Movimientos circulares de tobillo sentado	','','','','BAJO','',1,'2026-06-18 00:52:21','MOVILIDAD',0,0),(13,'Equilibrio sobre un pie con apoyo en silla	','','','','ALTO','',1,'2026-06-18 00:52:33','EQUILIBRIO',0,0),(14,'Deslizar una toalla con los dedos del pie	','','','','BAJO','',1,'2026-06-18 00:52:39','MOVILIDAD',0,0),(15,'Respiraci├│n diafragm├ítica acostado boca arriba	','','','','BAJO','',1,'2026-06-18 01:33:20','ESTIRAMIENTO',0,0),(16,'Estiramiento lateral de cuello con la mano	','','','','BAJO','',1,'2026-06-18 01:33:30','ESTIRAMIENTO',0,0),(17,'Presi├│n isom├®trica del cuello contra la almohada	','','','','MEDIO','',1,'2026-06-18 01:33:36','FORTALECIMIENTO',0,0),(18,'Encogimiento de hombros con botellas de agua	','','','','MEDIO','',1,'2026-06-18 01:33:42','FORTALECIMIENTO',1,0),(19,'Rotaci├│n de tronco con brazos extendidos de pie	','','','','ALTO','',1,'2026-06-18 01:33:49','FUNCIONAL',0,0),(20,'Extensi├│n de rodilla sentado en silla','','','','BAJO','',1,'2026-06-18 01:40:30','ESTIRAMIENTO',0,0),(21,'Apretar una almohada entre las rodillas	','','','','BAJO','',1,'2026-06-18 01:40:36','ESTIRAMIENTO',0,0),(22,'Caminar despacio por el pasillo de casa	','','','','MEDIO','',1,'2026-06-18 01:40:41','MOVILIDAD',0,0),(23,'Subir y bajar un escal├│n con apoyo	','','','','MEDIO','',1,'2026-06-18 01:40:48','FUNCIONAL',0,0),(24,'Sentadilla parcial apoyado en la pared	','','','','ALTO','',1,'2026-06-18 01:40:55','FUNCIONAL',0,1),(25,'Zancada est├ítica con apoyo en silla	','','','','ALTO','',1,'2026-06-18 01:41:00','FUNCIONAL',0,1),(26,'Deslizar el tal├│n sobre la cama (flexi├│n de rodilla)	','','','','BAJO','',1,'2026-06-18 01:43:46','MOVILIDAD',0,0),(27,'Apretar una toalla enrollada bajo la rodilla	','','','','BAJO','',1,'2026-06-18 01:43:51','ESTIRAMIENTO',0,0),(28,'Mini sentadilla con apoyo en respaldo de silla	','','','','MEDIO','',1,'2026-06-18 01:43:57','FORTALECIMIENTO',0,0),(29,'Zancada hacia adelante con apoyo en la pared	','','','','ALTO','',1,'2026-06-18 01:44:03','FUNCIONAL',0,1),(30,'Equilibrio sobre una pierna sin apoyo (30 seg)	','','','','ALTO','',1,'2026-06-18 01:44:09','EQUILIBRIO',0,0),(31,'Estiramiento de mu├▒eca con la otra mano	','','','','BAJO','',1,'2026-06-18 01:47:22','MOVILIDAD',0,0),(32,'	Abrir y cerrar la mano lentamente ','','','','BAJO','',1,'2026-06-18 01:47:33','MOVILIDAD',0,0),(33,'Sacudir las manos suavemente','','','','BAJO','',1,'2026-06-18 01:47:42','MOVILIDAD',0,0),(34,'Apretar una pelota de goma blanda	','','','','MEDIO','',1,'2026-06-18 01:47:48','FORTALECIMIENTO',0,0),(35,'Girar la mu├▒eca con una botella de agua peque├▒a	','','','','MEDIO','',1,'2026-06-18 01:47:55','FORTALECIMIENTO',0,0),(36,'Flexiones de mu├▒eca con banda el├ística	','','','','ALTO','',1,'2026-06-18 01:48:03','FORTALECIMIENTO',1,0),(37,'Respiraci├│n profunda acostado en cama','','','','BAJO','',1,'2026-06-18 01:52:31','MOVILIDAD',0,0),(38,'Apretar los gl├║teos acostado boca arriba	','','','','BAJO','',1,'2026-06-18 01:52:39','MOVILIDAD',0,0),(39,'Deslizar el tal├│n sobre la cama (flexi├│n de cadera)	','','','','BAJO','',1,'2026-06-18 01:52:45','MOVILIDAD',0,0),(40,'Levantar la pierna recta acostado','','','','MEDIO','',1,'2026-06-18 01:52:56','FORTALECIMIENTO',0,0),(41,'Caminar despacio por la casa con andador	','','','','MEDIO','',1,'2026-06-18 01:53:03','MOVILIDAD',0,0),(42,'Sentarse y pararse de una silla sin ayuda	','','','','ALTO','',1,'2026-06-18 01:53:12','FUNCIONAL',0,1),(43,'Subir y bajar un escal├│n sin apoyo	','','','','ALTO','',1,'2026-06-18 01:53:17','FUNCIONAL',0,1),(44,'Pendulares de Codman para hombro','Balancear el brazo como un p├®ndulo inclinando el tronco hacia adelante','Realizar movimientos suaves circulares y lineales por 1 minuto','No realizar si hay luxaci├│n o fractura activa','BAJO','',1,'2026-06-22 22:30:59','MOVILIDAD',0,0),(45,'Estiramiento de pectoral contra la pared','Apoyar la mano en la pared y girar el cuerpo en sentido contrario','Mantener 20 segundos, repetir 3 veces cada lado','Evitar si hay dolor agudo en el hombro','BAJO','',1,'2026-06-22 22:30:59','ESTIRAMIENTO',0,0),(46,'Rotaci├│n externa de hombro con banda el├ística','Rotar el antebrazo hacia afuera contra resistencia de banda','Series de 10 con banda ligera','No forzar el rango de movimiento','MEDIO','',1,'2026-06-22 22:30:59','FORTALECIMIENTO',1,0),(47,'Elevaci├│n lateral de brazo con botella de agua','Elevar el brazo lateralmente hasta la altura del hombro con peso ligero','Series de 10 repeticiones con 500ml','No pasar de 90 grados si hay dolor','MEDIO','',1,'2026-06-22 22:30:59','FORTALECIMIENTO',1,0),(48,'Press de hombro de pie con mancuerna ligera','Empujar peso sobre la cabeza desde los hombros de pie','Series de 8, peso m├íximo 2 kg','No realizar con dolor agudo o inestabilidad','ALTO','',1,'2026-06-22 22:30:59','FORTALECIMIENTO',1,0),(49,'Flexiones de pared','Empujarse contra la pared con los brazos para fortalecer hombros y pecho','Series de 10 repeticiones controladas','Suspender si hay chasquido o dolor','ALTO','',1,'2026-06-22 22:30:59','FUNCIONAL',0,1),(50,'Rotaci├│n interna de hombro acostado','Acostado boca arriba, rotar el antebrazo hacia el abdomen con peso ligero','Series de 12 repeticiones lentas','No forzar el rango de movimiento','MEDIO','',1,'2026-06-22 22:30:59','ESTIRAMIENTO',0,0),(51,'Flexi├│n y extensi├│n de cadera acostado','Deslizar el tal├│n acercando la rodilla al pecho y estirar','Repetir 10 veces por cada pierna','No forzar si hay pr├│tesis reciente','BAJO','',1,'2026-06-22 22:31:19','MOVILIDAD',0,0),(52,'Abducci├│n de cadera acostado de lado','Acostado de lado, elevar la pierna superior lentamente','Series de 10 repeticiones cada lado','Evitar si hay dolor inguinal agudo','BAJO','',1,'2026-06-22 22:31:19','ESTIRAMIENTO',0,0),(53,'Apretar pelota entre las rodillas (aductores)','Sentado, apretar una pelota blanda entre las rodillas','10 repeticiones sostenidas 5 segundos','No realizar con pr├│tesis reciente de cadera','MEDIO','',1,'2026-06-22 22:31:19','FORTALECIMIENTO',0,0),(54,'Sentadilla asistida con silla','Sentarse y pararse de una silla lentamente usando los brazos si es necesario','Series de 8 repeticiones controladas','No realizar sin supervisi├│n en fases tempranas','MEDIO','',1,'2026-06-22 22:31:19','FUNCIONAL',0,1),(55,'Caminata con resistencia de banda en tobillos','Caminar lateralmente con banda el├ística en los tobillos','Recorrer 5 metros ida y vuelta','No usar bandas gruesas en fases iniciales','ALTO','',1,'2026-06-22 22:31:19','FORTALECIMIENTO',1,0),(56,'Subir y bajar escaleras sin apoyo','Subir escalones alternando piernas sin barandilla','Subir 10 escalones ida y vuelta','No realizar si hay dolor agudo o inestabilidad','ALTO','',1,'2026-06-22 22:31:19','FUNCIONAL',0,1),(57,'Estiramiento de psoas iliaco arrodillado','En posici├│n de caballero, empujar la cadera hacia adelante','Mantener 20 segundos, 3 veces por lado','No forzar el rango en fase aguda','BAJO','',1,'2026-06-22 22:31:19','ESTIRAMIENTO',0,0);
/*!40000 ALTER TABLE `ejercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fisioterapeutas`
--

DROP TABLE IF EXISTS `fisioterapeutas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fisioterapeutas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `fisioterapeutas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fisioterapeutas`
--

LOCK TABLES `fisioterapeutas` WRITE;
/*!40000 ALTER TABLE `fisioterapeutas` DISABLE KEYS */;
INSERT INTO `fisioterapeutas` VALUES (1,2,'Rehabilitaci├│n Deportiva','0999999999'),(2,13,NULL,'0999999999');
/*!40000 ALTER TABLE `fisioterapeutas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paciente_patologias`
--

DROP TABLE IF EXISTS `paciente_patologias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paciente_patologias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `patologia_id` int NOT NULL,
  `fecha_diagnostico` date DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`id`),
  KEY `paciente_id` (`paciente_id`),
  KEY `patologia_id` (`patologia_id`),
  CONSTRAINT `paciente_patologias_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `paciente_patologias_ibfk_2` FOREIGN KEY (`patologia_id`) REFERENCES `patologias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paciente_patologias`
--

LOCK TABLES `paciente_patologias` WRITE;
/*!40000 ALTER TABLE `paciente_patologias` DISABLE KEYS */;
INSERT INTO `paciente_patologias` VALUES (1,1,1,NULL,NULL),(2,2,1,NULL,NULL),(4,3,3,NULL,NULL),(7,5,5,NULL,NULL),(8,6,6,NULL,NULL),(9,7,7,NULL,NULL),(11,8,8,NULL,NULL),(12,9,9,NULL,NULL),(14,10,4,NULL,NULL),(15,4,7,NULL,NULL),(16,11,11,'2026-06-22',NULL),(17,12,10,'2026-06-22',NULL),(18,13,10,'2026-06-22',NULL),(19,14,11,'2026-06-22',NULL),(20,15,10,'2026-06-22',NULL),(21,16,11,'2026-06-22',NULL),(22,17,11,'2026-06-22',NULL),(25,18,8,NULL,NULL);
/*!40000 ALTER TABLE `paciente_patologias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `fisioterapeuta_id` int DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `genero` enum('M','F') DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `fase_recuperacion` enum('AGUDA','SUBAGUDA','FORTALECIMIENTO','ALTA') DEFAULT 'AGUDA',
  `nivel_dolor` tinyint DEFAULT '0' COMMENT '0-10 escala de dolor',
  `comorbilidades` json DEFAULT NULL COMMENT 'Array: CARDIACA, HIPERTENSION, DIABETES, OBESIDAD',
  `nivel_actividad_fisica` varchar(30) DEFAULT 'SEDENTARIO' COMMENT 'SEDENTARIO, MODERADAMENTE_ACTIVO, ACTIVO, DEPORTISTA',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `fisioterapeuta_id` (`fisioterapeuta_id`),
  CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pacientes_ibfk_2` FOREIGN KEY (`fisioterapeuta_id`) REFERENCES `fisioterapeutas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
INSERT INTO `pacientes` VALUES (1,3,1,23,'M','Guayaquil','AGUDA',3,'[]','MODERADAMENTE_ACTIVO'),(2,4,1,26,'M','guayas','ALTA',3,'[\"HIPERTENSION\"]','SEDENTARIO'),(3,5,1,68,'F','dasdasdasd','FORTALECIMIENTO',1,'[]','ACTIVO'),(4,6,2,42,'M','asdasdasd','AGUDA',7,'[]','DEPORTISTA'),(5,7,1,35,'F','asdadads\n','AGUDA',8,'[]','MODERADAMENTE_ACTIVO'),(6,8,1,55,'M','asdasd','AGUDA',4,'[\"DIABETES\", \"CARDIACA\"]','MODERADAMENTE_ACTIVO'),(7,9,1,28,'M','dasdasd','FORTALECIMIENTO',1,'[]','DEPORTISTA'),(8,10,1,48,'M','sadasdasd','SUBAGUDA',3,'[\"OBESIDAD\"]','SEDENTARIO'),(9,11,1,68,'M','asdadsasd','AGUDA',7,'[\"HIPERTENSION\"]','SEDENTARIO'),(10,12,1,25,'M','sadasdasd','AGUDA',3,'[]','SEDENTARIO'),(11,14,2,68,'F','Calle Flores 123','SUBAGUDA',3,'[]','MODERADAMENTE_ACTIVO'),(12,15,2,30,'M','Av. Principal 456','AGUDA',4,NULL,'ACTIVO'),(13,16,2,45,'F','Calle Luna 789','SUBAGUDA',8,NULL,'MODERADAMENTE_ACTIVO'),(14,17,2,55,'M','Av. Norte 101','SUBAGUDA',3,'[\"CARDIACA\", \"HIPERTENSION\"]','MODERADAMENTE_ACTIVO'),(15,18,2,35,'F','Calle Sur 202','FORTALECIMIENTO',1,NULL,'ACTIVO'),(16,19,2,40,'M','Av. Este 303','SUBAGUDA',2,NULL,'SEDENTARIO'),(17,20,2,72,'F','Calle Oeste 404','AGUDA',7,'[\"CARDIACA\"]','SEDENTARIO'),(18,21,2,18,'F','dasdasdsa','SUBAGUDA',0,'[]','ACTIVO');
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patologia_ejercicios`
--

DROP TABLE IF EXISTS `patologia_ejercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patologia_ejercicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patologia_id` int NOT NULL,
  `ejercicio_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `patologia_id` (`patologia_id`),
  KEY `ejercicio_id` (`ejercicio_id`),
  CONSTRAINT `patologia_ejercicios_ibfk_1` FOREIGN KEY (`patologia_id`) REFERENCES `patologias` (`id`) ON DELETE CASCADE,
  CONSTRAINT `patologia_ejercicios_ibfk_2` FOREIGN KEY (`ejercicio_id`) REFERENCES `ejercicios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patologia_ejercicios`
--

LOCK TABLES `patologia_ejercicios` WRITE;
/*!40000 ALTER TABLE `patologia_ejercicios` DISABLE KEYS */;
INSERT INTO `patologia_ejercicios` VALUES (3,2,4),(4,2,3),(5,3,5),(6,3,6),(7,3,7),(8,3,8),(9,3,9),(22,1,2),(23,1,1),(29,4,10),(30,4,11),(31,4,12),(32,4,13),(33,4,14),(34,5,19),(35,5,18),(36,5,17),(37,5,16),(38,5,15),(39,6,25),(40,6,24),(41,6,23),(42,6,22),(43,6,21),(44,6,20),(45,7,30),(46,7,29),(47,7,28),(48,7,27),(49,7,26),(50,8,36),(51,8,35),(52,8,34),(53,8,33),(54,8,32),(55,8,31),(56,9,43),(57,9,42),(58,9,41),(59,9,40),(60,9,39),(61,9,38),(62,9,37),(77,10,44),(78,10,45),(79,10,46),(80,10,47),(81,10,48),(82,10,49),(83,10,50),(84,11,51),(85,11,52),(86,11,53),(87,11,54),(88,11,55),(89,11,56),(90,11,57);
/*!40000 ALTER TABLE `patologia_ejercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patologias`
--

DROP TABLE IF EXISTS `patologias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patologias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text,
  `nivel_gravedad` enum('LEVE','MODERADA','SEVERA') NOT NULL,
  `activa` tinyint(1) DEFAULT '1',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patologias`
--

LOCK TABLES `patologias` WRITE;
/*!40000 ALTER TABLE `patologias` DISABLE KEYS */;
INSERT INTO `patologias` VALUES (1,'Esguince de Tobillo Grado 1','Paciente presenta esguince de tobillo grado 1. Estiramiento de los tendones','LEVE',1,'2026-06-16 00:07:42'),(2,'Lumbalgia','dasdasdasdjkbjkadsksad','LEVE',1,'2026-06-16 12:20:37'),(3,'Lumbalgia Cronica','asdsadasdasd','MODERADA',1,'2026-06-18 00:33:13'),(4,'	Esguince de Tobillo Grado 2','','MODERADA',1,'2026-06-18 00:51:52'),(5,'Cervicalgia por Hernia Discal C5-C6','','SEVERA',1,'2026-06-18 01:33:01'),(6,'Gonartrosis Bilateral (Artrosis de Rodilla)','','MODERADA',1,'2026-06-18 01:40:01'),(7,'Rotura Parcial del Ligamento Cruzado Anterior (LCA)','','SEVERA',1,'2026-06-18 01:43:36'),(8,'S├¡ndrome del T├║nel Carpiano','','LEVE',1,'2026-06-18 01:47:13'),(9,'Fractura de Cadera (Post-quir├║rgico)','','SEVERA',1,'2026-06-18 01:52:19'),(10,'Tendinitis de Hombro','Inflamaci├│n del tend├│n del manguito rotador que causa dolor y limitaci├│n funcional en la articulaci├│n del hombro','MODERADA',1,'2026-06-22 22:30:28'),(11,'Artrosis de Cadera','Desgaste del cart├¡lago articular de la cadera que genera dolor, rigidez y limitaci├│n progresiva de la movilidad','SEVERA',1,'2026-06-22 22:30:28');
/*!40000 ALTER TABLE `patologias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rutina_ejercicios`
--

DROP TABLE IF EXISTS `rutina_ejercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rutina_ejercicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rutina_id` int NOT NULL,
  `ejercicio_id` int NOT NULL,
  `series` int NOT NULL,
  `repeticiones` int NOT NULL,
  `frecuencia` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rutina_id` (`rutina_id`),
  KEY `ejercicio_id` (`ejercicio_id`),
  CONSTRAINT `rutina_ejercicios_ibfk_1` FOREIGN KEY (`rutina_id`) REFERENCES `rutinas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `rutina_ejercicios_ibfk_2` FOREIGN KEY (`ejercicio_id`) REFERENCES `ejercicios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rutina_ejercicios`
--

LOCK TABLES `rutina_ejercicios` WRITE;
/*!40000 ALTER TABLE `rutina_ejercicios` DISABLE KEYS */;
INSERT INTO `rutina_ejercicios` VALUES (1,1,1,3,10,'Diaria'),(2,1,2,3,10,'Diaria'),(3,2,2,3,10,'Diaria'),(6,3,4,3,10,'Diaria'),(7,3,3,3,10,'Diaria'),(10,5,12,3,10,'Diaria'),(11,5,14,3,10,'Diaria'),(12,6,37,3,10,'Diaria'),(13,7,41,3,10,'Diaria'),(14,7,40,3,10,'Diaria'),(18,9,39,3,10,'Diaria'),(19,9,38,3,10,'Diaria'),(20,9,37,3,10,'Diaria'),(25,11,5,3,10,'Diaria'),(26,11,6,3,10,'Diaria'),(27,11,7,3,10,'Diaria'),(28,12,5,3,10,'Diaria'),(29,12,6,3,10,'Diaria'),(30,12,7,3,10,'Diaria'),(31,13,12,3,10,'Diaria'),(32,13,14,3,10,'Diaria'),(33,13,11,3,10,'Diaria'),(34,14,10,3,10,'Diaria'),(35,14,14,3,10,'Diaria'),(36,14,13,3,10,'Diaria'),(37,15,14,3,10,'Diaria'),(38,15,10,3,10,'Diaria'),(39,15,13,3,10,'Diaria'),(40,16,27,3,10,'Diaria'),(41,16,26,3,10,'Diaria');
/*!40000 ALTER TABLE `rutina_ejercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rutinas`
--

DROP TABLE IF EXISTS `rutinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rutinas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `fisioterapeuta_id` int NOT NULL,
  `patologia_id` int DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `observaciones` text,
  `activa` tinyint(1) DEFAULT '1',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fase_recuperacion` varchar(50) DEFAULT NULL,
  `nivel_dolor` tinyint DEFAULT '0',
  `comorbilidades` json DEFAULT NULL,
  `nivel_actividad_fisica` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `paciente_id` (`paciente_id`),
  KEY `fisioterapeuta_id` (`fisioterapeuta_id`),
  CONSTRAINT `rutinas_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `rutinas_ibfk_2` FOREIGN KEY (`fisioterapeuta_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rutinas`
--

LOCK TABLES `rutinas` WRITE;
/*!40000 ALTER TABLE `rutinas` DISABLE KEYS */;
INSERT INTO `rutinas` VALUES (1,1,2,1,'2026-06-15','2026-06-20','Realizar lo ejercicio de manera correcta, con las indicaciones que se preescribieron. Adema ver el video cuantas veces desee.',0,'2026-06-16 00:32:33',NULL,0,NULL,NULL),(2,1,2,1,'2026-06-16','2026-06-17','sadasdasd',0,'2026-06-16 11:57:18',NULL,0,NULL,NULL),(3,2,2,1,'2026-06-16','2026-06-17','dfsfsdfsdfsdf',0,'2026-06-16 12:23:20',NULL,0,NULL,NULL),(5,10,2,4,'2026-06-18','2026-06-27','',0,'2026-06-18 13:29:48',NULL,0,NULL,NULL),(6,9,2,9,'2026-06-19','2026-06-26','',0,'2026-06-18 14:31:11',NULL,0,NULL,NULL),(7,9,2,9,'2026-06-27','2026-07-04','',0,'2026-06-18 14:37:17',NULL,0,NULL,NULL),(9,9,2,9,'2026-06-18','2026-06-25','',0,'2026-06-18 20:27:49','AGUDA',7,NULL,'SEDENTARIO'),(11,3,2,3,'2026-06-18','2026-06-26','',0,'2026-06-18 21:16:24','SUBAGUDA',3,'[]','ACTIVO'),(12,3,2,3,'2026-06-27','2026-06-30','',0,'2026-06-18 21:17:32','FORTALECIMIENTO',1,'[]','ACTIVO'),(13,4,2,4,'2026-06-18','2026-06-25','',0,'2026-06-18 22:30:56','AGUDA',4,'[]','MODERADAMENTE_ACTIVO'),(14,4,2,4,'2026-06-25','2026-07-02','',0,'2026-06-18 22:38:36','SUBAGUDA',2,'[]','MODERADAMENTE_ACTIVO'),(15,4,2,4,'2026-07-03','2026-07-10','',0,'2026-06-18 22:41:49','FORTALECIMIENTO',0,'[]','MODERADAMENTE_ACTIVO'),(16,4,13,7,'2026-06-18','2026-06-25','',0,'2026-06-18 22:46:08','AGUDA',7,'[]','DEPORTISTA');
/*!40000 ALTER TABLE `rutinas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` enum('ADMIN','FISIOTERAPEUTA','PACIENTE') NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Admin','Principal','admin@admin.com','$2b$10$aQMwd82Wp.kxkHu22P2/mOBs5h4WLYHHyEpPVmpZ/2nfOTlXRxFN.','ADMIN',1,'2026-06-15 23:51:59','2026-06-15 23:51:59'),(2,'Joel ','Pluas','FisioJoel@gmail.com','$2b$10$aQMwd82Wp.kxkHu22P2/mOBs5h4WLYHHyEpPVmpZ/2nfOTlXRxFN.','FISIOTERAPEUTA',1,'2026-06-15 23:51:59','2026-06-15 23:59:16'),(3,'Marcos','Pluas','PacienteMarcos@gmail.com','$2b$10$pLrb1C98uNxn/6OZRDQzluUeM6sfM8DTPK3AGMPFHVfwGFhyvc4G6','PACIENTE',1,'2026-06-16 00:01:23','2026-06-16 12:00:04'),(4,'Ariel','Armijos','pacienteAriel@gmail.com','$2b$10$lLMmJOeJg7R6kj0JUnu9cOSTb7vbGcR33iSjPgMzB5IB58M0x3XeO','PACIENTE',1,'2026-06-16 12:08:41','2026-06-16 12:08:41'),(5,'Maria','Lopez','Mariaregla1@gmail.com','$2b$10$D1WJ6tYfAzp/PEXK207GrO.SknUFdSorWpugR8/XbqSuKNPbCVrAi','PACIENTE',1,'2026-06-18 00:31:33','2026-06-18 01:32:20'),(6,'Carlos','Reyes','carlosregla2@gmail.com','$2b$10$FHW.cECa6PPdja4a6bhzXOY0zYMkJ60u9EnAfgLt0wAaldMg9YXfi','PACIENTE',1,'2026-06-18 00:51:01','2026-06-18 22:44:26'),(7,'Ana','Sanchez','anaregla3@gmail.com','$2b$10$EVfNR2NuqWqJFyYLr430v.yFiskrZ3gPcJfGSHfo5u0T/0cSWMNXC','PACIENTE',1,'2026-06-18 01:31:52','2026-06-18 01:31:52'),(8,'Pedro','Gomez','pedroregla4@gmail.com','$2b$10$oHz2RxipbDEhmKUHCjX4CuiJWzMhQGNZYQDXAJINukbkKmdjMGmly','PACIENTE',1,'2026-06-18 01:39:38','2026-06-18 01:39:38'),(9,'Laura','Torres','lauraregla5@gmail.com','$2b$10$MDUiNHIObOCB0mN83LwFLOopF15MiR6Vlg9uVZnL3p6kBovPKHIA.','PACIENTE',1,'2026-06-18 01:43:15','2026-06-18 01:43:15'),(10,'Roberto','Mendoza','Robertoregla6@gmail.com','$2b$10$Lx7y9Ct.rwSmktGAjJdU1eKxp4bpj3PE9GdUQDxiGISham5xLePWS','PACIENTE',1,'2026-06-18 01:46:52','2026-06-18 01:46:52'),(11,'Jose','Rivera','JoseForward@gmail.com','$2b$10$.P.N9dD3QrDoJ2g3AHYa9eEiR.3/8rEUsPrGjxCbIPA2IUIDEv62q','PACIENTE',1,'2026-06-18 01:51:35','2026-06-18 01:51:35'),(12,'Adriana','Tenempaguay','adrianaprueba@gmail.com','$2b$10$mo2KFBdrp/H7PYXjHO2MM.jHcz2Bm6jzQLjhZs46ZiVwN0Po8mq/G','PACIENTE',1,'2026-06-18 13:26:53','2026-06-18 13:26:53'),(13,'Sergio','Perez','SergioFisio@gmail.com','$2b$10$/fDg4nQX8SbId3N0Mf5Yz.MlTQfOUZr.BHXzaRHWGSC3xopO1gCMu','FISIOTERAPEUTA',1,'2026-06-18 22:44:18','2026-06-18 22:44:18'),(14,'Martha','Gonzalez','martha.gonzalez@test.com','\\.kxkHu22P2/mOBs5h4WLYHHyEpPVmpZ/2nfOTlXRxFN.','PACIENTE',1,'2026-06-22 22:32:02','2026-06-22 22:32:02'),(15,'Luis','Torres','luis.torres@test.com','\\.kxkHu22P2/mOBs5h4WLYHHyEpPVmpZ/2nfOTlXRxFN.','PACIENTE',1,'2026-06-22 22:32:02','2026-06-22 22:32:02'),(16,'Ana','Mendoza','ana.mendoza@test.com','\\.kxkHu22P2/mOBs5h4WLYHHyEpPVmpZ/2nfOTlXRxFN.','PACIENTE',1,'2026-06-22 22:32:02','2026-06-22 22:32:02'),(17,'Pedro','Salazar','pedro.salazar@test.com','\\.kxkHu22P2/mOBs5h4WLYHHyEpPVmpZ/2nfOTlXRxFN.','PACIENTE',1,'2026-06-22 22:32:02','2026-06-22 22:32:02'),(18,'Carmen','Vega','carmen.vega@test.com','\\.kxkHu22P2/mOBs5h4WLYHHyEpPVmpZ/2nfOTlXRxFN.','PACIENTE',1,'2026-06-22 22:32:02','2026-06-22 22:32:02'),(19,'Roberto','Flores','roberto.flores@test.com','\\.kxkHu22P2/mOBs5h4WLYHHyEpPVmpZ/2nfOTlXRxFN.','PACIENTE',1,'2026-06-22 22:32:02','2026-06-22 22:32:02'),(20,'Elena','Paredes','elena.paredes@test.com','\\.kxkHu22P2/mOBs5h4WLYHHyEpPVmpZ/2nfOTlXRxFN.','PACIENTE',1,'2026-06-22 22:32:02','2026-06-22 22:32:02'),(21,'Jackeline','Rios','Rios@gmail.com','$2b$10$naG13NQI.RiBSKXo6m3Ot.7neBJ1/2Qy.O9LretSjTRTk3/ugOa9a','PACIENTE',1,'2026-06-22 23:02:28','2026-06-22 23:02:28');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'rehabilitacion_db'
--

--
-- Dumping routines for database 'rehabilitacion_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-24 20:51:42
