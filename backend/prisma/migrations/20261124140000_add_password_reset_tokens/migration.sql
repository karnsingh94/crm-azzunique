CREATE TABLE `password_reset_tokens` (
  `token_hash` CHAR(64) NOT NULL,
  `email` VARCHAR(180) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `user_type` VARCHAR(40) NOT NULL,
  `expires_at` DATETIME(3) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`token_hash`),
  INDEX `password_reset_tokens_email_idx` (`email`),
  INDEX `password_reset_tokens_expires_at_idx` (`expires_at`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
