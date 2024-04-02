CREATE TABLE `users` (
	`id` varchar(256) NOT NULL,
	`email` varchar(256),
	`password` varchar(256),
	`firstName` varchar(50),
	`familyName` varchar(256),
	`role` varchar(15) NOT NULL DEFAULT 'customer',
	`google_hash` varchar(256),
	`okto_hash` varchar(256),
	`photo_path` varchar(256),
	`wallet` varchar(256),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_google_hash_unique` UNIQUE(`google_hash`),
	CONSTRAINT `users_okto_hash_unique` UNIQUE(`okto_hash`),
	CONSTRAINT `users_wallet_unique` UNIQUE(`wallet`)
);
