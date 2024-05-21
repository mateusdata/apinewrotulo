CREATE TABLE `adm` (
	`id` int NOT NULL AUTO_INCREMENT,
	`nome` varchar(100),
	`cpf` varchar(11) UNIQUE,
	`senha` varchar(255),
	PRIMARY KEY (`id`)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `categorias` (
	`id` int NOT NULL AUTO_INCREMENT,
	`nome_categoria` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_general_ci;

  CREATE TABLE `ingredientes` (
	`id` int NOT NULL AUTO_INCREMENT,
	`nome_pt` varchar(255),
	`nome_us` varchar(255),
	`nome_latim` varchar(255),
	`funcao_principal` text,
	`origin` text,
	`adm_criador` varchar(255),
	`data_criacao` varchar(255),
	`categoria_id` int,
	PRIMARY KEY (`id`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_general_ci;