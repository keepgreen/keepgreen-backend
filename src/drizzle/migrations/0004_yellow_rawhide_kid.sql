CREATE TABLE `user-delete` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(256) NOT NULL,
	`key` varchar(30),
	`flag_valid_delete` int DEFAULT 0,
	`text` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `user-delete_id` PRIMARY KEY(`id`),
	CONSTRAINT `user-delete_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE INDEX `email_idx` ON `user-delete` (`email`);--> statement-breakpoint
ALTER TABLE `user-delete` ADD CONSTRAINT `user-delete_email_users_email_fk` FOREIGN KEY (`email`) REFERENCES `users`(`email`) ON DELETE no action ON UPDATE no action;