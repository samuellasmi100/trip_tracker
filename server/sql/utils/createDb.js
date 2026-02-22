
const mysql = require('mysql2/promise');
const {
  dropTablesQueries,
  createFamilyTableQuery,
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
  createIncomeCategoryTable,
  insertIncomeCategoryQuery,
  createIncomeSubCategoryTable,
  createIncomeTable,
  createLeadsTableQuery,
  createLeadNotesTableQuery,
  createFamilyDocumentTypesTableQuery,
  insertFamilyDocumentTypesQuery,
  createFamilyDocumentsTableQuery,
  createFamilySignaturesTableQuery,
  createStaffTableQuery,
  createVehiclesTableQuery,
} = require("../query/trip_tracker_dump")

const createDatabaseAndTable = async (vacationId) => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  try {

    await connection.query(`CREATE SCHEMA \`trip_tracker_${vacationId}\``);

    // Use the created database with backticks around the schema name
    await connection.query(`USE \`trip_tracker_${vacationId}\``);

    // Create table
    await connection.query(createFamilyTableQuery);
    await connection.query(createFightsTableQuery);
    await connection.query(createGuestTableQuery);
    await connection.query(createNotesTableQuery);
    await connection.query(createPaymentsTableQuery);
    await connection.query(createRoomsTableQuery);
    await connection.query(createUserRoomAssignmentsTableQuery);
    await connection.query(insertRoomsDataQuery);
    await connection.query(createRoomTakenTable);
    await connection.query(createExpensesCategoryTable);
    await connection.query(insertExpensesCategoryQuery);
    await connection.query(createExpensesSubCategoryTable);
    await connection.query(insertExpensesSubCategoryQuery);
    await connection.query(createFutureExpensesTable)
    await connection.query(createExpensesTable)
    await connection.query(createExchangeRatesTable)
    await connection.query(createIncomeCategoryTable)
    await connection.query(insertIncomeCategoryQuery)
    await connection.query(createIncomeSubCategoryTable)
    await connection.query(createIncomeTable)
    await connection.query(createLeadsTableQuery)
    await connection.query(createLeadNotesTableQuery)
    await connection.query(createFamilyDocumentTypesTableQuery)
    await connection.query(insertFamilyDocumentTypesQuery)
    await connection.query(createFamilyDocumentsTableQuery)
    await connection.query(createFamilySignaturesTableQuery)
    await connection.query(createStaffTableQuery)
    await connection.query(createVehiclesTableQuery)
    console.log('Database and table created successfully');
  } catch (error) {
    console.error('Error creating database or table:', error);
  } finally {
    await connection.end();
  }
}

module.exports = createDatabaseAndTable;