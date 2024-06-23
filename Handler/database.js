const Database = require('better-sqlite3');
const db = new Database('./Utils/Database/database.db');
const config = require('../config.js')

module.exports = () => {
    db.exec(`CREATE TABLE IF NOT EXISTS bot (
        id TEXT DEFAULT NULL,
        activity TEXT DEFAULT '{"name": "By /uhq", "type": "5", "status": "online" }',
        owners TEXT DEFAULT '[]'
    )`);
    db.exec(`CREATE TABLE IF NOT EXISTS user (
        id TEXT DEFAULT NULL,
        jetons TEXT DEFAULT '0',
        timeInVoc TEXT DEFAULT '7200000'
    )`);

    db.exec(`CREATE TABLE IF NOT EXISTS guild (
        id TEXT DEFAULT NULL,
        apikey TEXT DEFAULT NULL, 
        items TEXT DEFAULT '[]',
        color TEXT DEFAULT 'Red',
        duration TEXT DEFAULT '7200000',
        logs TEXT DEFAULT NULL,
        msg TEXT DEFAULT NULL
    )`);
    return db;
}
