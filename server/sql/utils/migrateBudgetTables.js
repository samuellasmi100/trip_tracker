const mysql = require("mysql2/promise");
const {
  createIncomeCategoryTable,
  insertIncomeCategoryQuery,
  createIncomeSubCategoryTable,
  createIncomeTable,
} = require("../query/trip_tracker_dump");

const migrateBudgetTables = async () => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });

    // Get all vacation databases
    const [rows] = await connection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME LIKE 'trip_tracker_%' AND SCHEMA_NAME != 'trip_tracker'`
    );

    for (const row of rows) {
      const schema = row.SCHEMA_NAME;
      try {
        await connection.query(`USE \`${schema}\``);

        // Check if income table already exists
        const [tables] = await connection.query(
          `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'income'`,
          [schema]
        );

        if (tables.length === 0) {
          console.log(`Migrating budget tables for: ${schema}`);
          await connection.query(createIncomeCategoryTable);
          await connection.query(insertIncomeCategoryQuery);
          await connection.query(createIncomeSubCategoryTable);
          await connection.query(createIncomeTable);
          console.log(`Migration complete for: ${schema}`);
        }
      } catch (err) {
        console.error(`Error migrating ${schema}:`, err.message);
      }
    }
  } catch (error) {
    console.error("Migration error:", error.message);
  } finally {
    if (connection) await connection.end();
  }
};

module.exports = migrateBudgetTables;
