CREATE TABLE `adm` (
	`id` int NOT NULL AUTO_INCREMENT,
	`nome` varchar(100),
	`cpf` varchar(11),
	`senha` varchar(255),
	PRIMARY KEY (`id`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_general_ci;
  