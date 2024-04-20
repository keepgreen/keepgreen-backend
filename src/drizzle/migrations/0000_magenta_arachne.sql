CREATE TABLE `balances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`id_user` varchar(30) NOT NULL,
	`amount_in` decimal(19,2) DEFAULT '0',
	`amount_out` decimal(19,2) DEFAULT '0',
	`balance` decimal(19,2) DEFAULT '0',
	`description` varchar(256),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `balances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`tins_required` int DEFAULT 0,
	`flag_type` int DEFAULT 1,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `quests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quests_completed` (
	`id` int AUTO_INCREMENT NOT NULL,
	`id_user` varchar(30) NOT NULL,
	`id_quest` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `quests_completed_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(30) NOT NULL,
	`email` varchar(256),
	`password` varchar(256),
	`nickname` varchar(100),
	`firstName` varchar(50),
	`familyName` varchar(256),
	`referral` varchar(25),
	`role` varchar(15) NOT NULL DEFAULT 'customer',
	`level` int DEFAULT 1,
	`okto_hash` varchar(256),
	`photo_path` varchar(256),
	`wallet` varchar(256),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_referral_unique` UNIQUE(`referral`),
	CONSTRAINT `users_okto_hash_unique` UNIQUE(`okto_hash`),
	CONSTRAINT `users_wallet_unique` UNIQUE(`wallet`)
);
--> statement-breakpoint
ALTER TABLE `balances` ADD CONSTRAINT `balances_id_user_users_id_fk` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quests_completed` ADD CONSTRAINT `quests_completed_id_user_users_id_fk` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quests_completed` ADD CONSTRAINT `quests_completed_id_quest_quests_id_fk` FOREIGN KEY (`id_quest`) REFERENCES `quests`(`id`) ON DELETE no action ON UPDATE no action;