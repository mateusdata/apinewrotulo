CREATE TABLE `AlimentosRotulos` (
	`ID` int NOT NULL AUTO_INCREMENT,
	`NomeDoAlimento` varchar(255),
	`Rotulo` longtext,
	`DataDeAdicao` varchar(10),
	PRIMARY KEY (`ID`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_general_ci;
  
  