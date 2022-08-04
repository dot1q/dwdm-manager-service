ALTER TABLE `wavelengths_join_table` ADD `wavelength_span_id` INT(10) UNSIGNED NULL AFTER `wavelength_record_id`;
ALTER TABLE `wavelengths_join_table` ADD CONSTRAINT `wjt_to_s` FOREIGN KEY (`wavelength_span_id`) REFERENCES `spans`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
