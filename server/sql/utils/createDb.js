
const mysql = require('mysql2/promise');
const {
    dropTablesQueries,
    createFamilyTableQuery,
    createFamilyRoomTableQuery,
    createFileTableQuery,
    createFightsTableQuery,
    createGuestTableQuery,
    createNotesTableQuery,
    createPaymentsTableQuery,
    createRoomsTableQuery,
    createUserRoomAssignmentsTableQuery,
    insertRoomsDataQuery,
  } = require("../query/trip_tracker_dump")
  
 const createDatabaseAndTable = async (vacationId) => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });
  const sanitizedVacationId = vacationId.replace(/[^a-zA-Z0-9_]/g, '_');
  try {

    await connection.query(`CREATE SCHEMA \`trip_tracker_${sanitizedVacationId}\``);

    // Use the created database with backticks around the schema name
    await connection.query(`USE \`trip_tracker_${sanitizedVacationId}\``);

    // Create table
    await connection.query(createFamilyTableQuery);
    await connection.query(createFamilyRoomTableQuery);
    await connection.query(createFileTableQuery);
    await connection.query(createFightsTableQuery);
    await connection.query(createGuestTableQuery);
    await connection.query(createNotesTableQuery);
    await connection.query(createPaymentsTableQuery);
    await connection.query(createRoomsTableQuery);
    await connection.query(createUserRoomAssignmentsTableQuery);
    await connection.query(insertRoomsDataQuery);

    console.log('Database and table created successfully');
  } catch (error) {
    console.error('Error creating database or table:', error);
  } finally {
    await connection.end();
  }
}

module.exports = createDatabaseAndTable;