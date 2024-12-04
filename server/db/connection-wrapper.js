const mysql = require("mysql2");

require("dotenv").config();



const dbConfiguration = (vacationId) => {
    return {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: vacationId === undefined ?  process.env.DB_NAME : `trip_tracker_${vacationId}`,
    };

};

const createConnection = (vacationId) => {
  const connection = mysql.createPool(dbConfiguration(vacationId));

  connection.getConnection((err) => {
    if (err) {
      console.log(`Failed to create connection: ${err.message}`);
      return;
    }
    console.log(`We're connected to MySQL, using database ${vacationId}`);
  });
  return connection;
};

function execute(sql, vacationId) {
  if(vacationId !== undefined){
    const formattedVacationId = vacationId.replace(/-/g, '_');  
    return new Promise((resolve, reject) => {
      const db = createConnection(formattedVacationId); // Create a new connection with the vacationId
      db.execute(sql, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
 
}

function executeWithParameters(sql, parameters, vacationId) {
  const formattedVacationId = vacationId.toString().replace(/-/g, '_');  
  return new Promise((resolve, reject) => {
    const db = createConnection(formattedVacationId); // Create a new connection with the vacationId
    db.execute(sql, parameters, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

// db.getConnection((err) => {
//   if (err) {

//     console.log(`Failed to create connection + " + err`)
//     return;
//   }
//  console.log("We're connected to MySQL");
// });

// function execute(sql) {
//   return new Promise((resolve, reject) => {
//     db.execute(sql, (err, result) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(result);
//     });
//   });
// }

// function executeWithParameters(sql, parameters) {
//   return new Promise((resolve, reject) => {
//     db.execute(sql, parameters, (err, result) => {
//       if (err) {
//         console.log("Failed interacting with DB, calling reject" + err)
//         reject(err);
//         return;
//       }
//       resolve(result);
//     });
//   });
// }

module.exports = {
  execute,
  executeWithParameters,
};
