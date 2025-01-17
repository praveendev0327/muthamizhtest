// models/User.js
const db = require("../config/db");
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
app.use(cors());
const server = http.createServer(app);
// const io = require("../app");
// const socketIo = require("socket.io");
// AutoBoard
// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity; adjust in production
    methods: ["GET", "POST"],
  },
});

 // Handle Socket.IO Connections
 io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  // Optionally, send the latest image upon connection
  const query = 'SELECT email FROM autoboard ORDER BY id DESC LIMIT 1';
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching latest image:', err);
          return;
      }
      if (results.length > 0) {
        console.error(' fetching latest image:', results[0]);
          socket.emit('newImage', { imageUrl: results[0].email });
      }
  });

  socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
  });
   });



const User = {
  create: async (email, company, tradeid, activity) => {
    const sql =
      "INSERT INTO mvmembers (email, password ,company , tradeid) VALUES (?, ?, ?, ?)";
    const result = await db.query(sql, [email, company, tradeid, activity]);
    return result.insertId;
  },
  eventRegisterationQuery: async (email, company, phone, rollup, food) => {
    const QUERY = `INSERT INTO mveventregister(email, company, phone, rollup, food) VALUES(?,?,?,?,?)`;

    const result = await db.query(QUERY, [email, company, phone, rollup, food]);
    return result.insertId;
  },
  luckydrawRegisterationQuery: async (name, email,  phone) => {
    const QUERY = `INSERT INTO luckydraw(name, email,  phone) VALUES(?,?,?)`;

    const result = await db.query(QUERY, [name, email,  phone]);
    return result.insertId;
  },
  BBARegisterationQuery: async (name, email,  phone) => {
    const QUERY = `INSERT INTO brightboardads(name, email,  phone) VALUES(?,?,?)`;

    const result = await db.query(QUERY, [name, email,  phone]);
    return result.insertId;
  },
  createMemberProfileQuery: async (
    firstname,
    lastname,
    email,
    image,
    company,
    work,
    url,
    address
  ) => {
    const QUERY = `INSERT INTO mvprofile(firstname, lastname, email, image, company, work, url, address) VALUES(?,?,?,?,?,?,?,?)`;

    const result = await db.query(QUERY, [
      firstname,
      lastname,
      email,
      image,
      company,
      work,
      url,
      address,
    ]);
    return result.insertId;
  },
  createBannerByEmailQuery: async (email, image) => {
    const QUERY = `INSERT INTO mvbanners(email, image) VALUES(?,?)`;

    const result = await db.query(QUERY, [email, image]);
    return result.insertId;
  },
  createJobPostByEmailQuery: async (email, title, description) => {
    const QUERY = `INSERT INTO mvjobpost(email, title, description) VALUES(?,?,?)`;

    const result = await db.query(QUERY, [email, title, description]);
    return result.insertId;
  },

  //AutoBoard
  createAutoBoardBannerQuery: async (email, image) => {
    const QUERY = `INSERT INTO autoboard(email, image) VALUES(?,?)`;
        // Emit event to all connected clients
        io.emit("newImage", { email });
        // Respond to admin app
    const result = await db.query(QUERY, [email, image]);
    return result.insertId;
  },

 

  createCvByEmailQuery: async (email, name, cv) => {
    const QUERY = `INSERT INTO mvcvs(email, name, cv) VALUES(?,?,?)`;

    const result = await db.query(QUERY, [email, name, cv]);
    return result.insertId;
  },

  login: async (email, password) => {
    const sql = "SELECT * FROM mvmembers WHERE email = ? AND password = ?";
    const users = await db.query(sql, [email, password]);
    // console.log(users);
    return users[0];
  },

  findByEmail: async (email) => {
    const sql = "SELECT * FROM mvmembers WHERE email = ?";
    const users = await db.query(sql, [email]);
    return users[0];
  },

  findByEmailEventReg: async (email) => {
    const sql = "SELECT * FROM mveventregister WHERE email = ?";
    const users = await db.query(sql, [email]);
    return users[0];
  },

  findByEmailLuckydrawReg: async (email) => {
    const sql = "SELECT * FROM samyuktha WHERE email = ?";
    const users = await db.query(sql, [email]);
    return users[0];
  },

  findByEmailRegBBA: async (email) => {
    const sql = "SELECT * FROM brightboardads WHERE email = ?";
    const users = await db.query(sql, [email]);
    return users[0];
  },

  findByEmailProfile: async (email) => {
    const sql = "SELECT * FROM mvprofile WHERE email = ?";
    const users = await db.query(sql, [email]);
    return users[0];
  },

  findById: async (id) => {
    const sql =
      "SELECT id, username, email, created_at FROM users WHERE id = ?";
    const users = await db.query(sql, [id]);
    return users[0];
  },

  getAll: async () => {
    const sql = "SELECT * FROM mvmembers";
    return await db.query(sql);
  },

  getAllJobPostQuery: async () => {
    const sql = "SELECT * FROM mvjobpost";
    return await db.query(sql);
  },

  searchMemberQuery: async (work) => {
    const keywords = work.split(" ").filter((keyword) => keyword.trim() !== "");

    const whereClauses = keywords.map((keyword) => `work LIKE ?`).join(" OR ");
    const queryParams = keywords.map((keyword) => `%${keyword}%`);

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
    let sql = "UPDATE users SET username = ?, email = ?";
    const params = [username, email];

    if (password) {
      sql += ", password = ?";
      params.push(password);
    }

    sql += " WHERE id = ?";
    params.push(id);

    const result = await db.query(sql, params);
    return result.affectedRows;
  },

  delete: async (id) => {
    const sql = "DELETE FROM users WHERE id = ?";
    const result = await db.query(sql, [id]);
    return result.affectedRows;
  },
};

module.exports = User;
