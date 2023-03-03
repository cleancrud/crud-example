CREATE TABLE `all_type_table` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `t_int` tinyint NOT NULL COMMENT '小小整型',
  `s_int` smallint unsigned NOT NULL  COMMENT '小整数',
  `m_int` mediumint NOT NULL COMMENT '中整数',
  `b_int` bigint NOT NULL  COMMENT '大整数',
  `f32` float unsigned NOT NULL COMMENT '小浮点',
  `f64` double NOT NULL COMMENT '大浮点',
  `decimal_mysql` decimal(10,0) NOT NULL,
  `char_m` char(1) NOT NULL,
  `varchar_m` varchar(45) NOT NULL,
  `json_m` json NOT NULL,
  `nvarchar_m` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `nchar_m` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `time_m` time NOT NULL,
  `date_m` date NOT NULL,
  `data_time_m` datetime NOT NULL,
  `timestamp_m` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `timestamp_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `year_m` year NOT NULL COMMENT '年',
  `t_text` tinytext NOT NULL,
  `m_text` mediumtext NOT NULL,
  `text_m` text NOT NULL,
  `l_text` longtext NOT NULL,
  `binary_m` binary(10) DEFAULT NULL,
  `blob_m` blob,
  `l_blob` longblob,
  `m_blob` mediumblob,
  `t_blob` tinyblob,
  `bit_m` bit(20) NOT NULL DEFAULT b'0',
  `enum_m` enum('y','n') NOT NULL DEFAULT 'y',
  `set_m` set('a','b','c','d') NOT NULL DEFAULT 'a',
  `bool_m` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_ccc` (`b_int`,`char_m`),
  KEY `ix_ddd` (`m_int`,`varchar_m`,`timestamp_m`),
  KEY `uk_uuu` (`t_int`,`s_int`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 