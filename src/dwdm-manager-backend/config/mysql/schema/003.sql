CREATE TABLE `wavelengths` ( `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT , `customer` TEXT NULL , `circuit_id` TEXT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
ALTER TABLE `wavelengths` ADD `status` BOOLEAN NOT NULL AFTER `circuit_id`;
CREATE TABLE `wavelengths_join_table` ( `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT , `channel` INT(10) UNSIGNED NULL, `wavelength_record_id` INT(10) UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE = InnoDB;
ALTER TABLE `wavelengths_join_table` ADD CONSTRAINT `wjt_to_w` FOREIGN KEY (`wavelength_record_id`) REFERENCES `wavelengths`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
