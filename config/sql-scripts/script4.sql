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