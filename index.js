"use strict";
const { Pool } = require("pg");
const fs = require("fs");

const config = {
  connectionString:
    "postgres://candidate:62I8anq3cFq5GYh2u4Lh@rc1b-r21uoagjy1t7k77h.mdb.yandexcloud.net:6432/db1",
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("/home/cat/.postgresql/root.crt").toString(),
  },
};

// проверка на локальной машине
// const config = {
//   connectionString:
//     "postgres://postgres:1111@localhost:5432/nikita23t",
// };

const pool = new Pool(config);

const createTableQuery = `CREATE TABLE IF NOT EXISTS nikita23t (id SERIAL PRIMARY KEY, name TEXT, data JSONB)`;

//это для проверки создания бд на облаке
//const createTableQuery = `DROP TABLE nikita23t`;

//функция создания и проверки наличия таблицы в бд
async function createTable() {
  try {
    await pool.query(createTableQuery);
  } catch (error) {
    console.error('Error creating table', error);
  }
}

//функция изъятия данных из апи и помещания в бд
async function insertData() {
  const response = await fetch('https://rickandmortyapi.com/api/character');
  const jsonResponse = await response.json();
  const results = jsonResponse.results;

  for (const result of results) {
    const name = result.name;
    const data = JSON.stringify(result);

    try {
      const query = `INSERT INTO nikita23t (name, data) VALUES ($1, $2)`;
      const values = [name, data];
      await pool.query(query, values);
    } catch (error) {
      console.error('Error executing query', error);
    }
  }
}

//функция отображения данных из бд в консоль для проверки
async function getDataFromTable() {
  try {
    const query = 'SELECT * FROM nikita23t';
    const { rows } = await pool.query(query);
    console.table(rows);
  } catch (error) {
    console.error('Error executing query', error);
  }
}

//функция выполнения всех асинхронных функций
async function main() {
  await createTable();
  await insertData();
  await getDataFromTable();
}

main();