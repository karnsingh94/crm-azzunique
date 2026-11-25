/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.10-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: crm_azz_crm
-- ------------------------------------------------------
-- Server version	10.11.10-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Admin_module_access`
--

DROP TABLE IF EXISTS `Admin_module_access`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Admin_module_access` (
  `admin_id` char(36) NOT NULL,
  `service_id` char(36) NOT NULL,
  `module_id` char(36) NOT NULL,
  `access_mode` enum('FULL','CUSTOM') NOT NULL DEFAULT 'FULL',
  `is_allowed` tinyint(1) NOT NULL DEFAULT 1,
  `assigned_by` char(36) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`admin_id`,`service_id`,`module_id`),
  KEY `Admin_module_access_service_id_fkey` (`service_id`),
  KEY `Admin_module_access_module_id_fkey` (`module_id`),
  CONSTRAINT `Admin_module_access_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Admin_module_access_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Admin_module_access_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admin_module_access`
--

LOCK TABLES `Admin_module_access` WRITE;
/*!40000 ALTER TABLE `Admin_module_access` DISABLE KEYS */;
INSERT INTO `Admin_module_access` VALUES
('09bd48e0-a681-4d47-99da-6dbd5da94ad2','e9583ad0-e027-4486-9184-b4e4f2957d6b','05f15069-6d81-454a-990a-ab053561c903','FULL',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 04:16:15.177','2026-11-23 04:16:15.177'),
('09bd48e0-a681-4d47-99da-6dbd5da94ad2','e9583ad0-e027-4486-9184-b4e4f2957d6b','8db737b2-ee72-4be9-9f88-8392f0bd4aae','FULL',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 04:16:15.185','2026-11-23 04:16:15.185'),
('09bd48e0-a681-4d47-99da-6dbd5da94ad2','e9583ad0-e027-4486-9184-b4e4f2957d6b','b04d298f-73a4-49a3-82f1-92d82b019f82','FULL',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 04:16:15.201','2026-11-23 04:16:15.201'),
('15ed5a67-a6ad-41ca-ac02-b98abdd4f642','e9583ad0-e027-4486-9184-b4e4f2957d6b','b04d298f-73a4-49a3-82f1-92d82b019f82','FULL',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 06:54:22.441','2026-11-23 06:54:22.441');
/*!40000 ALTER TABLE `Admin_module_access` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Admin_service_access`
--

DROP TABLE IF EXISTS `Admin_service_access`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Admin_service_access` (
  `admin_id` char(36) NOT NULL,
  `service_id` char(36) NOT NULL,
  `access_mode` enum('FULL','CUSTOM') NOT NULL DEFAULT 'CUSTOM',
  `is_full_service` tinyint(1) NOT NULL DEFAULT 0,
  `is_allowed` tinyint(1) NOT NULL DEFAULT 1,
  `assigned_by` char(36) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`admin_id`,`service_id`),
  KEY `Admin_service_access_service_id_fkey` (`service_id`),
  CONSTRAINT `Admin_service_access_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Admin_service_access_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admin_service_access`
--

LOCK TABLES `Admin_service_access` WRITE;
/*!40000 ALTER TABLE `Admin_service_access` DISABLE KEYS */;
INSERT INTO `Admin_service_access` VALUES
('09bd48e0-a681-4d47-99da-6dbd5da94ad2','e9583ad0-e027-4486-9184-b4e4f2957d6b','FULL',1,1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 04:16:15.175','2026-11-23 04:16:15.175'),
('15ed5a67-a6ad-41ca-ac02-b98abdd4f642','e9583ad0-e027-4486-9184-b4e4f2957d6b','CUSTOM',0,1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 06:54:22.439','2026-11-23 06:54:22.439');
/*!40000 ALTER TABLE `Admin_service_access` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Admin_sub_module_access`
--

DROP TABLE IF EXISTS `Admin_sub_module_access`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Admin_sub_module_access` (
  `admin_id` char(36) NOT NULL,
  `service_id` char(36) NOT NULL,
  `module_id` char(36) NOT NULL,
  `sub_module_id` char(36) NOT NULL,
  `is_allowed` tinyint(1) NOT NULL DEFAULT 1,
  `assigned_by` char(36) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`admin_id`,`service_id`,`module_id`,`sub_module_id`),
  KEY `Admin_sub_module_access_service_id_fkey` (`service_id`),
  KEY `Admin_sub_module_access_module_id_fkey` (`module_id`),
  KEY `Admin_sub_module_access_sub_module_id_fkey` (`sub_module_id`),
  CONSTRAINT `Admin_sub_module_access_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Admin_sub_module_access_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Admin_sub_module_access_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Admin_sub_module_access_sub_module_id_fkey` FOREIGN KEY (`sub_module_id`) REFERENCES `sub_modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admin_sub_module_access`
--

LOCK TABLES `Admin_sub_module_access` WRITE;
/*!40000 ALTER TABLE `Admin_sub_module_access` DISABLE KEYS */;
INSERT INTO `Admin_sub_module_access` VALUES
('09bd48e0-a681-4d47-99da-6dbd5da94ad2','e9583ad0-e027-4486-9184-b4e4f2957d6b','05f15069-6d81-454a-990a-ab053561c903','28c9c733-1c1c-46f7-9b68-83d78c117fb5',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 04:16:15.180','2026-11-23 04:16:15.180'),
('09bd48e0-a681-4d47-99da-6dbd5da94ad2','e9583ad0-e027-4486-9184-b4e4f2957d6b','05f15069-6d81-454a-990a-ab053561c903','654cea1d-1ec2-4c25-82b4-8edbdcdc539b',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 04:16:15.184','2026-11-23 04:16:15.184'),
('09bd48e0-a681-4d47-99da-6dbd5da94ad2','e9583ad0-e027-4486-9184-b4e4f2957d6b','05f15069-6d81-454a-990a-ab053561c903','ece15a8b-885d-454e-a65a-cf26eec4b171',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 04:16:15.184','2026-11-23 04:16:15.184'),
('09bd48e0-a681-4d47-99da-6dbd5da94ad2','e9583ad0-e027-4486-9184-b4e4f2957d6b','8db737b2-ee72-4be9-9f88-8392f0bd4aae','19361fd5-8ef7-4f3c-8efd-79ce236081d7',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 04:16:15.186','2026-11-23 04:16:15.186'),
('09bd48e0-a681-4d47-99da-6dbd5da94ad2','e9583ad0-e027-4486-9184-b4e4f2957d6b','8db737b2-ee72-4be9-9f88-8392f0bd4aae','348e3d8e-b2a6-43ad-9bf4-2271e65623fe',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 04:16:15.197','2026-11-23 04:16:15.197'),
('09bd48e0-a681-4d47-99da-6dbd5da94ad2','e9583ad0-e027-4486-9184-b4e4f2957d6b','8db737b2-ee72-4be9-9f88-8392f0bd4aae','a38e7ebe-8e1f-4071-af92-8a41bb80b2d1',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 04:16:15.197','2026-11-23 04:16:15.197'),
('09bd48e0-a681-4d47-99da-6dbd5da94ad2','e9583ad0-e027-4486-9184-b4e4f2957d6b','8db737b2-ee72-4be9-9f88-8392f0bd4aae','a3d5757c-8c39-42bf-a3a3-40686bf9b369',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 04:16:15.198','2026-11-23 04:16:15.198'),
('09bd48e0-a681-4d47-99da-6dbd5da94ad2','e9583ad0-e027-4486-9184-b4e4f2957d6b','b04d298f-73a4-49a3-82f1-92d82b019f82','0c0ba6e6-65c0-4ad1-adaa-8ed08e2f45f9',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 04:16:15.202','2026-11-23 04:16:15.202'),
('09bd48e0-a681-4d47-99da-6dbd5da94ad2','e9583ad0-e027-4486-9184-b4e4f2957d6b','b04d298f-73a4-49a3-82f1-92d82b019f82','2a368796-19a0-4ea6-8adb-9a63825e2b70',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 04:16:15.202','2026-11-23 04:16:15.202'),
('09bd48e0-a681-4d47-99da-6dbd5da94ad2','e9583ad0-e027-4486-9184-b4e4f2957d6b','b04d298f-73a4-49a3-82f1-92d82b019f82','dbe7329e-de52-46a4-b713-f85f3f21335a',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 04:16:15.202','2026-11-23 04:16:15.202'),
('09bd48e0-a681-4d47-99da-6dbd5da94ad2','e9583ad0-e027-4486-9184-b4e4f2957d6b','b04d298f-73a4-49a3-82f1-92d82b019f82','ed8ec3c2-50ac-411b-bd6e-6ff8d2810d2f',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 04:16:15.203','2026-11-23 04:16:15.203'),
('15ed5a67-a6ad-41ca-ac02-b98abdd4f642','e9583ad0-e027-4486-9184-b4e4f2957d6b','b04d298f-73a4-49a3-82f1-92d82b019f82','0c0ba6e6-65c0-4ad1-adaa-8ed08e2f45f9',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 06:54:22.443','2026-11-23 06:54:22.443'),
('15ed5a67-a6ad-41ca-ac02-b98abdd4f642','e9583ad0-e027-4486-9184-b4e4f2957d6b','b04d298f-73a4-49a3-82f1-92d82b019f82','2a368796-19a0-4ea6-8adb-9a63825e2b70',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 06:54:22.446','2026-11-23 06:54:22.446'),
('15ed5a67-a6ad-41ca-ac02-b98abdd4f642','e9583ad0-e027-4486-9184-b4e4f2957d6b','b04d298f-73a4-49a3-82f1-92d82b019f82','dbe7329e-de52-46a4-b713-f85f3f21335a',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 06:54:22.447','2026-11-23 06:54:22.447'),
('15ed5a67-a6ad-41ca-ac02-b98abdd4f642','e9583ad0-e027-4486-9184-b4e4f2957d6b','b04d298f-73a4-49a3-82f1-92d82b019f82','ed8ec3c2-50ac-411b-bd6e-6ff8d2810d2f',1,'9d121c09-aa56-4e63-b609-1ab9f9a11166','2026-11-23 06:54:22.449','2026-11-23 06:54:22.449');
/*!40000 ALTER TABLE `Admin_sub_module_access` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Admins`
--

DROP TABLE IF EXISTS `Admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Admins` (
  `id` char(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(180) NOT NULL,
  `mobile` varchar(30) DEFAULT NULL,
  `organization_name` varchar(180) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `theme_color` varchar(30) DEFAULT '#7f22fe',
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `subscription_end_date` datetime(3) DEFAULT NULL,
  `subscription_plan_id` char(36) DEFAULT NULL,
  `subscription_start_date` datetime(3) DEFAULT NULL,
  `subscription_status` varchar(30) DEFAULT 'TRIAL',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Admins_email_key` (`email`),
  KEY `Admins_created_by_fkey` (`created_by`),
  KEY `Admins_subscription_plan_id_fkey` (`subscription_plan_id`),
  CONSTRAINT `Admins_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `super_admins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Admins_subscription_plan_id_fkey` FOREIGN KEY (`subscription_plan_id`) REFERENCES `subscription_plans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admins`
--

LOCK TABLES `Admins` WRITE;
/*!40000 ALTER TABLE `Admins` DISABLE KEYS */;
INSERT INTO `Admins` VALUES
('09bd48e0-a681-4d47-99da-6dbd5da94ad2','alok','alok@gmail.com','8765432190','au hub','$2b$10$IIAwX7oKeqSZq4UTMUpN..lUpsPGVraB4mwDHVH1Yx1n6clgVUI.6','ACTIVE','#7f22fe',NULL,'2026-11-23 04:16:15.139','2026-11-24 10:24:49.376',NULL,'2026-12-24 00:00:00.000','91c3025d-61c8-42cf-a1ee-ef61ae6cdd35','2026-11-24 00:00:00.000','ACTIVE'),
('15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh','karn@gmail.com','9876541232','artfect','$2b$10$yyK5tSzJd0BW4BNEbjScm.HP1UCaYkvYhsEq7xECnzMprezVNfAEu','ACTIVE','#7f22fe',NULL,'2026-11-20 05:23:15.007','2026-11-21 11:06:31.459',NULL,'2027-11-21 11:06:31.454','5e565c4d-cf3f-4982-8477-b5c6c390ba33','2026-11-21 11:06:31.454','ACTIVE');
/*!40000 ALTER TABLE `Admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approval_decisions`
--

DROP TABLE IF EXISTS `approval_decisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `approval_decisions` (
  `id` char(36) NOT NULL,
  `request_id` char(36) NOT NULL,
  `approver_id` char(36) NOT NULL,
  `approver_name` varchar(180) NOT NULL,
  `approver_role` varchar(60) NOT NULL,
  `level` int(11) NOT NULL DEFAULT 1,
  `decision` enum('APPROVED','REJECTED') NOT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `approval_decisions_request_id_created_at_idx` (`request_id`,`created_at`),
  CONSTRAINT `approval_decisions_request_id_fkey` FOREIGN KEY (`request_id`) REFERENCES `approval_requests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_decisions`
--

LOCK TABLES `approval_decisions` WRITE;
/*!40000 ALTER TABLE `approval_decisions` DISABLE KEYS */;
/*!40000 ALTER TABLE `approval_decisions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approval_requests`
--

DROP TABLE IF EXISTS `approval_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `approval_requests` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `entity_type` varchar(60) NOT NULL,
  `entity_id` char(36) NOT NULL,
  `document_version_id` char(36) DEFAULT NULL,
  `created_by_id` char(36) NOT NULL,
  `created_by_name` varchar(180) NOT NULL,
  `current_approver_role` varchar(60) DEFAULT NULL,
  `current_approver_id` char(36) DEFAULT NULL,
  `approval_level` int(11) NOT NULL DEFAULT 1,
  `max_levels` int(11) NOT NULL DEFAULT 1,
  `status` enum('PENDING','APPROVED','REJECTED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `title` varchar(200) NOT NULL,
  `summary` text DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `approval_requests_company_id_status_idx` (`company_id`,`status`),
  KEY `approval_requests_company_id_entity_type_entity_id_idx` (`company_id`,`entity_type`,`entity_id`),
  CONSTRAINT `approval_requests_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_requests`
--

LOCK TABLES `approval_requests` WRITE;
/*!40000 ALTER TABLE `approval_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `approval_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attachments`
--

DROP TABLE IF EXISTS `attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attachments` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `entity_type` varchar(60) NOT NULL,
  `entity_id` char(36) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `stored_name` varchar(255) NOT NULL,
  `storage_provider` varchar(30) NOT NULL DEFAULT 'local',
  `storage_key` varchar(500) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `file_size` int(11) NOT NULL,
  `file_checksum` char(64) NOT NULL,
  `uploaded_by_id` char(36) NOT NULL,
  `uploaded_by_name` varchar(180) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `attachments_company_id_entity_type_entity_id_idx` (`company_id`,`entity_type`,`entity_id`),
  CONSTRAINT `attachments_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audit_logs` (
  `id` char(36) NOT NULL,
  `company_id` char(36) DEFAULT NULL,
  `actor_id` char(36) DEFAULT NULL,
  `user_id` char(36) DEFAULT NULL,
  `user_name` varchar(180) DEFAULT NULL,
  `service_code` varchar(60) DEFAULT NULL,
  `module_code` varchar(60) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `entity_id` char(36) DEFAULT NULL,
  `old_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL,
  `before_state` text DEFAULT NULL,
  `after_state` text DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `ip_address` varchar(64) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `audit_logs_company_id_created_at_idx` (`company_id`,`created_at`),
  KEY `audit_logs_entity_type_entity_id_idx` (`entity_type`,`entity_id`),
  KEY `audit_logs_actor_id_fkey` (`actor_id`),
  CONSTRAINT `audit_logs_actor_id_fkey` FOREIGN KEY (`actor_id`) REFERENCES `super_admins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `audit_logs_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES
('081b5bd7-e600-496e-80e2-39d653596d11','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','c5f9ebef-d076-4a23-a2e3-72a48eed6444',NULL,NULL,NULL,'{\"id\":\"c5f9ebef-d076-4a23-a2e3-72a48eed6444\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:02.961'),
('0f787a41-750c-463e-97ed-e22cf83d367c','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','05b35995-77f4-4398-8576-7bb4e73fa9b9',NULL,NULL,NULL,'{\"id\":\"05b35995-77f4-4398-8576-7bb4e73fa9b9\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Website Inquiry\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:28.079'),
('17a34706-a89d-4a57-8d9f-1f432137d1ee','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','fd2aef73-b0a8-4be4-b55d-58244fb2aee5',NULL,NULL,NULL,'{\"id\":\"fd2aef73-b0a8-4be4-b55d-58244fb2aee5\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:14.313'),
('1acf693e-9ba9-461f-b3a4-946f81c230fe','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'company-user','User',NULL,NULL,'DELETE_CUSTOMER','CUSTOMER','fd2e32ab-d1c3-4ab6-bb41-c53fb2b7c38e',NULL,NULL,'{\"id\":\"fd2e32ab-d1c3-4ab6-bb41-c53fb2b7c38e\",\"companyId\":\"15ed5a67-a6ad-41ca-ac02-b98abdd4f642\",\"companyName\":\"amazon\",\"customerCode\":\"CUST-3409\",\"gstin\":null,\"pan\":null,\"contactPerson\":\"vikas\",\"email\":\"vikas@gmial.com\",\"phone\":\"8765432190\",\"industry\":\"Retail & E-commerce\",\"customerCategory\":\"DOMESTIC\",\"billingAddress\":null,\"shippingAddress\":null,\"city\":null,\"state\":null,\"pincode\":null,\"creditLimit\":\"{\\\"s\\\":1,\\\"e\\\":0,\\\"d\\\":\\\"[0]\\\"}\",\"paymentTerms\":\"30% Advance, 70% against BL/Delivery\",\"requirements\":\"50 unit phones\",\"assignedTo\":null,\"reorderCycleDays\":30,\"lastOrderDate\":null,\"expectedReorderDate\":null,\"reorderReminderStatus\":\"PENDING\",\"status\":\"ACTIVE\",\"createdAt\":\"{}\",\"updatedAt\":\"{}\"}',NULL,'Deleted customer record: amazon','127.0.0.1','System / API','2026-11-21 06:49:03.750'),
('1b2a490a-b721-4b59-8960-02583921924b','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','0a50be73-7f8f-41d3-a3c1-1ab544aa879d',NULL,NULL,NULL,'{\"id\":\"0a50be73-7f8f-41d3-a3c1-1ab544aa879d\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Website Inquiry\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:27.608'),
('1c4f6b5d-f10e-4f68-b643-0875a1b1e3bb','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','5bc52ab9-1e65-4e51-aa8a-283cb3d4c57b',NULL,NULL,NULL,'{\"id\":\"5bc52ab9-1e65-4e51-aa8a-283cb3d4c57b\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 09:49:07.349'),
('2a06aff3-f460-4e34-8889-c4454d751870',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'LOGIN','SUPER_ADMIN','9d121c09-aa56-4e63-b609-1ab9f9a11166',NULL,NULL,NULL,NULL,'Super Admin \"Platform Super Admin\" authenticated via Unified Login','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-21 08:24:43.684'),
('2c12321d-8b0a-446b-a28a-a22e5cde233d','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','1c858c6a-9d4b-4a29-9343-7568a0771853',NULL,NULL,NULL,'{\"id\":\"1c858c6a-9d4b-4a29-9343-7568a0771853\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:14.159'),
('2de2386d-d9b4-4754-90bd-7f84a83d621e',NULL,NULL,NULL,NULL,NULL,NULL,'CREATE','CLIENT_ADMIN','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'{\"organization\":\"artfect\",\"email\":\"karn@gmail.com\",\"status\":\"ACTIVE\",\"themeColor\":\"#7f22fe\"}',NULL,NULL,'Provisioned client panel for \"artfect\" with theme #7f22fe','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-20 05:23:15.059'),
('2f1f1670-8be0-4819-a944-5d1132000c46',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'SWITCH_TO_CLIENT_PANEL','CLIENT_ADMIN','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,NULL,NULL,NULL,'Super Admin switched into panel of \"artfect\" (karn singh)','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-23 04:56:11.418'),
('3099014e-0392-45c2-87a4-8e2861e121f2','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','b7c8511f-3427-4444-86f7-646894312350',NULL,NULL,NULL,'{\"id\":\"b7c8511f-3427-4444-86f7-646894312350\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:14.792'),
('316ff3d5-3b2f-47d8-b09b-3b43a84925cd','09bd48e0-a681-4d47-99da-6dbd5da94ad2',NULL,'09bd48e0-a681-4d47-99da-6dbd5da94ad2','alok',NULL,NULL,'CONVERT_LEAD','LEAD','2679d99c-ad28-4266-b2bd-5598adaafcff',NULL,NULL,NULL,'{\"leadId\":\"2679d99c-ad28-4266-b2bd-5598adaafcff\",\"customerId\":\"22b405d2-ad65-4dae-a0f7-edff884ba8e4\",\"status\":\"WON\"}','Converted lead into customer karn and marked Deal as WON','127.0.0.1','System / API','2026-11-24 11:14:07.633'),
('3470fa7e-6ece-464a-a3f4-8bcadfb68b3e','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CONVERT_LEAD','LEAD','5bc52ab9-1e65-4e51-aa8a-283cb3d4c57b',NULL,NULL,NULL,'{\"leadId\":\"5bc52ab9-1e65-4e51-aa8a-283cb3d4c57b\",\"customerId\":\"f679349e-7c2a-41d8-a2b0-9c6cf95c1f8b\",\"status\":\"WON\"}','Converted lead into customer artfect studio and marked Deal as WON','127.0.0.1','System / API','2026-11-21 10:06:39.818'),
('369c931a-b2f0-44eb-920b-451e22c7fe30',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'LOGIN','SUPER_ADMIN','9d121c09-aa56-4e63-b609-1ab9f9a11166',NULL,NULL,NULL,NULL,'Super Admin \"Platform Super Admin\" authenticated via Unified Login','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-20 05:22:04.733'),
('39550ddd-8923-49a3-b44b-6477d8288e53','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'company-user','User',NULL,NULL,'DELETE_CONTACT','CONTACT','d134f0aa-2708-4fe6-a1bf-8d07a44de26f',NULL,NULL,'{\"id\":\"d134f0aa-2708-4fe6-a1bf-8d07a44de26f\",\"companyId\":\"15ed5a67-a6ad-41ca-ac02-b98abdd4f642\",\"customerId\":null,\"name\":\"vikas\",\"companyName\":\"amazon\",\"role\":\"Primary Account Contact\",\"designation\":\"Primary Account Contact\",\"department\":null,\"stakeholderType\":\"COMMERCIAL\",\"isPrimary\":false,\"isDecisionMaker\":false,\"communicationPreference\":\"EMAIL\",\"email\":\"vikas@gmial.com\",\"phone\":\"8765432190\",\"channel\":\"WhatsApp\",\"createdAt\":\"{}\",\"updatedAt\":\"{}\"}',NULL,'Deleted contact person: vikas','127.0.0.1','System / API','2026-11-21 06:49:12.217'),
('3c958b3e-e4b4-47fd-957a-c4d25abd1d48',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'SWITCH_TO_CLIENT_PANEL','CLIENT_ADMIN','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,NULL,NULL,NULL,'Super Admin switched into panel of \"artfect\" (karn singh)','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-24 08:09:45.088'),
('3e5d9e12-6668-483a-9c68-e530b9fcc3d4',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'SWITCH_TO_CLIENT_PANEL','CLIENT_ADMIN','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,NULL,NULL,NULL,'Super Admin switched into panel of \"artfect\" (karn singh)','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-23 06:54:02.871'),
('4c99d531-a326-4fce-8222-8644c570bd5c','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','fa7a33ab-9828-42c8-b747-f8858c72ace9',NULL,NULL,NULL,'{\"id\":\"fa7a33ab-9828-42c8-b747-f8858c72ace9\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Website Inquiry\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:28.563'),
('4de3c7d2-4a38-4043-9789-febe42570627','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','95747f52-e739-405c-bb64-b2d01a537bc4',NULL,NULL,NULL,'{\"id\":\"95747f52-e739-405c-bb64-b2d01a537bc4\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:50:51.030'),
('4f6c604a-e65b-4fcb-8400-89ba5edf158f','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CONVERT_LEAD','LEAD','5d217ff8-74b1-44c7-aa13-0111481ef061',NULL,NULL,NULL,'{\"leadId\":\"5d217ff8-74b1-44c7-aa13-0111481ef061\",\"customerId\":\"fd2e32ab-d1c3-4ab6-bb41-c53fb2b7c38e\",\"status\":\"WON\"}','Converted lead into customer amazon','127.0.0.1','System / API','2026-11-21 04:45:33.569'),
('521b14d5-df29-45c3-844e-3b0ae654da48','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'company-user','User',NULL,NULL,'CREATE_CONTACT','CONTACT','d134f0aa-2708-4fe6-a1bf-8d07a44de26f',NULL,NULL,NULL,'{\"id\":\"d134f0aa-2708-4fe6-a1bf-8d07a44de26f\",\"name\":\"vikas\",\"customerId\":null}','Created contact person record','127.0.0.1','System / API','2026-11-21 04:45:57.265'),
('55bd4e4b-7e2c-4dff-9f8f-77d6f2fa50ec','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','54674a49-e1d0-486c-a789-700638bc2068',NULL,NULL,NULL,'{\"id\":\"54674a49-e1d0-486c-a789-700638bc2068\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:19.562'),
('5ec0e15a-86e8-46f4-b9d6-1e914aaec896','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','51c896fe-a9cd-4004-9885-706474a901b9',NULL,NULL,NULL,'{\"id\":\"51c896fe-a9cd-4004-9885-706474a901b9\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:19.245'),
('616c30ba-df43-4090-a199-a23f75df538e',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'SWITCH_TO_CLIENT_PANEL','CLIENT_ADMIN','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,NULL,NULL,NULL,'Super Admin switched into panel of \"artfect\" (karn singh)','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-24 11:09:16.936'),
('636e7323-040d-416b-9542-4fd757c25688','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','5d217ff8-74b1-44c7-aa13-0111481ef061',NULL,NULL,NULL,'{\"id\":\"5d217ff8-74b1-44c7-aa13-0111481ef061\",\"name\":\"vikas\",\"email\":\"vikas@gmial.com\",\"source\":\"Website Inquiry\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-20 05:25:04.644'),
('6688b392-f106-4970-8a5d-aba251c5e2ac',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'LOGIN','SUPER_ADMIN','9d121c09-aa56-4e63-b609-1ab9f9a11166',NULL,NULL,NULL,NULL,'Super Admin \"Platform Super Admin\" authenticated via Unified Login','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-23 04:02:11.386'),
('67631ee2-cfc4-44c6-9a9c-4a5323590eca','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','6a52c5dd-0dd7-4f29-a973-b7a684107ba2',NULL,NULL,NULL,'{\"id\":\"6a52c5dd-0dd7-4f29-a973-b7a684107ba2\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:13.148'),
('6791194f-a18d-49dc-b1e0-d16109d37a82','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','19f6250a-bede-42cc-9245-5aad1fcca732',NULL,NULL,NULL,'{\"id\":\"19f6250a-bede-42cc-9245-5aad1fcca732\",\"name\":\"alok\",\"email\":\"alok@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-23 06:58:54.208'),
('6833134b-5949-499f-86d9-21a8dd8fb1d5','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','26e5c34a-b694-4519-b36a-f6dec4a658c2',NULL,NULL,NULL,'{\"id\":\"26e5c34a-b694-4519-b36a-f6dec4a658c2\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:18.962'),
('717457ed-7641-4071-8aa8-0c9e1ae63ed1','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'company-user','User',NULL,NULL,'DELETE_CONTACT','CONTACT','1d040d61-d4d0-4dc2-ac50-ea2e63eb7d21',NULL,NULL,'{\"id\":\"1d040d61-d4d0-4dc2-ac50-ea2e63eb7d21\",\"companyId\":\"15ed5a67-a6ad-41ca-ac02-b98abdd4f642\",\"customerId\":null,\"name\":\"vikas\",\"companyName\":\"amazon\",\"role\":\"Primary Contact\",\"designation\":\"Key Stakeholder\",\"department\":null,\"stakeholderType\":\"COMMERCIAL\",\"isPrimary\":true,\"isDecisionMaker\":true,\"communicationPreference\":\"EMAIL\",\"email\":\"vikas@gmial.com\",\"phone\":\"8765432190\",\"channel\":\"Email\",\"createdAt\":\"{}\",\"updatedAt\":\"{}\"}',NULL,'Deleted contact person: vikas','127.0.0.1','System / API','2026-11-21 06:49:09.067'),
('759d2883-d188-4480-a58b-b3d778f96827','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','911bfe34-05e0-4f3a-b2cf-65c025443bf5',NULL,NULL,NULL,'{\"id\":\"911bfe34-05e0-4f3a-b2cf-65c025443bf5\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:18.777'),
('7be2a745-3218-465c-b56f-678550fc2e34',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'SWITCH_TO_CLIENT_PANEL','CLIENT_ADMIN','09bd48e0-a681-4d47-99da-6dbd5da94ad2',NULL,NULL,NULL,NULL,'Super Admin switched into panel of \"au hub\" (alok)','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-24 10:24:59.294'),
('7c3e219f-742f-4481-ba64-209cb471ee7c','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CONVERT_LEAD','LEAD','19f6250a-bede-42cc-9245-5aad1fcca732',NULL,NULL,NULL,'{\"leadId\":\"19f6250a-bede-42cc-9245-5aad1fcca732\",\"customerId\":\"9bee42d0-38bf-4b7b-97fa-bbfe4d6e0b98\",\"status\":\"WON\"}','Converted lead into customer cu hub and marked Deal as WON','127.0.0.1','System / API','2026-11-23 06:59:54.899'),
('7d2f7972-5157-4536-af54-5ecdf3ee0e74',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'SWITCH_TO_CLIENT_PANEL','CLIENT_ADMIN','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,NULL,NULL,NULL,'Super Admin switched into panel of \"artfect\" (karn singh)','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-20 05:23:27.698'),
('822c3929-941a-4958-952a-1f66cec619a1','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','d3d258ce-ba2c-4bda-b5fe-2dceb1f61b0d',NULL,NULL,NULL,'{\"id\":\"d3d258ce-ba2c-4bda-b5fe-2dceb1f61b0d\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Website Inquiry\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:26.897'),
('8458b2f7-99ff-402d-95b6-c74e51485046','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','60c401c2-68a1-42cf-8d44-2fe937823fd2',NULL,NULL,NULL,'{\"id\":\"60c401c2-68a1-42cf-8d44-2fe937823fd2\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Website Inquiry\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:27.859'),
('88735bb6-1baa-4e5c-b1ad-04dd1a568982',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'LOGIN','SUPER_ADMIN','9d121c09-aa56-4e63-b609-1ab9f9a11166',NULL,NULL,NULL,NULL,'Super Admin \"Platform Super Admin\" authenticated via Unified Login','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-25 04:32:24.179'),
('95c52351-ea59-4727-884e-1a6f13a79e10','09bd48e0-a681-4d47-99da-6dbd5da94ad2',NULL,'09bd48e0-a681-4d47-99da-6dbd5da94ad2','alok',NULL,NULL,'CREATE_LEAD','LEAD','2679d99c-ad28-4266-b2bd-5598adaafcff',NULL,NULL,NULL,'{\"id\":\"2679d99c-ad28-4266-b2bd-5598adaafcff\",\"name\":\"Karn Singh\",\"email\":\"karnsingh9468502876@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-24 10:25:24.845'),
('9ccaa2ac-1d81-4549-8de6-b2c12be0705f',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'SWITCH_TO_CLIENT_PANEL','CLIENT_ADMIN','09bd48e0-a681-4d47-99da-6dbd5da94ad2',NULL,NULL,NULL,NULL,'Super Admin switched into panel of \"au hub\" (alok)','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-24 10:28:07.189'),
('a22968fa-275f-4446-ae41-cbfe6bef49ea',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'LOGIN','SUPER_ADMIN','9d121c09-aa56-4e63-b609-1ab9f9a11166',NULL,NULL,NULL,NULL,'Super Admin \"Platform Super Admin\" authenticated via Unified Login','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-24 11:09:10.716'),
('a82a4f5a-2081-48fa-81ae-e6dba7ba3ddc',NULL,NULL,NULL,NULL,NULL,NULL,'CREATE','CLIENT_ADMIN','09bd48e0-a681-4d47-99da-6dbd5da94ad2',NULL,'{\"organization\":\"au hub\",\"email\":\"alok@gmail.com\",\"status\":\"ACTIVE\",\"themeColor\":\"#7f22fe\"}',NULL,NULL,'Provisioned client panel for \"au hub\" with theme #7f22fe','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-23 04:16:15.213'),
('ab22d250-838a-4a4d-a570-b2656be352ed',NULL,NULL,NULL,NULL,NULL,NULL,'SEED','CATALOG',NULL,NULL,'{\"services\":7}',NULL,NULL,'Initial 7-service catalogue seeded into MySQL database','127.0.0.1','Seeder/1.0','2026-11-20 05:15:40.770'),
('b50cf953-f2b1-408a-be9f-5005e3f1d7ab','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','9972d4ee-5275-4231-8a4f-b7e099f7b2e8',NULL,NULL,NULL,'{\"id\":\"9972d4ee-5275-4231-8a4f-b7e099f7b2e8\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:15.410'),
('b89d9fb7-c5c9-4768-976c-79b1e15b8072',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'SWITCH_TO_CLIENT_PANEL','CLIENT_ADMIN','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,NULL,NULL,NULL,'Super Admin switched into panel of \"artfect\" (karn singh)','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-21 08:25:02.055'),
('bbfbb7ff-719c-42c1-abbe-2e61a02aedad',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'SWITCH_TO_CLIENT_PANEL','CLIENT_ADMIN','09bd48e0-a681-4d47-99da-6dbd5da94ad2',NULL,NULL,NULL,NULL,'Super Admin switched into panel of \"au hub\" (alok)','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-24 11:13:45.695'),
('be2633e2-066c-47b8-b1b6-5138aea7c88f',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'SWITCH_TO_CLIENT_PANEL','CLIENT_ADMIN','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,NULL,NULL,NULL,'Super Admin switched into panel of \"artfect\" (karn singh)','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-23 06:54:25.277'),
('cce308de-0824-430b-9ff2-897792af9aea','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'company-user','User',NULL,NULL,'CREATE_CONTACT','CONTACT','9b2a1634-a2b6-436a-8cc9-6e1952621a1c',NULL,NULL,NULL,'{\"id\":\"9b2a1634-a2b6-436a-8cc9-6e1952621a1c\",\"name\":\"alok\",\"customerId\":null}','Created contact person record','127.0.0.1','System / API','2026-11-23 07:00:29.636'),
('d31df6fe-59a4-4d0e-a2cc-41d4692bfe46',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'LOGIN','SUPER_ADMIN','9d121c09-aa56-4e63-b609-1ab9f9a11166',NULL,NULL,NULL,NULL,'Super Admin \"Platform Super Admin\" authenticated via Unified Login','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-21 05:36:37.371'),
('d76f05e0-8c05-4948-bd9e-ee653b2d13d3','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','7f8d49dd-88b2-44c6-abda-992f335e284a',NULL,NULL,NULL,'{\"id\":\"7f8d49dd-88b2-44c6-abda-992f335e284a\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:15.244'),
('d90f6c7f-8ff4-4a0c-b572-2e2e1cb82a88',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'LOGIN','SUPER_ADMIN','9d121c09-aa56-4e63-b609-1ab9f9a11166',NULL,NULL,NULL,NULL,'Super Admin \"Platform Super Admin\" authenticated via Unified Login','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-24 10:22:45.021'),
('d9cdae30-177f-43cf-9e1c-a4276bb8a7e3',NULL,NULL,NULL,NULL,NULL,NULL,'PERMISSION_UPDATE','ACCESS','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'{\"serviceCount\":1}',NULL,NULL,'Updated dynamic access permissions for \"artfect\"','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-23 06:54:22.450'),
('dbcd9355-c3f5-421c-8e2e-5971f85a237f',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'LOGIN','SUPER_ADMIN','9d121c09-aa56-4e63-b609-1ab9f9a11166',NULL,NULL,NULL,NULL,'Super Admin \"Platform Super Admin\" authenticated via Unified Login','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-23 07:26:46.940'),
('e678088a-9be9-4a5c-a131-ab3983730f43',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'LOGIN','SUPER_ADMIN','9d121c09-aa56-4e63-b609-1ab9f9a11166',NULL,NULL,NULL,NULL,'Super Admin \"Platform Super Admin\" authenticated via Unified Login','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-23 10:08:52.535'),
('e7890627-4329-4ce3-9091-2bb2217901eb',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'LOGIN','SUPER_ADMIN','9d121c09-aa56-4e63-b609-1ab9f9a11166',NULL,NULL,NULL,NULL,'Super Admin \"Platform Super Admin\" authenticated via Unified Login','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-23 11:10:04.247'),
('e7f7d68e-e68d-4cdd-b1d9-883d37e16a1b','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','f8b02f83-3d55-4fba-8851-09af654d084e',NULL,NULL,NULL,'{\"id\":\"f8b02f83-3d55-4fba-8851-09af654d084e\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Website Inquiry\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:28.311'),
('e8bd5c54-48f8-4e96-b1e1-a7128d28a9a1',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'SWITCH_TO_CLIENT_PANEL','CLIENT_ADMIN','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,NULL,NULL,NULL,'Super Admin switched into panel of \"artfect\" (karn singh)','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-24 11:14:24.442'),
('ed325989-bbbf-451f-8928-4ee614bdd74e','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','a4fe5339-8e9e-4bda-8f29-0f99568cfbad',NULL,NULL,NULL,'{\"id\":\"a4fe5339-8e9e-4bda-8f29-0f99568cfbad\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Website Inquiry\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:28.745'),
('ef8e0f26-aef3-4000-b62b-d84770546f06','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','da32e613-b90f-4b9b-af7c-9583c2d4b4eb',NULL,NULL,NULL,'{\"id\":\"da32e613-b90f-4b9b-af7c-9583c2d4b4eb\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:09.208'),
('fa25cd48-4b05-483c-b6e2-855d8d67e3f4',NULL,NULL,NULL,'Platform Super Admin',NULL,NULL,'SWITCH_TO_CLIENT_PANEL','CLIENT_ADMIN','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,NULL,NULL,NULL,'Super Admin switched into panel of \"artfect\" (karn singh)','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36','2026-11-21 05:37:08.897'),
('fc2a360d-56f8-4512-b2a4-d2f974ea279b','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','b5e51552-8030-45cc-bce5-db6c3d2ca302',NULL,NULL,NULL,'{\"id\":\"b5e51552-8030-45cc-bce5-db6c3d2ca302\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:14.609'),
('fe36350d-51c8-4962-8c21-6f6f0373bc70','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','23c3d1ff-255d-4037-874d-2aec9c1ffc23',NULL,NULL,NULL,'{\"id\":\"23c3d1ff-255d-4037-874d-2aec9c1ffc23\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:13.961'),
('ffa727ec-885d-458b-928a-fa4b7bf775c8','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh',NULL,NULL,'CREATE_LEAD','LEAD','70a7676e-8dc7-4870-a736-84b3d0f4b0ea',NULL,NULL,NULL,'{\"id\":\"70a7676e-8dc7-4870-a736-84b3d0f4b0ea\",\"name\":\"vikas\",\"email\":\"vikas@gmail.com\",\"source\":\"Manual\"}','Captured new CRM lead','127.0.0.1','System / API','2026-11-21 06:51:15.043');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_employees`
--

DROP TABLE IF EXISTS `company_employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company_employees` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `department_id` char(36) DEFAULT NULL,
  `team_id` char(36) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(180) NOT NULL,
  `phone` varchar(40) DEFAULT NULL,
  `role` varchar(100) NOT NULL,
  `access_role` varchar(30) NOT NULL DEFAULT 'EMPLOYEE',
  `password_hash` varchar(255) DEFAULT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `company_employees_company_id_email_key` (`company_id`,`email`),
  KEY `company_employees_department_id_fkey` (`department_id`),
  KEY `company_employees_team_id_fkey` (`team_id`),
  CONSTRAINT `company_employees_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `company_employees_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `company_employees_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `company_service_teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_employees`
--

LOCK TABLES `company_employees` WRITE;
/*!40000 ALTER TABLE `company_employees` DISABLE KEYS */;
/*!40000 ALTER TABLE `company_employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_lead_integrations`
--

DROP TABLE IF EXISTS `company_lead_integrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company_lead_integrations` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `provider` varchar(50) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `credentials` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`credentials`)),
  `webhook_token` varchar(100) DEFAULT NULL,
  `last_sync_at` datetime(3) DEFAULT NULL,
  `total_synced` int(11) NOT NULL DEFAULT 0,
  `last_sync_status` varchar(50) DEFAULT NULL,
  `last_sync_error` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `company_lead_integrations_company_id_provider_key` (`company_id`,`provider`),
  UNIQUE KEY `company_lead_integrations_webhook_token_key` (`webhook_token`),
  KEY `company_lead_integrations_company_id_status_idx` (`company_id`,`status`),
  CONSTRAINT `company_lead_integrations_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_lead_integrations`
--

LOCK TABLES `company_lead_integrations` WRITE;
/*!40000 ALTER TABLE `company_lead_integrations` DISABLE KEYS */;
INSERT INTO `company_lead_integrations` VALUES
('270d246d-0a79-4d8a-876d-543554e7947f','09bd48e0-a681-4d47-99da-6dbd5da94ad2','META_FACEBOOK','INACTIVE','{\"provider\":\"META_FACEBOOK\",\"pageId\":\"\",\"pageAccessToken\":\"\",\"status\":\"INACTIVE\"}','wh_meta_ab982c2a297a9e848df736e3',NULL,0,NULL,NULL,'2026-11-23 04:16:15.208','2026-11-23 04:16:15.208'),
('31bf1142-9aee-47c2-99d6-15b3db2af2b5','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','GMAIL','INACTIVE','{\"provider\":\"GMAIL\",\"inquiryEmail\":\"\",\"status\":\"INACTIVE\"}','wh_gmai_a067e83ec9db679f8132d1ba',NULL,0,NULL,NULL,'2026-11-20 05:23:15.057','2026-11-20 05:23:15.057'),
('4a522acd-466e-44df-b3ed-b1d255a77578','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','META_INSTAGRAM','INACTIVE','{\"provider\":\"META_INSTAGRAM\",\"instagramAccountId\":\"\",\"accessToken\":\"\",\"status\":\"INACTIVE\"}','wh_meta_bce1c3bb3fd534194c9288c8',NULL,0,NULL,NULL,'2026-11-20 05:23:15.056','2026-11-20 05:23:15.056'),
('4f83f779-8efc-4033-8859-880f01e786f0','09bd48e0-a681-4d47-99da-6dbd5da94ad2','META_INSTAGRAM','INACTIVE','{\"provider\":\"META_INSTAGRAM\",\"instagramAccountId\":\"\",\"accessToken\":\"\",\"status\":\"INACTIVE\"}','wh_meta_df23cd9b2a0c6352bfb7f659',NULL,0,NULL,NULL,'2026-11-23 04:16:15.209','2026-11-23 04:16:15.209'),
('4fe4187d-fefb-4f99-abcb-fe4c9bfa050f','09bd48e0-a681-4d47-99da-6dbd5da94ad2','JUSTDIAL','INACTIVE','{\"provider\":\"JUSTDIAL\",\"apiKey\":\"\",\"status\":\"INACTIVE\"}','wh_just_d3d9bdb39e9a7e9b6580dbdd',NULL,0,NULL,NULL,'2026-11-23 04:16:15.213','2026-11-23 04:16:15.213'),
('5d3a859f-eec4-45f5-87bc-57852aaa4eae','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','WEBSITE_WEBHOOK','ACTIVE','{\"provider\":\"WEBSITE_WEBHOOK\",\"defaultSourceTag\":\"Website Ingestion\",\"status\":\"ACTIVE\"}','wh_webs_690c9f5134411248c2358ca1',NULL,0,NULL,NULL,'2026-11-20 05:23:15.056','2026-11-20 05:23:15.056'),
('6d0da426-64f6-4ab7-9ddc-3bf6dbd7a6e5','09bd48e0-a681-4d47-99da-6dbd5da94ad2','INDIAMART','INACTIVE','{\"provider\":\"INDIAMART\",\"glusrCrmKey\":\"\",\"status\":\"INACTIVE\"}','wh_indi_ae3d143c1d13122e6efba5bd',NULL,0,NULL,NULL,'2026-11-23 04:16:15.204','2026-11-23 04:16:15.204'),
('7ca6c1f2-2c36-4c07-8319-d5a64e89e445','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','INDIAMART','INACTIVE','{\"provider\":\"INDIAMART\",\"glusrCrmKey\":\"\",\"status\":\"INACTIVE\"}','wh_indi_16aee2de4d1e3c342123a8a1',NULL,0,NULL,NULL,'2026-11-20 05:23:15.049','2026-11-20 05:23:15.049'),
('89d3db75-99db-413b-8080-4f6fe9e72f2e','09bd48e0-a681-4d47-99da-6dbd5da94ad2','GMAIL','INACTIVE','{\"provider\":\"GMAIL\",\"inquiryEmail\":\"\",\"status\":\"INACTIVE\"}','wh_gmai_ba1d61067a9f4dc925206d04',NULL,0,NULL,NULL,'2026-11-23 04:16:15.211','2026-11-23 04:16:15.211'),
('9a2463f7-14ea-455d-810b-ac06415a4d52','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','META_FACEBOOK','INACTIVE','{\"provider\":\"META_FACEBOOK\",\"pageId\":\"\",\"pageAccessToken\":\"\",\"status\":\"INACTIVE\"}','wh_meta_27ff220a78618efaba09df53',NULL,0,NULL,NULL,'2026-11-20 05:23:15.055','2026-11-20 05:23:15.055'),
('bd3f777f-1af2-4780-a445-29ed3ba9dc61','09bd48e0-a681-4d47-99da-6dbd5da94ad2','WEBSITE_WEBHOOK','ACTIVE','{\"provider\":\"WEBSITE_WEBHOOK\",\"defaultSourceTag\":\"Website Ingestion\",\"status\":\"ACTIVE\"}','wh_webs_2edfe916c58d2340e3e7d438',NULL,0,NULL,NULL,'2026-11-23 04:16:15.210','2026-11-23 04:16:15.210'),
('fc9dd612-0a97-42a0-9137-9673f42483c3','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','JUSTDIAL','INACTIVE','{\"provider\":\"JUSTDIAL\",\"apiKey\":\"\",\"status\":\"INACTIVE\"}','wh_just_1cdfcf19e9968bad33ce6b99',NULL,0,NULL,NULL,'2026-11-20 05:23:15.058','2026-11-20 05:23:15.058');
/*!40000 ALTER TABLE `company_lead_integrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_service_teams`
--

DROP TABLE IF EXISTS `company_service_teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company_service_teams` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `service_id` char(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `head_employee_id` char(36) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `company_service_teams_company_id_service_id_name_key` (`company_id`,`service_id`,`name`),
  UNIQUE KEY `company_service_teams_head_employee_id_key` (`head_employee_id`),
  KEY `company_service_teams_company_id_service_id_idx` (`company_id`,`service_id`),
  KEY `company_service_teams_service_id_fkey` (`service_id`),
  CONSTRAINT `company_service_teams_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `company_service_teams_head_employee_id_fkey` FOREIGN KEY (`head_employee_id`) REFERENCES `company_employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `company_service_teams_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_service_teams`
--

LOCK TABLES `company_service_teams` WRITE;
/*!40000 ALTER TABLE `company_service_teams` DISABLE KEYS */;
/*!40000 ALTER TABLE `company_service_teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crm_communications`
--

DROP TABLE IF EXISTS `crm_communications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crm_communications` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `customer_id` char(36) DEFAULT NULL,
  `lead_id` char(36) DEFAULT NULL,
  `contact_id` char(36) DEFAULT NULL,
  `communication_type` varchar(50) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `notes` text DEFAULT NULL,
  `outcome` varchar(100) DEFAULT NULL,
  `next_follow_up_date` datetime(3) DEFAULT NULL,
  `employee_id` char(36) DEFAULT NULL,
  `employee_name` varchar(180) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `crm_communications_company_id_customer_id_created_at_idx` (`company_id`,`customer_id`,`created_at`),
  KEY `crm_communications_company_id_lead_id_idx` (`company_id`,`lead_id`),
  KEY `crm_communications_customer_id_fkey` (`customer_id`),
  CONSTRAINT `crm_communications_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `crm_communications_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `crm_customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crm_communications`
--

LOCK TABLES `crm_communications` WRITE;
/*!40000 ALTER TABLE `crm_communications` DISABLE KEYS */;
INSERT INTO `crm_communications` VALUES
('2233ece5-5009-4cce-a1ce-ed9900ebc5a0','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'5d217ff8-74b1-44c7-aa13-0111481ef061',NULL,'OTHER','Lead Converted: vikas','Converted from Lead #5d217ff8-74b1-44c7-aa13-0111481ef061 (Source: Website Inquiry) by karn singh. Requirements: 50 unit phones','WON',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh','2026-11-21 04:45:33.554','2026-11-21 04:45:33.554'),
('33bab3b2-ae1f-443a-88a6-29001f8106fc','09bd48e0-a681-4d47-99da-6dbd5da94ad2','22b405d2-ad65-4dae-a0f7-edff884ba8e4','2679d99c-ad28-4266-b2bd-5598adaafcff',NULL,'OTHER','Lead Converted: Karn Singh','Converted from Lead #2679d99c-ad28-4266-b2bd-5598adaafcff (Source: Manual) by alok. ','WON',NULL,'09bd48e0-a681-4d47-99da-6dbd5da94ad2','alok','2026-11-24 11:14:07.616','2026-11-24 11:14:07.616'),
('5192da66-299c-4a2a-ab6a-5cc63eace3a2','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','f679349e-7c2a-41d8-a2b0-9c6cf95c1f8b','5bc52ab9-1e65-4e51-aa8a-283cb3d4c57b',NULL,'OTHER','Lead Converted: vikas','Converted from Lead #5bc52ab9-1e65-4e51-aa8a-283cb3d4c57b (Source: Manual) by karn singh. ','WON',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh','2026-11-21 10:06:39.810','2026-11-21 10:06:39.810'),
('5b60f41e-e0c7-4a06-8d04-2ec252ba6e99','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','9bee42d0-38bf-4b7b-97fa-bbfe4d6e0b98','19f6250a-bede-42cc-9245-5aad1fcca732',NULL,'OTHER','Lead Converted: alok','Converted from Lead #19f6250a-bede-42cc-9245-5aad1fcca732 (Source: Manual) by karn singh. Requirements: 1000 frem','WON',NULL,'15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh','2026-11-23 06:59:54.886','2026-11-23 06:59:54.886');
/*!40000 ALTER TABLE `crm_communications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crm_contacts`
--

DROP TABLE IF EXISTS `crm_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crm_contacts` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `customer_id` char(36) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `company_name` varchar(180) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `stakeholder_type` varchar(50) DEFAULT 'COMMERCIAL',
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `is_decision_maker` tinyint(1) NOT NULL DEFAULT 0,
  `communication_preference` varchar(50) DEFAULT 'EMAIL',
  `email` varchar(180) DEFAULT NULL,
  `phone` varchar(40) DEFAULT NULL,
  `channel` varchar(50) NOT NULL DEFAULT 'Email',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `crm_contacts_company_id_customer_id_idx` (`company_id`,`customer_id`),
  KEY `crm_contacts_company_id_created_at_idx` (`company_id`,`created_at`),
  KEY `crm_contacts_customer_id_fkey` (`customer_id`),
  CONSTRAINT `crm_contacts_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `crm_contacts_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `crm_customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crm_contacts`
--

LOCK TABLES `crm_contacts` WRITE;
/*!40000 ALTER TABLE `crm_contacts` DISABLE KEYS */;
INSERT INTO `crm_contacts` VALUES
('334913df-2a78-4efe-b7fa-d74f90c12e3d','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','f679349e-7c2a-41d8-a2b0-9c6cf95c1f8b','vikas','artfect studio','Primary Contact','Key Stakeholder',NULL,'COMMERCIAL',1,1,'EMAIL','vikas@gmail.com','9876543210','Email','2026-11-21 10:06:39.796','2026-11-21 10:06:39.796'),
('490b807b-aa80-4091-868e-c3ddbbbe8dc0','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','9bee42d0-38bf-4b7b-97fa-bbfe4d6e0b98','alok','cu hub','Primary Contact','Key Stakeholder',NULL,'COMMERCIAL',1,1,'EMAIL','alok@gmail.com','8765432109','Email','2026-11-23 06:59:54.877','2026-11-23 06:59:54.877'),
('9b2a1634-a2b6-436a-8cc9-6e1952621a1c','15ed5a67-a6ad-41ca-ac02-b98abdd4f642',NULL,'alok','cu hub','Primary Account Contact','Primary Account Contact',NULL,'COMMERCIAL',0,0,'EMAIL','alok@gmail.com','8765432109','Customer Account','2026-11-23 07:00:29.631','2026-11-23 07:00:29.631'),
('b5983f11-84c9-41f5-bfca-bf0afa66e442','09bd48e0-a681-4d47-99da-6dbd5da94ad2','22b405d2-ad65-4dae-a0f7-edff884ba8e4','Karn Singh','karn','Primary Contact','Key Stakeholder',NULL,'COMMERCIAL',1,1,'EMAIL','karnsingh9468502876@gmail.com','9876543210','Email','2026-11-24 11:14:07.602','2026-11-24 11:14:07.602');
/*!40000 ALTER TABLE `crm_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crm_customers`
--

DROP TABLE IF EXISTS `crm_customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crm_customers` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `company_name` varchar(180) NOT NULL,
  `customer_code` varchar(50) DEFAULT NULL,
  `gstin` varchar(50) DEFAULT NULL,
  `pan` varchar(20) DEFAULT NULL,
  `contact_person` varchar(150) DEFAULT NULL,
  `email` varchar(180) DEFAULT NULL,
  `phone` varchar(40) DEFAULT NULL,
  `industry` varchar(100) NOT NULL DEFAULT 'Technology & IT',
  `customer_category` varchar(50) NOT NULL DEFAULT 'DOMESTIC',
  `billing_address` text DEFAULT NULL,
  `shipping_address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(20) DEFAULT NULL,
  `credit_limit` decimal(15,2) DEFAULT 0.00,
  `payment_terms` varchar(255) DEFAULT '30% Advance, 70% against BL/Delivery',
  `requirements` text DEFAULT NULL,
  `assigned_to` varchar(150) DEFAULT NULL,
  `reorder_cycle_days` int(11) DEFAULT 30,
  `last_order_date` datetime(3) DEFAULT NULL,
  `expected_reorder_date` datetime(3) DEFAULT NULL,
  `reorder_reminder_status` varchar(30) DEFAULT 'PENDING',
  `status` varchar(30) NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `crm_customers_company_id_status_created_at_idx` (`company_id`,`status`,`created_at`),
  KEY `crm_customers_company_id_customer_code_idx` (`company_id`,`customer_code`),
  KEY `crm_customers_company_id_phone_idx` (`company_id`,`phone`),
  KEY `crm_customers_company_id_email_idx` (`company_id`,`email`),
  KEY `crm_customers_company_id_gstin_idx` (`company_id`,`gstin`),
  CONSTRAINT `crm_customers_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crm_customers`
--

LOCK TABLES `crm_customers` WRITE;
/*!40000 ALTER TABLE `crm_customers` DISABLE KEYS */;
INSERT INTO `crm_customers` VALUES
('22b405d2-ad65-4dae-a0f7-edff884ba8e4','09bd48e0-a681-4d47-99da-6dbd5da94ad2','karn','CUST-1432',NULL,NULL,'Karn Singh','karnsingh9468502876@gmail.com','9876543210','Technology & IT','DOMESTIC',NULL,NULL,NULL,NULL,NULL,0.00,'30% Advance, 70% against BL/Delivery',NULL,NULL,30,NULL,NULL,'PENDING','ACTIVE','2026-11-24 11:14:07.591','2026-11-24 11:14:07.591'),
('9bee42d0-38bf-4b7b-97fa-bbfe4d6e0b98','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','cu hub','CUST-7448',NULL,NULL,'alok','alok@gmail.com','8765432109','Technology & IT','DOMESTIC',NULL,NULL,NULL,NULL,NULL,0.00,'30% Advance, 70% against BL/Delivery','1000 frem',NULL,30,NULL,NULL,'PENDING','ACTIVE','2026-11-23 06:59:54.872','2026-11-23 06:59:54.872'),
('f679349e-7c2a-41d8-a2b0-9c6cf95c1f8b','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','artfect studio','CUST-1095',NULL,NULL,'vikas','vikas@gmail.com','9876543210','Technology & IT','DOMESTIC',NULL,NULL,NULL,NULL,NULL,0.00,'30% Advance, 70% against BL/Delivery',NULL,NULL,30,NULL,NULL,'PENDING','ACTIVE','2026-11-21 10:06:39.777','2026-11-21 10:06:39.777');
/*!40000 ALTER TABLE `crm_customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crm_leads`
--

DROP TABLE IF EXISTS `crm_leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crm_leads` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `company` varchar(180) DEFAULT NULL,
  `email` varchar(180) NOT NULL,
  `phone` varchar(40) DEFAULT NULL,
  `source` varchar(100) NOT NULL DEFAULT 'Website Inquiry',
  `external_id` varchar(191) DEFAULT NULL,
  `value` decimal(15,2) DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `assigned_to` varchar(150) DEFAULT NULL,
  `priority` varchar(20) NOT NULL DEFAULT 'MEDIUM',
  `status` enum('NEW','CONTACTED','QUALIFIED','PROPOSAL','WON','LOST') NOT NULL DEFAULT 'NEW',
  `next_follow_up_date` datetime(3) DEFAULT NULL,
  `follow_up_remarks` text DEFAULT NULL,
  `converted_at` datetime(3) DEFAULT NULL,
  `converted_by_id` char(36) DEFAULT NULL,
  `converted_by_name` varchar(150) DEFAULT NULL,
  `converted_customer_id` char(36) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `crm_leads_company_id_status_created_at_idx` (`company_id`,`status`,`created_at`),
  KEY `crm_leads_company_id_external_id_idx` (`company_id`,`external_id`),
  KEY `crm_leads_company_id_phone_idx` (`company_id`,`phone`),
  KEY `crm_leads_company_id_email_idx` (`company_id`,`email`),
  CONSTRAINT `crm_leads_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crm_leads`
--

LOCK TABLES `crm_leads` WRITE;
/*!40000 ALTER TABLE `crm_leads` DISABLE KEYS */;
INSERT INTO `crm_leads` VALUES
('19f6250a-bede-42cc-9245-5aad1fcca732','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','alok','cu hub','alok@gmail.com','8765432109','Manual',NULL,100000.00,'1000 frem',NULL,'MEDIUM','WON',NULL,NULL,'2026-11-23 06:59:54.879','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh','9bee42d0-38bf-4b7b-97fa-bbfe4d6e0b98','2026-11-23 06:58:54.191','2026-11-23 06:59:54.881'),
('2679d99c-ad28-4266-b2bd-5598adaafcff','09bd48e0-a681-4d47-99da-6dbd5da94ad2','Karn Singh','karn','karnsingh9468502876@gmail.com','9876543210','Manual',NULL,100000.00,NULL,NULL,'MEDIUM','WON',NULL,NULL,'2026-11-24 11:14:07.605','09bd48e0-a681-4d47-99da-6dbd5da94ad2','alok','22b405d2-ad65-4dae-a0f7-edff884ba8e4','2026-11-24 10:25:24.841','2026-11-24 11:14:07.605'),
('5bc52ab9-1e65-4e51-aa8a-283cb3d4c57b','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','vikas','artfect studio','vikas@gmail.com','9876543210','Manual',NULL,200000.00,NULL,NULL,'MEDIUM','WON',NULL,NULL,'2026-11-21 10:06:39.799','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','karn singh','f679349e-7c2a-41d8-a2b0-9c6cf95c1f8b','2026-11-21 09:49:07.321','2026-11-21 10:06:39.800');
/*!40000 ALTER TABLE `crm_leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crm_opportunities`
--

DROP TABLE IF EXISTS `crm_opportunities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crm_opportunities` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `title` varchar(180) NOT NULL,
  `company_name` varchar(180) NOT NULL,
  `stage` varchar(60) NOT NULL DEFAULT 'DISCOVERY',
  `value` decimal(15,2) DEFAULT NULL,
  `expected_close_date` datetime(3) DEFAULT NULL,
  `probability` varchar(20) DEFAULT '50%',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `crm_opportunities_company_id_stage_created_at_idx` (`company_id`,`stage`,`created_at`),
  CONSTRAINT `crm_opportunities_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crm_opportunities`
--

LOCK TABLES `crm_opportunities` WRITE;
/*!40000 ALTER TABLE `crm_opportunities` DISABLE KEYS */;
INSERT INTO `crm_opportunities` VALUES
('3a739506-d715-4740-bd8f-5e90ddd356ec','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','artfect studio - Won Deal','artfect studio','WON',200000.00,'2026-11-21 10:06:39.816','100%','2026-11-21 10:06:39.816','2026-11-21 10:06:39.816'),
('4f4f9497-bde6-40d4-a425-597e925fa307','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','cu hub - Deal Opportunity','cu hub','WON',1000.00,'2026-12-08 00:00:00.000','100%','2026-11-23 07:00:38.835','2026-11-23 07:01:18.850'),
('668c8419-16b0-413f-9fb8-5daa3fec4e73','09bd48e0-a681-4d47-99da-6dbd5da94ad2','karn - Won Deal','karn','WON',100000.00,'2026-11-24 11:14:07.623','100%','2026-11-24 11:14:07.624','2026-11-24 11:14:07.624'),
('81852926-d493-4e19-b934-0e708bd0ec2b','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','cu hub - Won Deal','cu hub','WON',100000.00,'2026-11-23 06:59:54.895','100%','2026-11-23 06:59:54.897','2026-11-23 06:59:54.897');
/*!40000 ALTER TABLE `crm_opportunities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_advances`
--

DROP TABLE IF EXISTS `customer_advances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_advances` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `advance_no` varchar(60) NOT NULL,
  `customer_id` char(36) NOT NULL,
  `proforma_id` char(36) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_mode` varchar(50) NOT NULL,
  `bank_reference` varchar(100) DEFAULT NULL,
  `payment_date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `notes` text DEFAULT NULL,
  `verification_status` varchar(30) NOT NULL DEFAULT 'PENDING',
  `verified_by_id` char(36) DEFAULT NULL,
  `verified_by_name` varchar(180) DEFAULT NULL,
  `verified_at` datetime(3) DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `attachment_id` char(36) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_advances_company_id_advance_no_key` (`company_id`,`advance_no`),
  KEY `customer_advances_company_id_customer_id_verification_status_idx` (`company_id`,`customer_id`,`verification_status`),
  KEY `customer_advances_customer_id_fkey` (`customer_id`),
  KEY `customer_advances_proforma_id_fkey` (`proforma_id`),
  CONSTRAINT `customer_advances_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customer_advances_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `crm_customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `customer_advances_proforma_id_fkey` FOREIGN KEY (`proforma_id`) REFERENCES `sales_proforma_invoices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_advances`
--

LOCK TABLES `customer_advances` WRITE;
/*!40000 ALTER TABLE `customer_advances` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_advances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departments` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `service_id` char(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `code` varchar(80) NOT NULL,
  `description` text DEFAULT NULL,
  `head_id` char(36) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departments_company_id_service_id_code_key` (`company_id`,`service_id`,`code`),
  KEY `departments_service_id_fkey` (`service_id`),
  KEY `departments_head_id_fkey` (`head_id`),
  CONSTRAINT `departments_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `departments_head_id_fkey` FOREIGN KEY (`head_id`) REFERENCES `company_employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `departments_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES
('c3b94798-d239-437e-9d85-6f109d3029cc','15ed5a67-a6ad-41ca-ac02-b98abdd4f642','e9583ad0-e027-4486-9184-b4e4f2957d6b','CRM & Sales','crm_sales',NULL,NULL,'ACTIVE','2026-11-20 05:32:04.358','2026-11-20 05:32:04.358');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_versions`
--

DROP TABLE IF EXISTS `document_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `document_versions` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `entity_type` varchar(60) NOT NULL,
  `entity_id` char(36) NOT NULL,
  `version_number` int(11) NOT NULL,
  `parent_version_id` char(36) DEFAULT NULL,
  `revision_reason` text DEFAULT NULL,
  `is_locked` tinyint(1) NOT NULL DEFAULT 0,
  `locked_at` datetime(3) DEFAULT NULL,
  `created_by_id` char(36) NOT NULL,
  `created_by_name` varchar(180) NOT NULL,
  `snapshot_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`snapshot_data`)),
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `document_versions_company_id_entity_type_entity_id_version_n_key` (`company_id`,`entity_type`,`entity_id`,`version_number`),
  KEY `document_versions_company_id_entity_type_entity_id_idx` (`company_id`,`entity_type`,`entity_id`),
  CONSTRAINT `document_versions_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_versions`
--

LOCK TABLES `document_versions` WRITE;
/*!40000 ALTER TABLE `document_versions` DISABLE KEYS */;
/*!40000 ALTER TABLE `document_versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `integration_jobs`
--

DROP TABLE IF EXISTS `integration_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `integration_jobs` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `job_type` varchar(80) NOT NULL,
  `source_system` varchar(60) NOT NULL,
  `destination_system` varchar(60) NOT NULL,
  `idempotency_key` varchar(128) NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `status` enum('PENDING','PROCESSING','COMPLETED','FAILED','RETRY_SCHEDULED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `attempts` int(11) NOT NULL DEFAULT 0,
  `max_attempts` int(11) NOT NULL DEFAULT 5,
  `next_retry_at` datetime(3) DEFAULT NULL,
  `last_error` text DEFAULT NULL,
  `result` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`result`)),
  `started_at` datetime(3) DEFAULT NULL,
  `completed_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `integration_jobs_idempotency_key_key` (`idempotency_key`),
  KEY `integration_jobs_company_id_status_next_retry_at_idx` (`company_id`,`status`,`next_retry_at`),
  CONSTRAINT `integration_jobs_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `integration_jobs`
--

LOCK TABLES `integration_jobs` WRITE;
/*!40000 ALTER TABLE `integration_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `integration_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_stocks`
--

DROP TABLE IF EXISTS `inventory_stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inventory_stocks` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `product_id` char(36) DEFAULT NULL,
  `bin_id` char(36) DEFAULT NULL,
  `sku` varchar(60) NOT NULL,
  `name` varchar(180) NOT NULL,
  `warehouse` varchar(100) NOT NULL DEFAULT 'Main Warehouse',
  `stock` int(11) NOT NULL DEFAULT 0,
  `reserved_stock` int(11) NOT NULL DEFAULT 0,
  `available_qty` int(11) NOT NULL DEFAULT 0,
  `wip_qty` int(11) NOT NULL DEFAULT 0,
  `quality_hold_qty` int(11) NOT NULL DEFAULT 0,
  `rejected_qty` int(11) NOT NULL DEFAULT 0,
  `sampling_qty` int(11) NOT NULL DEFAULT 0,
  `return_hold_qty` int(11) NOT NULL DEFAULT 0,
  `scrap_qty` int(11) NOT NULL DEFAULT 0,
  `reorder_level` int(11) NOT NULL DEFAULT 10,
  `uom` varchar(30) NOT NULL DEFAULT 'PCS',
  `item_type` varchar(40) NOT NULL DEFAULT 'FINISHED_GOOD',
  `bin_location` varchar(100) DEFAULT NULL,
  `average_cost` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `inventory_stocks_company_id_sku_warehouse_key` (`company_id`,`sku`,`warehouse`),
  KEY `inventory_stocks_company_id_warehouse_idx` (`company_id`,`warehouse`),
  KEY `inventory_stocks_product_id_idx` (`product_id`),
  KEY `inventory_stocks_bin_id_idx` (`bin_id`),
  CONSTRAINT `inventory_stocks_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `inventory_stocks_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_stocks`
--

LOCK TABLES `inventory_stocks` WRITE;
/*!40000 ALTER TABLE `inventory_stocks` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_stocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `modules` (
  `id` char(36) NOT NULL,
  `service_id` char(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `code` varchar(80) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(120) DEFAULT NULL,
  `order_no` int(11) NOT NULL DEFAULT 0,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `modules_code_key` (`code`),
  KEY `modules_service_id_fkey` (`service_id`),
  KEY `modules_created_by_fkey` (`created_by`),
  CONSTRAINT `modules_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `super_admins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `modules_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modules`
--

LOCK TABLES `modules` WRITE;
/*!40000 ALTER TABLE `modules` DISABLE KEYS */;
INSERT INTO `modules` VALUES
('05f15069-6d81-454a-990a-ab053561c903','e9583ad0-e027-4486-9184-b4e4f2957d6b','Product','product','Product catalogue, specifications, categories, and price management.','package',2,'ACTIVE',NULL,'2026-11-20 05:15:40.752','2026-11-20 05:15:40.752'),
('8db737b2-ee72-4be9-9f88-8392f0bd4aae','e9583ad0-e027-4486-9184-b4e4f2957d6b','Sales','sales','Sales pipelines, quotations, proforma invoices, sales orders, and reports.','dollar-sign',3,'ACTIVE',NULL,'2026-11-20 05:15:40.759','2026-11-20 05:15:40.759'),
('b04d298f-73a4-49a3-82f1-92d82b019f82','e9583ad0-e027-4486-9184-b4e4f2957d6b','CRM','crm','Lead generation, customer management, contacts, and interaction tracking.','users',1,'ACTIVE',NULL,'2026-11-20 05:15:40.739','2026-11-20 05:15:40.739');
/*!40000 ALTER TABLE `modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `recipient_id` char(36) NOT NULL,
  `title` varchar(180) NOT NULL,
  `message` text NOT NULL,
  `category` enum('APPROVAL','TASK','SYSTEM','ALERT') NOT NULL DEFAULT 'SYSTEM',
  `entity_type` varchar(60) DEFAULT NULL,
  `entity_id` char(36) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `notifications_company_id_recipient_id_is_read_idx` (`company_id`,`recipient_id`,`is_read`),
  CONSTRAINT `notifications_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `token_hash` char(64) NOT NULL,
  `email` varchar(180) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `user_type` varchar(40) NOT NULL,
  `expires_at` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`token_hash`),
  KEY `password_reset_tokens_email_idx` (`email`),
  KEY `password_reset_tokens_expires_at_idx` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_categories` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_categories_company_id_name_key` (`company_id`,`name`),
  KEY `product_categories_company_id_idx` (`company_id`),
  CONSTRAINT `product_categories_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_categories`
--

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_pricings`
--

DROP TABLE IF EXISTS `product_pricings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_pricings` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `plan_name` varchar(100) NOT NULL DEFAULT 'Standard Rate',
  `selling_price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `purchase_price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `tax_rate` decimal(5,2) NOT NULL DEFAULT 18.00,
  `discount_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `valid_from` datetime(3) DEFAULT NULL,
  `valid_until` datetime(3) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `status` varchar(30) NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_pricings_company_id_product_id_idx` (`company_id`,`product_id`),
  KEY `product_pricings_product_id_fkey` (`product_id`),
  CONSTRAINT `product_pricings_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `product_pricings_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_pricings`
--

LOCK TABLES `product_pricings` WRITE;
/*!40000 ALTER TABLE `product_pricings` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_pricings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `sku` varchar(60) NOT NULL,
  `name` varchar(180) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `category` varchar(100) NOT NULL DEFAULT 'Finished Goods',
  `uom` varchar(30) NOT NULL DEFAULT 'PCS',
  `selling_price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `purchase_price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `tax_rate` decimal(5,2) NOT NULL DEFAULT 18.00,
  `stock` int(11) NOT NULL DEFAULT 0,
  `status` varchar(30) NOT NULL DEFAULT 'ACTIVE',
  `length` decimal(10,2) DEFAULT NULL,
  `width` decimal(10,2) DEFAULT NULL,
  `height` decimal(10,2) DEFAULT NULL,
  `dimension_unit` varchar(20) DEFAULT 'MM',
  `net_weight` decimal(10,3) DEFAULT NULL,
  `gross_weight` decimal(10,3) DEFAULT NULL,
  `weight_unit` varchar(20) DEFAULT 'KG',
  `material_details` text DEFAULT NULL,
  `packaging_instructions` text DEFAULT NULL,
  `die_mould_ref` varchar(100) DEFAULT NULL,
  `printing_specs` text DEFAULT NULL,
  `batch_prefix` varchar(30) DEFAULT NULL,
  `requires_mfg_date` tinyint(1) NOT NULL DEFAULT 0,
  `requires_exp_date` tinyint(1) NOT NULL DEFAULT 0,
  `mrp` decimal(15,2) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_company_id_sku_key` (`company_id`,`sku`),
  KEY `products_company_id_category_status_idx` (`company_id`,`category`,`status`),
  CONSTRAINT `products_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_invoice_items`
--

DROP TABLE IF EXISTS `sales_invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales_invoice_items` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `invoice_id` char(36) NOT NULL,
  `product_id` char(36) DEFAULT NULL,
  `dispatch_order_item_id` char(36) DEFAULT NULL,
  `sku` varchar(80) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `hsn_code` varchar(20) DEFAULT NULL,
  `uom` varchar(20) NOT NULL DEFAULT 'PCS',
  `quantity` decimal(15,3) NOT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `discount_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `taxable_amount` decimal(15,2) NOT NULL,
  `tax_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `cgst_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `sgst_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `igst_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(15,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_invoice_items_company_id_invoice_id_idx` (`company_id`,`invoice_id`),
  KEY `sales_invoice_items_company_id_product_id_idx` (`company_id`,`product_id`),
  KEY `sales_invoice_items_invoice_id_fkey` (`invoice_id`),
  KEY `sales_invoice_items_product_id_fkey` (`product_id`),
  CONSTRAINT `sales_invoice_items_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sales_invoice_items_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `sales_invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sales_invoice_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoice_items`
--

LOCK TABLES `sales_invoice_items` WRITE;
/*!40000 ALTER TABLE `sales_invoice_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_invoice_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_invoices`
--

DROP TABLE IF EXISTS `sales_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales_invoices` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `invoice_no` varchar(60) NOT NULL,
  `invoice_date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `due_date` datetime(3) DEFAULT NULL,
  `financial_year_id` char(36) DEFAULT NULL,
  `accounting_period_id` char(36) DEFAULT NULL,
  `customer_id` char(36) NOT NULL,
  `customer_name` varchar(180) NOT NULL,
  `customer_gstin` varchar(20) DEFAULT NULL,
  `billing_address` text DEFAULT NULL,
  `shipping_address` text DEFAULT NULL,
  `sales_order_id` char(36) DEFAULT NULL,
  `dispatch_order_id` char(36) DEFAULT NULL,
  `is_inter_state` tinyint(1) NOT NULL DEFAULT 0,
  `taxable_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `cgst_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `sgst_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `igst_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `other_charges` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `paid_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `outstanding_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `status` varchar(30) NOT NULL DEFAULT 'DRAFT',
  `voucher_id` char(36) DEFAULT NULL,
  `irn` varchar(120) DEFAULT NULL,
  `ack_no` varchar(80) DEFAULT NULL,
  `ack_date` datetime(3) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sales_invoices_company_id_invoice_no_key` (`company_id`,`invoice_no`),
  KEY `sales_invoices_company_id_status_invoice_date_idx` (`company_id`,`status`,`invoice_date`),
  KEY `sales_invoices_company_id_customer_id_idx` (`company_id`,`customer_id`),
  KEY `sales_invoices_company_id_dispatch_order_id_idx` (`company_id`,`dispatch_order_id`),
  KEY `sales_invoices_customer_id_fkey` (`customer_id`),
  KEY `sales_invoices_sales_order_id_fkey` (`sales_order_id`),
  CONSTRAINT `sales_invoices_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sales_invoices_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `crm_customers` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `sales_invoices_sales_order_id_fkey` FOREIGN KEY (`sales_order_id`) REFERENCES `sales_orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_invoices`
--

LOCK TABLES `sales_invoices` WRITE;
/*!40000 ALTER TABLE `sales_invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_orders`
--

DROP TABLE IF EXISTS `sales_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales_orders` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `order_no` varchar(60) NOT NULL,
  `customer_id` char(36) DEFAULT NULL,
  `proforma_id` char(36) DEFAULT NULL,
  `proforma_no` varchar(60) DEFAULT NULL,
  `customer` varchar(180) NOT NULL,
  `date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `items_count` int(11) NOT NULL DEFAULT 1,
  `amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `advance_received` decimal(15,2) DEFAULT 0.00,
  `balance_payable` decimal(15,2) DEFAULT 0.00,
  `delivery_terms` varchar(255) DEFAULT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`items`)),
  `notes` text DEFAULT NULL,
  `assigned_to` varchar(150) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'PENDING_APPROVAL',
  `payment_status` varchar(50) NOT NULL DEFAULT 'PENDING',
  `is_released` tinyint(1) NOT NULL DEFAULT 0,
  `released_at` datetime(3) DEFAULT NULL,
  `released_by_id` char(36) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sales_orders_company_id_order_no_key` (`company_id`,`order_no`),
  KEY `sales_orders_company_id_status_date_idx` (`company_id`,`status`,`date`),
  KEY `sales_orders_company_id_customer_id_idx` (`company_id`,`customer_id`),
  CONSTRAINT `sales_orders_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_orders`
--

LOCK TABLES `sales_orders` WRITE;
/*!40000 ALTER TABLE `sales_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_proforma_invoices`
--

DROP TABLE IF EXISTS `sales_proforma_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales_proforma_invoices` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `invoice_no` varchar(60) NOT NULL,
  `customer_id` char(36) DEFAULT NULL,
  `quotation_id` char(36) DEFAULT NULL,
  `quotation_no` varchar(60) DEFAULT NULL,
  `customer` varchar(180) NOT NULL,
  `order_ref` varchar(60) DEFAULT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`items`)),
  `subtotal` decimal(15,2) DEFAULT 0.00,
  `tax_amount` decimal(15,2) DEFAULT 0.00,
  `discount_amount` decimal(15,2) DEFAULT 0.00,
  `amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `advance_required` decimal(15,2) DEFAULT 0.00,
  `advance_received` decimal(15,2) DEFAULT 0.00,
  `balance_payable` decimal(15,2) DEFAULT 0.00,
  `payment_terms` varchar(255) DEFAULT NULL,
  `delivery_terms` varchar(255) DEFAULT NULL,
  `validity_date` datetime(3) DEFAULT NULL,
  `date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `status` varchar(50) NOT NULL DEFAULT 'ISSUED',
  `version_number` int(11) NOT NULL DEFAULT 1,
  `is_locked` tinyint(1) NOT NULL DEFAULT 0,
  `created_by_id` char(36) DEFAULT NULL,
  `created_by_name` varchar(180) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sales_proforma_invoices_company_id_invoice_no_key` (`company_id`,`invoice_no`),
  KEY `sales_proforma_invoices_company_id_status_date_idx` (`company_id`,`status`,`date`),
  KEY `sales_proforma_invoices_company_id_customer_id_idx` (`company_id`,`customer_id`),
  CONSTRAINT `sales_proforma_invoices_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_proforma_invoices`
--

LOCK TABLES `sales_proforma_invoices` WRITE;
/*!40000 ALTER TABLE `sales_proforma_invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_proforma_invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_quotations`
--

DROP TABLE IF EXISTS `sales_quotations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales_quotations` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `quote_no` varchar(60) NOT NULL,
  `customer_id` char(36) DEFAULT NULL,
  `contact_person_id` char(36) DEFAULT NULL,
  `customer` varchar(180) NOT NULL,
  `title` varchar(180) NOT NULL,
  `amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`items`)),
  `notes` text DEFAULT NULL,
  `payment_terms` varchar(255) DEFAULT NULL,
  `delivery_terms` varchar(255) DEFAULT NULL,
  `prepared_by_id` char(36) DEFAULT NULL,
  `prepared_by_name` varchar(180) DEFAULT NULL,
  `valid_until` datetime(3) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'SENT',
  `version_number` int(11) NOT NULL DEFAULT 1,
  `is_locked` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sales_quotations_company_id_quote_no_key` (`company_id`,`quote_no`),
  KEY `sales_quotations_company_id_status_created_at_idx` (`company_id`,`status`,`created_at`),
  KEY `sales_quotations_company_id_customer_id_idx` (`company_id`,`customer_id`),
  CONSTRAINT `sales_quotations_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_quotations`
--

LOCK TABLES `sales_quotations` WRITE;
/*!40000 ALTER TABLE `sales_quotations` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_quotations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_work_items`
--

DROP TABLE IF EXISTS `service_work_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_work_items` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `service_id` char(36) NOT NULL,
  `created_by_id` char(36) DEFAULT NULL,
  `created_by_name` varchar(180) NOT NULL,
  `assigned_to_id` char(36) NOT NULL,
  `title` varchar(180) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('TODO','IN_PROGRESS','BLOCKED','DONE') NOT NULL DEFAULT 'TODO',
  `progress` int(11) NOT NULL DEFAULT 0,
  `priority` varchar(20) NOT NULL DEFAULT 'MEDIUM',
  `entity_type` varchar(60) DEFAULT NULL,
  `entity_id` char(36) DEFAULT NULL,
  `due_date` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `service_work_items_company_id_service_id_status_idx` (`company_id`,`service_id`,`status`),
  KEY `service_work_items_assigned_to_id_status_idx` (`assigned_to_id`,`status`),
  KEY `service_work_items_service_id_fkey` (`service_id`),
  KEY `service_work_items_created_by_id_fkey` (`created_by_id`),
  CONSTRAINT `service_work_items_assigned_to_id_fkey` FOREIGN KEY (`assigned_to_id`) REFERENCES `company_employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `service_work_items_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `service_work_items_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `company_employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `service_work_items_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_work_items`
--

LOCK TABLES `service_work_items` WRITE;
/*!40000 ALTER TABLE `service_work_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_work_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_work_updates`
--

DROP TABLE IF EXISTS `service_work_updates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_work_updates` (
  `id` char(36) NOT NULL,
  `work_item_id` char(36) NOT NULL,
  `author_id` char(36) DEFAULT NULL,
  `author_name` varchar(180) NOT NULL,
  `status` enum('TODO','IN_PROGRESS','BLOCKED','DONE') DEFAULT NULL,
  `progress` int(11) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `service_work_updates_work_item_id_created_at_idx` (`work_item_id`,`created_at`),
  KEY `service_work_updates_author_id_fkey` (`author_id`),
  CONSTRAINT `service_work_updates_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `company_employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `service_work_updates_work_item_id_fkey` FOREIGN KEY (`work_item_id`) REFERENCES `service_work_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_work_updates`
--

LOCK TABLES `service_work_updates` WRITE;
/*!40000 ALTER TABLE `service_work_updates` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_work_updates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `id` char(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `code` varchar(80) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `order_no` int(11) NOT NULL DEFAULT 0,
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `services_code_key` (`code`),
  KEY `services_created_by_fkey` (`created_by`),
  CONSTRAINT `services_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `super_admins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES
('e9583ad0-e027-4486-9184-b4e4f2957d6b','CRM & Sales','crm_sales','Leads, customers, contacts, quotations, proforma invoices, sales orders and price management.','ACTIVE',1,NULL,'2026-11-20 05:15:40.736','2026-11-20 05:15:40.736');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_modules`
--

DROP TABLE IF EXISTS `sub_modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sub_modules` (
  `id` char(36) NOT NULL,
  `module_id` char(36) NOT NULL,
  `service_id` char(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `code` varchar(80) NOT NULL,
  `route` varchar(255) DEFAULT NULL,
  `icon` varchar(120) DEFAULT NULL,
  `order_no` int(11) NOT NULL DEFAULT 0,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_by` char(36) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sub_modules_code_key` (`code`),
  KEY `sub_modules_module_id_fkey` (`module_id`),
  KEY `sub_modules_service_id_fkey` (`service_id`),
  KEY `sub_modules_created_by_fkey` (`created_by`),
  CONSTRAINT `sub_modules_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `super_admins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sub_modules_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sub_modules_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_modules`
--

LOCK TABLES `sub_modules` WRITE;
/*!40000 ALTER TABLE `sub_modules` DISABLE KEYS */;
INSERT INTO `sub_modules` VALUES
('0c0ba6e6-65c0-4ad1-adaa-8ed08e2f45f9','b04d298f-73a4-49a3-82f1-92d82b019f82','e9583ad0-e027-4486-9184-b4e4f2957d6b','Leads','crm_leads','/crm/leads',NULL,1,'ACTIVE',NULL,'2026-11-20 05:15:40.743','2026-11-20 05:15:40.743'),
('19361fd5-8ef7-4f3c-8efd-79ce236081d7','8db737b2-ee72-4be9-9f88-8392f0bd4aae','e9583ad0-e027-4486-9184-b4e4f2957d6b','Quotations','sales_quotations','/sales/quotations',NULL,1,'ACTIVE',NULL,'2026-11-20 05:15:40.762','2026-11-20 05:15:40.762'),
('28c9c733-1c1c-46f7-9b68-83d78c117fb5','05f15069-6d81-454a-990a-ab053561c903','e9583ad0-e027-4486-9184-b4e4f2957d6b','Price Management','price_management','/product/pricing',NULL,2,'ACTIVE',NULL,'2026-11-20 05:15:40.755','2026-11-20 05:15:40.755'),
('2a368796-19a0-4ea6-8adb-9a63825e2b70','b04d298f-73a4-49a3-82f1-92d82b019f82','e9583ad0-e027-4486-9184-b4e4f2957d6b','Follow-ups','crm_followups','/crm/followups',NULL,4,'ACTIVE',NULL,'2026-11-20 05:15:40.751','2026-11-20 05:15:40.751'),
('348e3d8e-b2a6-43ad-9bf4-2271e65623fe','8db737b2-ee72-4be9-9f88-8392f0bd4aae','e9583ad0-e027-4486-9184-b4e4f2957d6b','Sales Orders','sales_orders','/sales/orders',NULL,3,'ACTIVE',NULL,'2026-11-20 05:15:40.765','2026-11-20 05:15:40.765'),
('654cea1d-1ec2-4c25-82b4-8edbdcdc539b','05f15069-6d81-454a-990a-ab053561c903','e9583ad0-e027-4486-9184-b4e4f2957d6b','Product Master','product_master','/product/master',NULL,1,'ACTIVE',NULL,'2026-11-20 05:15:40.753','2026-11-20 05:15:40.753'),
('a38e7ebe-8e1f-4071-af92-8a41bb80b2d1','8db737b2-ee72-4be9-9f88-8392f0bd4aae','e9583ad0-e027-4486-9184-b4e4f2957d6b','Sales Reports','sales_reports','/sales/reports',NULL,4,'ACTIVE',NULL,'2026-11-20 05:15:40.767','2026-11-20 05:15:40.767'),
('a3d5757c-8c39-42bf-a3a3-40686bf9b369','8db737b2-ee72-4be9-9f88-8392f0bd4aae','e9583ad0-e027-4486-9184-b4e4f2957d6b','Proforma Invoices','sales_proforma_invoices','/sales/proforma-invoices',NULL,2,'ACTIVE',NULL,'2026-11-20 05:15:40.764','2026-11-20 05:15:40.764'),
('dbe7329e-de52-46a4-b713-f85f3f21335a','b04d298f-73a4-49a3-82f1-92d82b019f82','e9583ad0-e027-4486-9184-b4e4f2957d6b','Customers','crm_customers','/crm/customers',NULL,2,'ACTIVE',NULL,'2026-11-20 05:15:40.746','2026-11-20 05:15:40.746'),
('ece15a8b-885d-454e-a65a-cf26eec4b171','05f15069-6d81-454a-990a-ab053561c903','e9583ad0-e027-4486-9184-b4e4f2957d6b','Categories','categories','/products/categories',NULL,3,'ACTIVE',NULL,'2026-11-20 05:15:40.758','2026-11-20 05:15:40.758'),
('ed8ec3c2-50ac-411b-bd6e-6ff8d2810d2f','b04d298f-73a4-49a3-82f1-92d82b019f82','e9583ad0-e027-4486-9184-b4e4f2957d6b','Contacts','crm_contacts','/crm/contacts',NULL,3,'ACTIVE',NULL,'2026-11-20 05:15:40.747','2026-11-20 05:15:40.747');
/*!40000 ALTER TABLE `sub_modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription_plans`
--

DROP TABLE IF EXISTS `subscription_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscription_plans` (
  `id` char(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `billing_cycle` varchar(30) NOT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(10) NOT NULL DEFAULT 'INR',
  `max_leads` int(11) DEFAULT NULL,
  `max_employees` int(11) DEFAULT NULL,
  `max_lead_sources` int(11) DEFAULT NULL,
  `max_customers` int(11) DEFAULT NULL,
  `max_sales_orders` int(11) DEFAULT NULL,
  `max_products` int(11) DEFAULT NULL,
  `can_use_webhook` tinyint(1) NOT NULL DEFAULT 1,
  `can_use_indiamart` tinyint(1) NOT NULL DEFAULT 0,
  `can_use_meta` tinyint(1) NOT NULL DEFAULT 0,
  `can_use_email` tinyint(1) NOT NULL DEFAULT 0,
  `can_use_justdial` tinyint(1) NOT NULL DEFAULT 0,
  `can_use_sales_flow` tinyint(1) NOT NULL DEFAULT 1,
  `can_use_inventory` tinyint(1) NOT NULL DEFAULT 1,
  `can_use_reports` tinyint(1) NOT NULL DEFAULT 1,
  `can_use_audit_log` tinyint(1) NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_popular` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `subscription_plans_name_billing_cycle_key` (`name`,`billing_cycle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription_plans`
--

LOCK TABLES `subscription_plans` WRITE;
/*!40000 ALTER TABLE `subscription_plans` DISABLE KEYS */;
INSERT INTO `subscription_plans` VALUES
('0a89c538-787f-41a3-ab27-d6c882dc7c5f','Enterprise Unlimited','Unlimited leads, Meta Facebook/Instagram Ads, and full enterprise sales automation.','MONTHLY',9999.00,'INR',NULL,50,NULL,NULL,NULL,NULL,1,1,1,1,1,1,1,1,1,1,0,'2026-11-21 11:04:53.390','2026-11-21 11:04:53.390'),
('23fc9e30-be32-4dc0-9869-37dd1b50f48a','Growth Professional','Complete CRM for growing businesses with IndiaMART and multi-channel lead ingestion.','MONTHLY',4999.00,'INR',2500,15,4,500,250,200,1,1,0,1,1,1,1,1,1,1,1,'2026-11-21 11:04:53.386','2026-11-21 11:04:53.386'),
('36cc6204-6857-4987-8dae-f3debec04d72','Starter CRM','Ideal for small sales teams starting their lead pipeline.','MONTHLY',1999.00,'INR',500,5,2,100,50,50,1,0,0,1,0,1,0,1,1,1,0,'2026-11-21 11:04:53.372','2026-11-21 11:04:53.372'),
('5e565c4d-cf3f-4982-8477-b5c6c390ba33','Growth Professional','Best Value! Complete CRM with IndiaMART & Justdial. Save ~25% annually.','ANNUAL',44999.00,'INR',2500,15,4,500,250,200,1,1,0,1,1,1,1,1,1,1,1,'2026-11-21 11:04:53.389','2026-11-21 11:04:53.389'),
('6e30aed5-99d3-4e54-8943-28864f20c7cb','Enterprise Unlimited','VIP Enterprise: Unlimited leads, unlimited employees, all lead channels. Save ~25% annually.','ANNUAL',89999.00,'INR',NULL,NULL,NULL,NULL,NULL,NULL,1,1,1,1,1,1,1,1,1,1,0,'2026-11-21 11:04:53.393','2026-11-21 11:04:53.393'),
('91c3025d-61c8-42cf-a1ee-ef61ae6cdd35','aws','Nothing','MONTHLY',1000.00,'INR',1,1,1,NULL,NULL,NULL,1,0,0,0,0,1,1,1,1,1,0,'2026-11-24 10:24:30.391','2026-11-24 10:24:30.391'),
('b6f82c47-fadb-499e-b33d-d68239fef830','Growth Professional','Complete CRM with IndiaMART & Justdial. Save ~16% with 6-month commitment.','HALF_YEARLY',24999.00,'INR',2500,15,4,500,250,200,1,1,0,1,1,1,1,1,1,1,1,'2026-11-21 11:04:53.387','2026-11-21 11:04:53.387'),
('ddae2cdd-7ea9-4198-bf63-defa2368f540','Enterprise Unlimited','Unlimited leads & all integrations. Save ~16% with 6-month billing.','HALF_YEARLY',49999.00,'INR',NULL,50,NULL,NULL,NULL,NULL,1,1,1,1,1,1,1,1,1,1,0,'2026-11-21 11:04:53.392','2026-11-21 11:04:53.392'),
('f21b4de8-f39a-4d73-857e-6667efa2557e','Starter CRM','Ideal for small sales teams. Save ~25% with annual billing.','ANNUAL',17999.00,'INR',500,5,2,100,50,50,1,0,0,1,0,1,0,1,1,1,0,'2026-11-21 11:04:53.383','2026-11-21 11:04:53.383'),
('f447a998-2a18-4a53-9343-d29abd570c3d','Starter CRM','Ideal for small sales teams. Save ~16% with 6-month billing.','HALF_YEARLY',9999.00,'INR',500,5,2,100,50,50,1,0,0,1,0,1,0,1,1,1,0,'2026-11-21 11:04:53.382','2026-11-21 11:04:53.382');
/*!40000 ALTER TABLE `subscription_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `super_admins`
--

DROP TABLE IF EXISTS `super_admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `super_admins` (
  `id` char(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(180) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `last_login_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `super_admins_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `super_admins`
--

LOCK TABLES `super_admins` WRITE;
/*!40000 ALTER TABLE `super_admins` DISABLE KEYS */;
INSERT INTO `super_admins` VALUES
('9d121c09-aa56-4e63-b609-1ab9f9a11166','Platform Super Admin','admin@azzunique.com','$2b$10$BtKbTUHSvc/PQNB.34maUuwZ.RJQxbhEmwYmQ73nB6mEpk00d5RKS','ACTIVE',NULL,'2026-11-20 05:15:40.712','2026-11-20 05:15:40.712');
/*!40000 ALTER TABLE `super_admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendors` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `vendor_code` varchar(40) DEFAULT NULL,
  `name` varchar(180) NOT NULL,
  `legal_name` varchar(180) DEFAULT NULL,
  `contact` varchar(150) DEFAULT NULL,
  `email` varchar(180) DEFAULT NULL,
  `phone` varchar(40) DEFAULT NULL,
  `mobile` varchar(40) DEFAULT NULL,
  `category` varchar(100) NOT NULL DEFAULT 'Raw Materials',
  `tax_id` varchar(60) DEFAULT NULL,
  `pan` varchar(30) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `registered_address` text DEFAULT NULL,
  `billing_address` text DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `pincode` varchar(20) DEFAULT NULL,
  `contact_persons` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`contact_persons`)),
  `payment_terms` varchar(100) DEFAULT '30 Days',
  `credit_period_days` int(11) NOT NULL DEFAULT 30,
  `lead_time_days` int(11) NOT NULL DEFAULT 7,
  `bank_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`bank_details`)),
  `product_categories` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`product_categories`)),
  `rating` varchar(30) DEFAULT '5.0 ★',
  `status` varchar(30) NOT NULL DEFAULT 'ACTIVE',
  `approval_status` varchar(40) NOT NULL DEFAULT 'APPROVED',
  `approved_by_id` char(36) DEFAULT NULL,
  `approved_by_name` varchar(180) DEFAULT NULL,
  `approved_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vendors_company_id_vendor_code_key` (`company_id`,`vendor_code`),
  KEY `vendors_company_id_category_status_created_at_idx` (`company_id`,`category`,`status`,`created_at`),
  CONSTRAINT `vendors_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-25  7:55:15
