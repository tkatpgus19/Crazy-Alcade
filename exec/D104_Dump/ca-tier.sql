USE ca;

INSERT INTO `tier` (`value`, `success_exp`, `normal_fail_exp`, `item_fail_exp`, `retry_exp`)
VALUE("BRONZE", 100, 10, 5, 10);

INSERT INTO `tier` (`value`, `success_exp`, `normal_fail_exp`, `item_fail_exp`, `retry_exp`)
VALUE("SILVER", 200, 20, 5, 50);

INSERT INTO `tier` (`value`, `success_exp`, `normal_fail_exp`, `item_fail_exp`, `retry_exp`)
VALUE("GOLD", 400, 50, 5, 100);