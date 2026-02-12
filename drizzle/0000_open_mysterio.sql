CREATE TABLE `authors` (
	`id` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `authors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `book_authors` (
	`book_id` varchar(50) NOT NULL,
	`author_id` varchar(50) NOT NULL,
	CONSTRAINT `pk_book_authors` PRIMARY KEY(`book_id`,`author_id`)
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` varchar(50) NOT NULL,
	`id_google_books` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(255),
	`description` text,
	`published_year` year,
	`thumbnail_url` varchar(255),
	CONSTRAINT `books_id` PRIMARY KEY(`id`),
	CONSTRAINT `books_id_google_books_unique` UNIQUE(`id_google_books`)
);
--> statement-breakpoint
CREATE TABLE `borrowers` (
	`id` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`user_id` varchar(50) NOT NULL,
	CONSTRAINT `borrowers_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_borrower_user_phone` UNIQUE(`user_id`,`phone`)
);
--> statement-breakpoint
CREATE TABLE `loan_books` (
	`id` varchar(50) NOT NULL,
	`user_book_id` varchar(50) NOT NULL,
	`user_id` varchar(50) NOT NULL,
	`borrower_id` varchar(50) NOT NULL,
	`loan_started_at` date NOT NULL,
	`due_at` date NOT NULL,
	`returned_at` date,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`is_active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `loan_books_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_loan_active_user_book` UNIQUE(`user_book_id`,`is_active`)
);
--> statement-breakpoint
CREATE TABLE `user_books` (
	`id` varchar(50) NOT NULL,
	`book_id` varchar(50) NOT NULL,
	`user_id` varchar(50) NOT NULL,
	`book_status` enum('READ','UNREAD','READING','ABANDONED') NOT NULL DEFAULT 'UNREAD',
	`review` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_books_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_user_books_user_book` UNIQUE(`user_id`,`book_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(50) NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `book_authors` ADD CONSTRAINT `book_authors_book_id_books_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `book_authors` ADD CONSTRAINT `book_authors_author_id_authors_id_fk` FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `borrowers` ADD CONSTRAINT `borrowers_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loan_books` ADD CONSTRAINT `loan_books_user_book_id_user_books_id_fk` FOREIGN KEY (`user_book_id`) REFERENCES `user_books`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loan_books` ADD CONSTRAINT `loan_books_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loan_books` ADD CONSTRAINT `loan_books_borrower_id_borrowers_id_fk` FOREIGN KEY (`borrower_id`) REFERENCES `borrowers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_books` ADD CONSTRAINT `user_books_book_id_books_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_books` ADD CONSTRAINT `user_books_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_borrower_user` ON `borrowers` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_loan_user_active` ON `loan_books` (`user_id`,`is_active`);--> statement-breakpoint
CREATE INDEX `idx_loan_borrower_active` ON `loan_books` (`borrower_id`,`is_active`);--> statement-breakpoint
CREATE INDEX `idx_loan_userbook` ON `loan_books` (`user_book_id`);