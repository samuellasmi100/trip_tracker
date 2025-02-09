const dropTablesQueries = [
  "DROP TABLE IF EXISTS `families`",
  "DROP TABLE IF EXISTS `family_room_details`;",
  "DROP TABLE IF EXISTS `files`;",
  "DROP TABLE IF EXISTS `flights`;",
  "DROP TABLE IF EXISTS `guest`;",
  "DROP TABLE IF EXISTS `notes`",
  "DROP TABLE IF EXISTS `payments`;",
  "DROP TABLE IF EXISTS `rooms`;",
  "DROP TABLE IF EXISTS `user`;",
  "DROP TABLE IF EXISTS `user_room_assignments`;",
];

const createFamilyTableQuery = `
 CREATE TABLE families (
  id int NOT NULL AUTO_INCREMENT,
  family_id varchar(45) NOT NULL,
  family_name varchar(45) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`;

const createFileTableQuery = `
 CREATE TABLE files (
  id int NOT NULL AUTO_INCREMENT,
  filename text NOT NULL,
  fileType text NOT NULL,
  filePath text NOT NULL,
  family_id varchar(455) DEFAULT NULL,
  uploadedAt datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`;

const createFightsTableQuery = `
CREATE TABLE flights (
  id int NOT NULL AUTO_INCREMENT,
  child_id varchar(45) DEFAULT NULL,
  validity_passport varchar(45) DEFAULT NULL,
  passport_number varchar(45) DEFAULT NULL,
  birth_date varchar(45) DEFAULT NULL,
  outbound_flight_date varchar(45) DEFAULT NULL,
  return_flight_date varchar(45) DEFAULT NULL,
  outbound_flight_number varchar(45) DEFAULT NULL,
  age varchar(45) DEFAULT NULL,
  parent_id varchar(45) DEFAULT NULL,
  return_flight_number varchar(45) DEFAULT NULL,
  family_id varchar(45) DEFAULT NULL,
  outbound_airline varchar(45) DEFAULT NULL,
  return_airline varchar(45) DEFAULT NULL,
  is_source_user tinyint DEFAULT '0',
  user_id varchar(45) DEFAULT NULL,
  user_classification VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`;

const createGuestTableQuery = `
CREATE TABLE guest (
  id int NOT NULL AUTO_INCREMENT,
  user_id varchar(455) DEFAULT NULL,
  hebrew_first_name varchar(45) DEFAULT NULL,
  hebrew_last_name varchar(45) DEFAULT NULL,
  english_first_name varchar(55) DEFAULT NULL,
  english_last_name varchar(45) DEFAULT NULL,
  phone_a varchar(45) DEFAULT NULL,
  phone_b varchar(45) DEFAULT NULL,
  email varchar(45) DEFAULT NULL,
  identity_id varchar(45) DEFAULT NULL,
  family_id varchar(45) NOT NULL,
  flights varchar(45) DEFAULT NULL,
  number_of_guests varchar(45) DEFAULT NULL,
  number_of_rooms varchar(45) DEFAULT NULL,
  total_amount varchar(45) DEFAULT NULL,
  flights_direction varchar(45) DEFAULT NULL,
  flying_with_us tinyint DEFAULT '1',
  is_main_user tinyint DEFAULT '0',
  user_type varchar(45) DEFAULT NULL,
  is_in_group tinyint DEFAULT '0',
  arrival_date varchar(45) DEFAULT '""',
  departure_date varchar(45) DEFAULT '""',
  address varchar(45) DEFAULT '""',
  week_chosen VARCHAR(45) NULL DEFAULT NULL,
  date_chosen VARCHAR(45) NULL DEFAULT NULL,
  age VARCHAR(45) NULL DEFAULT NULL,
  birth_date VARCHAR(45) NULL DEFAULT NULL,
  number_of_payments VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`;

const createNotesTableQuery = `
CREATE TABLE notes (
  id int NOT NULL AUTO_INCREMENT,
  parent_id varchar(455) DEFAULT NULL,
  note varchar(999) DEFAULT NULL,
  child_id varchar(455) DEFAULT NULL,
  family_id varchar(45) DEFAULT NULL,
  category_name varchar(45) DEFAULT NULL,
  user_id varchar(455) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
`;

const createPaymentsTableQuery = `
 CREATE TABLE payments (
   id int NOT NULL AUTO_INCREMENT,
   payment_date varchar(45) NOT NULL,
   amount varchar(45) NOT NULL,
   form_of_payment varchar(45) NOT NULL,
   remains_to_be_paid varchar(45) DEFAULT NULL,
   payment_currency varchar(45) NOT NULL,
   amount_received varchar(45) DEFAULT NULL,
   family_id varchar(45) DEFAULT NULL,
   created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   user_id varchar(45) DEFAULT NULL,
   invoice tinyint DEFAULT '0',
   is_paid tinyint DEFAULT '0',
   updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP
   PRIMARY KEY (id)
 ) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`;

const createRoomsTableQuery = `
CREATE TABLE rooms (
  id int NOT NULL AUTO_INCREMENT,
  rooms_id varchar(45) NOT NULL,
  type varchar(45) NOT NULL,
  floor varchar(45) NOT NULL,
  size varchar(45) NOT NULL,
  direction varchar(45) DEFAULT NULL,
  is_taken varchar(455) DEFAULT NULL,
  base_occupancy varchar(45) DEFAULT NULL,
  max_occupancy varchar(45) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`;

const createUserRoomAssignmentsTableQuery = `
CREATE TABLE user_room_assignments (
  id int NOT NULL AUTO_INCREMENT,
  room_id varchar(45) NOT NULL,
  family_id varchar(45) DEFAULT NULL,
  user_id varchar(45) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`;

const insertRoomsDataQuery = `
 INSERT INTO rooms VALUES (1,'101','סוויטה AP','1','140','טפט',0,'4',NULL),(2,'102','DLX','1','80','טפט',0,'4',NULL),(3,'103','EXE','1','100','טפט',0,'4',NULL),(4,'104','EXE','1','100','טפט',0,'4',NULL),(5,'105','EXE','1','100','טפט יער',0,'4',NULL),(6,'110','DLX','1','80','חניה',0,'4',NULL),(7,'111','DLX','1','80','חניה',0,'4',NULL),(8,'112','DLX','1','80','חניה',0,'4',NULL),(9,'113','DLX','1','80','חניה',0,'4',NULL),(10,'114','DLX','1','80','חניה',0,'4',NULL),(11,'115','DLX','1','80','חניה',0,'4',NULL),(12,'116','סוויטה AP','1','140','חניה',0,'4',NULL),(13,'201','סוויטה AP','2','140','חניה',0,'4',NULL),(14,'202','DLX','2','80','טפט',0,'4',NULL),(15,'203','DLX','2','80','טפט',0,'4',NULL),(16,'204','DLX','2','80','טפט',0,'4',NULL),(17,'205','EXE','2','100','טפט',0,'4',NULL),(18,'206','EXE','2','100','טפט',0,'4',NULL),(19,'207','EXE','2','100','אגם',0,'4',NULL),(20,'208','סוויטה AP','2','140','אגם',0,'4',NULL),(21,'209','סוויטה AP','2','140','אגם',0,'4',NULL),(22,'210','DLX','2','80','יער',0,'4',NULL),(23,'211','DLX','2','80','יער',0,'4',NULL),(24,'212','DLX','2','80','יער',0,'4',NULL),(25,'213','DLX','2','80','יער',0,'4',NULL),(26,'214','DLX','2','80','יער',0,'4',NULL),(27,'215','DLX','2','80','יער',0,'4',NULL),(28,'216','DLX','2','80','יער',0,'4',NULL),(29,'217','סוויטה AP','2','140','יער',0,'4',NULL),(30,'301','סוויטה AP','3','140','טפט',0,'4',NULL),(31,'302','DLX','3','80','טפט',0,'4',NULL),(32,'303','DLX','3','80','טפט',0,'4',NULL),(33,'304','DLX','3','80','טפט',0,'4',NULL),(34,'305','EXE','3','100','טפט',0,'4',NULL),(35,'306','EXE','3','100','אגם',0,'4',NULL),(36,'307','EXE','3','100','אגם',0,'4',NULL),(37,'308','סוויטה AP','3','140','אגם',0,'4',NULL),(38,'309','סוויטה AP','3','140','אגם',0,'4',NULL),(39,'310','DLX','3','80','יער',0,'4',NULL),(40,'311','DLX','3','80','יער',0,'4',NULL),(41,'312','DLX','3','80','יער',0,'4',NULL),(42,'313','DLX','3','80','יער',0,'4',NULL),(43,'314','DLX','3','80','יער',0,'4',NULL),(44,'315','DLX','3','80','יער',0,'4',NULL),(45,'316','DLX','3','80','יער',0,'4',NULL),(46,'317','סוויטה AP','3','140','יער',0,'4',NULL),(63,'401','סוויטה AP','4','140','אגם',0,'4',NULL),(64,'402','DLX','4','80','אגם',0,'4',NULL),(65,'403','EXE','4','100','אגם',0,'4',NULL),(66,'404','EXE','4','100','אגם',0,'4',NULL),(67,'405','EXE','4','100','אגם',0,'4',NULL),(68,'406','EXE','4','100','אגם',0,'4',NULL),(69,'407','EXE','4','100','אגם',0,'4',NULL),(70,'408','סוויטה AP','4','140','אגם',0,'4',NULL),(71,'409','סוויטה AP','4','140','אגם',0,'4',NULL),(72,'410','DLX','4','80','יער',0,'4',NULL),(73,'411','DLX','4','80','יער',0,'4',NULL),(74,'412','DLX','4','80','יער',0,'4',NULL),(75,'413','DLX','4','80','יער',0,'4',NULL),(76,'414','DLX','4','80','יער',0,'4',NULL),(77,'415','DLX','4','80','יער',0,'4',NULL),(78,'416','DLX','4','80','יער',0,'4',NULL),(79,'417','סוויטה AP','4','140','יער',0,'4',NULL),(80,'501','סוויטה AP','5','140','אגם',0,'4',NULL),(81,'502','SUP','5','60','אגם',0,'2',NULL),(82,'503','SUP','5','60','אגם',0,'2',NULL),(83,'504','SUP','5','60','אגם',0,'2',NULL),(84,'505','SUP','5','60','אגם',0,'2',NULL),(85,'506','SUP','5','60','אגם',0,'2',NULL),(86,'507','SUP','5','60','אגם',0,'2',NULL),(87,'508','סוויטת DELUX','5','220','אגם',0,'4',NULL),(88,'509','SUP','5','60','יער',0,'2',NULL),(89,'510','SUP','5','60','יער',0,'2',NULL),(90,'511','SUP','5','60','יער',0,'2',NULL),(91,'512','SUP','5','60','יער',0,'2',NULL),(92,'513','SUP','5','60','יער',0,'2',NULL),(93,'514','SUP','5','60','יער',0,'2',NULL),(94,'515','סוויטה AP','6','140','יער',0,'4',NULL),(95,'601','סוויטה DELUX','6','200','אגם',0,'4',NULL),(96,'602','סוויטה DELUX','6','200','אגם',0,'4',NULL),(97,'603','סוויטה DELUX','6','200','אגם',0,'4',NULL),(98,'604','סוויטה DELUX','6','200','יער',0,'4',NULL),(99,'605','סוויטה DELUX','6','200','יער',0,'4',NULL),(100,'606','סוויטה DELUX','6','200','יער',0,'4',NULL);
`;

const createRoomTakenTable = `
 CREATE TABLE room_taken (
  id int NOT NULL AUTO_INCREMENT,
  family_id varchar(45) NOT NULL,
  start_date varchar(45) NOT NULL,
  end_date varchar(45) NOT NULL,
  room_id varchar(45) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`;

const createExpensesCategoryTable = `
 CREATE TABLE expenses_category (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(45) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`;

const insertExpensesCategoryQuery = `
INSERT INTO expenses_category VALUES (1,'אירוח'),(2,'טיסות והעברות'),(3,'משרד כללי'),(4,'רכוש קבוע'),(5,'משכורות'),(6,'טיולים');
`;

const createExpensesSubCategoryTable = `
 CREATE TABLE expenses_sub_category (
  id int NOT NULL AUTO_INCREMENT,
  expenses_category_id varchar(45) DEFAULT NULL,
  name varchar(45) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`;

const insertExpensesSubCategoryQuery = `
INSERT INTO expenses_sub_category VALUES (1,'1','מלון'),(2,'2','טיסות כללי'),(3,'2','טיסות קבוצה אל על '),(4,'2','העברות'),(5,'6','אוטובוסים'),(6,'6','טיולים כניסות'),(7,'1','קונטיינר'),(8,'1','בשר'),(9,'1','עופות '),(10,'1','דגים'),(11,'1','שלומוביץ חלבי'),(12,'2','הובלות קונטיינר'),(13,'1','הובלות אירופה'),(14,'1','משאית קירור '),(15,'3','רכב'),(16,'1','אומנים מקומיים'),(17,'1','אומנים'),(18,'1','הגברה'),(19,'1','שוק מקומי'),(20,'1','מטבח רכוש'),(21,'1','צוות מטבח'),(22,'1','שף'),(23,'1','מחסנאי'),(24,'1','קונדיטור'),(25,'1','משגיח'),(26,'2','טיסות צוות'),(27,'6','מדריך'),(28,'1','מארחת'),(29,'3','תהילה'),(30,'1','כשרות'),(31,'3','פרסום'),(32,'3','משרד'),(33,'5','משכורות'),(34,'2','טיסות קבוצה hisky'),(35,'2','העברות פרטיות'),(36,'6','חניות');

`;
const createFutureExpensesTable = `
CREATE TABLE future_expenses (
  id int NOT NULL AUTO_INCREMENT,
  expenditure varchar(45) DEFAULT NULL,
  payment_currency varchar(45) DEFAULT NULL,
  expenses_category_id varchar(45) DEFAULT NULL,
  expenses_sub_category_id varchar(45) DEFAULT NULL,
  payment_date varchar(45) DEFAULT NULL,
  expenditure_ils varchar(45) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`;

const createExpensesTable = `
CREATE TABLE expenses (
  id int NOT NULL AUTO_INCREMENT,
  expenditure varchar(45) DEFAULT NULL,
  payment_currency varchar(45) DEFAULT NULL,
  expenses_category_id varchar(45) DEFAULT NULL,
  expenses_sub_category_id varchar(45) DEFAULT NULL,
  payment_date varchar(45) DEFAULT NULL,
  expenditure_ils varchar(45) DEFAULT NULL,
  is_paid tinyint DEFAULT '0',
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`;


const createExchangeRatesTable = `
CREATE TABLE exchange_rates (
  id int NOT NULL AUTO_INCREMENT,
  ccy varchar(45) DEFAULT NULL,
  amount varchar(45) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`;



module.exports = {
  dropTablesQueries,
  createFamilyTableQuery,
  createFileTableQuery,
  createFightsTableQuery,
  createGuestTableQuery,
  createNotesTableQuery,
  createPaymentsTableQuery,
  createRoomsTableQuery,
  createUserRoomAssignmentsTableQuery,
  insertRoomsDataQuery,
  createRoomTakenTable,
  createExpensesCategoryTable,
  insertExpensesCategoryQuery,
  createExpensesSubCategoryTable,
  insertExpensesSubCategoryQuery,
  createFutureExpensesTable,
  createExpensesTable,
  createExchangeRatesTable,
};
