CREATE TABLE `spans` ( `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT , `name` TEXT NULL , `owner` TEXT NULL , `loc_a` INT(10) UNSIGNED NULL, `loc_b` INT(10) UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE = InnoDB;
ALTER TABLE `spans` ADD `status` BOOLEAN NOT NULL AFTER `loc_b`;
ALTER TABLE `spans` ADD CONSTRAINT `spans_to_node_loc_a` FOREIGN KEY (`loc_a`) REFERENCES `nodes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `spans` ADD CONSTRAINT `spans_to_node_loc_b` FOREIGN KEY (`loc_b`) REFERENCES `nodes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;