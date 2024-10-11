// models/User.js
const db = require('../config/db');

const User = {
  create: async (email, company, tradeid, activity) => {
    const sql = 'INSERT INTO mvmembers (email, password ,company , tradeid) VALUES (?, ?, ?, ?)';
    const result = await db.query(sql, [email, company, tradeid, activity]);
    return result.insertId;
  },
  eventRegisterationQuery: async (email, company, phone, rollup, food) => {
    const QUERY = `INSERT INTO mveventregister(email, company, phone, rollup, food) VALUES(?,?,?,?,?)`;

    const result = await db.query(QUERY, [email, company, phone, rollup, food]);
    return result.insertId;
  },
  createMemberProfileQuery: async (firstname, lastname, email, image, company, work, url, address) => {
    const QUERY = `INSERT INTO mvprofile(firstname, lastname, email, image, company, work, url, address) VALUES(?,?,?,?,?,?,?,?)`;

    const result = await db.query(QUERY, [firstname, lastname, email, image, company, work, url, address]);
    return result.insertId;
  },


  login: async (email, password) => {
    const sql = 'SELECT * FROM mvmembers WHERE email = ? AND password = ?';
    const users = await db.query(sql, [email, password]);
    // console.log(users);
    return users[0];
  },

  findByEmail: async (email) => {
    const sql = 'SELECT * FROM mvmembers WHERE email = ?';
    const users = await db.query(sql, [email]);
    return users[0];
  },

  findByEmailEventReg: async (email) => {
    const sql = 'SELECT * FROM mveventregister WHERE email = ?';
    const users = await db.query(sql, [email]);
    return users[0];
  },

  findByEmailProfile: async (email) => {
    const sql = 'SELECT * FROM mvprofile WHERE email = ?';
    const users = await db.query(sql, [email]);
    return users[0];
  },

  findById: async (id) => {
    const sql = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
    const users = await db.query(sql, [id]);
    return users[0];
  },

  getAll: async () => {
    const sql = 'SELECT * FROM mvmembers';
    return await db.query(sql);
  },

  getAllJobPostQuery: async () => {
    const sql = 'SELECT * FROM mvjobpost';
    return await db.query(sql);
  },

  searchMemberQuery: async (work) => {
 
    const keywords = work.split(' ').filter(keyword => keyword.trim() !== '');
  
    const whereClauses = keywords.map(keyword => `work LIKE ?`).join(' OR ');
  const queryParams = keywords.map(keyword => `%${keyword}%`);
  
  const QUERY = `SELECT * FROM mvprofile WHERE ${whereClauses}`;
    return await db.query(QUERY, queryParams);
  },

  getJobPostByEmailQuery: async (email) => {

  const QUERY = `SELECT * FROM mvjobpost WHERE email = ?`;
    return await db.query(QUERY, [email]);
  },

  getBannerByEmailQuery: async (email) => {

    const QUERY = `SELECT * FROM mvbanners WHERE email = ?`;
      return await db.query(QUERY, [email]);
    },

  getCvByEmailQuery: async (email) => {

        const QUERY = `SELECT * FROM mvcvs WHERE email = ?`;
          return await db.query(QUERY, [email]);
    },

  getProfileByEmailQuery: async (email) => {

    const QUERY = `SELECT * FROM mvprofile WHERE email = ?`;
      return await db.query(QUERY, [email]);
    },

  update: async (id, username, email, password) => {
    let sql = 'UPDATE users SET username = ?, email = ?';
    const params = [username, email];

    if (password) {
      sql += ', password = ?';
      params.push(password);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    const result = await db.query(sql, params);
    return result.affectedRows;
  },

  delete: async (id) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    const result = await db.query(sql, [id]);
    return result.affectedRows;
  },
};

module.exports = User;
