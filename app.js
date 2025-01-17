// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
//
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());
// Middleware
// Store the current text and connected clients
let currentText = '';
const clients = [];
const selectclients = [];
// let currentText = '';


app.use(express.json());

// Configure Nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use 'gmail' or other email service
  auth: {
    user: 'muthamizhsangamevent2024@gmail.com', // Your email
    pass: 'yuaj fjjp nxgm oizo', // Your email password (use App Passwords for better security)
  },
});

  const transporterBBA = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' or other email service
    auth: {
      user: 'praveensubramaniyandev@gmail.com', // Your email
      pass: 'brlu rflo phjn sllt', // Your email password (use App Passwords for better security)
    },
  });

  // API endpoint to send an email
app.post('/send-email', (req, res) => {
    const { to, subject, name } = req.body;


    const emailBody = `
Dear ${name},

Thank you for registering for our exciting Lucky Draw! We are thrilled to have you on board. Your participation brings us one step closer to an exhilarating event.

This lucky draw is proudly sponsored by the Pannaiyar Team, dedicated to bringing you unique and rewarding experiences. Your participation not only makes this event more special but also supports us in our goal to continue offering memorable experiences and prizes to our community.

Download the app now and enjoy a 5% discount on your purchase!

ANDROID : https://play.google.com/store/apps/details?id=com.naveensankar.pannaiyar&pcampaignid=web_share

IPHONE :  https://apps.apple.com/in/app/pannaiyar/id6478814248

Here are the details you need to know:

- **Event Date:** November 3
- **Time:** 6 PM
- **Venue:** Al Nasr Leisureland, Oud Metha Dubai.
- **Prize:** Exciting prizes await, including gold coins, gift vouchers, and more!

Stay tuned for more updates as we approach the event date. Don’t miss your chance to win amazing prizes!

If you have any questions, feel free to reach out.

Best of luck!

Warm regards,
Pannaiyar Team
`;
  
    const mailOptions = {
      from: 'muthamizhsangamevent2024@gmail.com',
      to,
      subject,
      text: emailBody,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error",error);
        return res.status(500).send(error.toString());
      }
    //   console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent: ' + info.response);
    });
  });
  

  app.post('/send-email-BBA', (req, res) => {
    const { to, subject, name } = req.body;


    const emailBody = `
Dear ${name},

Thank you for registering with BrightBoardAds! We’re excited to have you onboard and look forward to supporting your digital advertising needs.

Our team will be reaching out within the next five working days to guide you through the software setup process. If you have any specific requirements or questions in the meantime, please feel free to reach out to us.

Thank you once again for choosing BrightBoardAds. We’re here to ensure you have a seamless experience!

Best regards,
The BrightBoardAds Team
`;
  
    const mailOptions = {
      from: 'praveensubramaniyandev@gmail.com',
      to,
      subject,
      text: emailBody,
    };
  
    transporterBBA.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error",error);
        return res.status(500).send(error.toString());
      }
    //   console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent: ' + info.response);
    });
  });

app.post('/upload', (req, res) => {
   
    const { email, name, phone} = req.body;
    // Insert image URL into MySQL
    const query = `INSERT INTO autoboard(email, name, phone) VALUES(?,?,?)`;
    // currentText = email; // Update currentText variable
  
    db.query(query, [email, name, phone], (err, result) => {
        if (err) {
            console.error('Error inserting image URL into database:', err);
            return res.status(500).json({ message: 'Database error.' });
        }

        res.status(200).json({ message: 'Uploaded successfully.', email });
    });
});

let clientss = [];

// SSE endpoint for client
app.get('/selectevents', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    clientss.push(res); // Add client connection

    // Send a keep-alive message every 30 seconds to avoid disconnection
    const keepAlive = setInterval(() => {
        res.write(`data: keep-alive\n\n`);
    }, 30000);

    // Remove client when disconnected
    req.on('close', () => {
        clearInterval(keepAlive);
        clientss = clientss.filter(client => client !== res);
    });
});

// Function to broadcast events to all connected clients
function sendEventToClients(randomEmail) {
  console.log(`Sending event to clients: ${randomEmail}`);
  clientss.forEach(client => {
        // client.write(`data: ${JSON.stringify({ email: randomEmail })}\n\n`);
        client.write(`data: ${JSON.stringify({ data: randomEmail })}\n\n`);
    });
}

// Admin app - fetch random email and trigger event
app.post('/select-email', (req, res) => {
    // Query to fetch a random email from the autoboard table
    db.query('SELECT * FROM samyuktha ORDER BY RAND() LIMIT 1', (error, results) => {
        if (error) throw error;
        const randomEmail = results[0];

        // Broadcast the random email to all clients
        sendEventToClients(randomEmail);
        res.status(200).json({ email: randomEmail });
    });
});


// Routes Middleware
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);



// Root Endpoint
app.get('/', (req, res) => {
  res.send('Node.js Express.js MySQL JWT Authentication API');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// Start the Server process.env.PORT || 5
const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});


