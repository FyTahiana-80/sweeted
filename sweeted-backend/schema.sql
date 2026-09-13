-- ============================================================================
-- SCHÉMA DE BASE DE DONNÉES - SWEETED (ISPM)
-- MySQL / MariaDB (Encodage UTF8mb4)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `sweeted`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `sweeted`;

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 1. Table : Roles
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Roles`;
CREATE TABLE `Roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nom` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Roles` (`id`, `nom`) VALUES
  (1, 'Admin'),
  (2, 'Modérateur'),
  (3, 'Utilisateur')
ON DUPLICATE KEY UPDATE `nom` = VALUES(`nom`);

-- ----------------------------------------------------------------------------
-- 2. Table : Permissions
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Permissions`;
CREATE TABLE `Permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nom` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Permissions` (`id`, `nom`) VALUES
  (1, 'create_user'),
  (2, 'publish_official'),
  (3, 'update_post'),
  (4, 'delete_post')
ON DUPLICATE KEY UPDATE `nom` = VALUES(`nom`);

-- ----------------------------------------------------------------------------
-- 3. Table : Permission_de_role
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Permission_de_role`;
CREATE TABLE `Permission_de_role` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_role` INT NOT NULL,
  `id_permission` INT NOT NULL,
  CONSTRAINT `fk_pdr_role` FOREIGN KEY (`id_role`) REFERENCES `Roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pdr_permission` FOREIGN KEY (`id_permission`) REFERENCES `Permissions` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_role_permission` (`id_role`, `id_permission`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin a toutes les permissions
INSERT INTO `Permission_de_role` (`id_role`, `id_permission`) VALUES
  (1, 1), -- Admin : create_user
  (1, 2), -- Admin : publish_official
  (1, 3), -- Admin : update_post
  (1, 4), -- Admin : delete_post
  (2, 4)  -- Modérateur : delete_post
ON DUPLICATE KEY UPDATE `id_role` = VALUES(`id_role`);

-- ----------------------------------------------------------------------------
-- 4. Table : Users
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `matricule_number` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `display_name` VARCHAR(100) NULL,
  `avatar_url` VARCHAR(255) NULL,
  `bio` VARCHAR(280) NULL,
  `filiere` VARCHAR(100) NULL,
  `id_role` INT NOT NULL DEFAULT 3,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_users_role` FOREIGN KEY (`id_role`) REFERENCES `Roles` (`id`),
  INDEX `idx_users_matricule` (`matricule_number`),
  INDEX `idx_users_display_name` (`display_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Table : Posts
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Posts`;
CREATE TABLE `Posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `content` TEXT NULL,
  `image_url` VARCHAR(255) NULL,
  `id_user` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_posts_user` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  INDEX `idx_posts_user` (`id_user`),
  INDEX `idx_posts_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5b. Table : Post_images (plusieurs images par post étudiant)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Post_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_post` INT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `position` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_post_images_post` FOREIGN KEY (`id_post`) REFERENCES `Posts` (`id`) ON DELETE CASCADE,
  INDEX `idx_post_images_post` (`id_post`, `position`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. Table : Sweets (Likes / Réactions)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Sweets`;
CREATE TABLE `Sweets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_user` INT NOT NULL,
  `id_post` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sweets_user` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sweets_post` FOREIGN KEY (`id_post`) REFERENCES `Posts` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_user_post_sweet` (`id_user`, `id_post`),
  INDEX `idx_sweets_post` (`id_post`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. Table : Comments
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Comments`;
CREATE TABLE `Comments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_user` INT NOT NULL,
  `id_post` INT NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_comments_user` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comments_post` FOREIGN KEY (`id_post`) REFERENCES `Posts` (`id`) ON DELETE CASCADE,
  INDEX `idx_comments_post` (`id_post`),
  INDEX `idx_comments_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. Table : Officiel (Publications officielles de la direction)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Officiel`;
CREATE TABLE `Officiel` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_user` INT NOT NULL,
  `content` TEXT NULL,
  `image_url` VARCHAR(255) NULL,
  `is_pinned` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_officiel_user` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  INDEX `idx_officiel_pinned_created` (`is_pinned`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8b. Table : Officiel_images (plusieurs images par publication officielle)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Officiel_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_official` INT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `position` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_officiel_images_official` FOREIGN KEY (`id_official`) REFERENCES `Officiel` (`id`) ON DELETE CASCADE,
  INDEX `idx_officiel_images_official` (`id_official`, `position`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. Table : file (Documents PDF, images et fichiers de code Sweet Studio)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `file`;
CREATE TABLE `file` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `type` ENUM('file', 'image', 'code') NOT NULL DEFAULT 'file',
  `name` VARCHAR(255) NOT NULL,
  `path` VARCHAR(255) NULL,
  `content` LONGTEXT NULL,
  `language` VARCHAR(50) NULL,
  `size` INT NOT NULL DEFAULT 0,
  `visibility` ENUM('public', 'prive') NOT NULL DEFAULT 'prive',
  `download_count` INT NOT NULL DEFAULT 0,
  `id_user` INT NOT NULL,
  `id_post` INT NULL,
  `id_official_post` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_file_user` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_file_post` FOREIGN KEY (`id_post`) REFERENCES `Posts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_file_official` FOREIGN KEY (`id_official_post`) REFERENCES `Officiel` (`id`) ON DELETE SET NULL,
  INDEX `idx_file_user` (`id_user`),
  INDEX `idx_file_visibility` (`visibility`),
  INDEX `idx_file_post` (`id_post`),
  INDEX `idx_file_official` (`id_official_post`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. Table : Notification
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Notification`;
CREATE TABLE `Notification` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `type` VARCHAR(50) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `id_user` INT NOT NULL,
  `id_official_post` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_notif_official` FOREIGN KEY (`id_official_post`) REFERENCES `Officiel` (`id`) ON DELETE CASCADE,
  INDEX `idx_notif_user_read` (`id_user`, `is_read`),
  INDEX `idx_notif_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 11. Table : Suivre (Followers / Following)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Suivre`;
CREATE TABLE `Suivre` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_user_suiveur` INT NOT NULL,
  `id_user_suivi` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_suivre_suiveur` FOREIGN KEY (`id_user_suiveur`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_suivre_suivi` FOREIGN KEY (`id_user_suivi`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_suivre` (`id_user_suiveur`, `id_user_suivi`),
  INDEX `idx_suivre_suivi` (`id_user_suivi`),
  INDEX `idx_suivre_suiveur` (`id_user_suiveur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 12. Table : enregistrer (Bookmarks / Enregistrements de posts)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `enregistrer`;
CREATE TABLE `enregistrer` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_user` INT NOT NULL,
  `id_post` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_enregistrer_user` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_enregistrer_post` FOREIGN KEY (`id_post`) REFERENCES `Posts` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_user_post_enregistrer` (`id_user`, `id_post`),
  INDEX `idx_enregistrer_user` (`id_user`),
  INDEX `idx_enregistrer_post` (`id_post`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
