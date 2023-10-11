require('dotenv').config();
const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const hsts = require('./middleware/hsts');
const mongoose = require('mongoose');

//DB
mongoose.connect(process.env.MONGODB_URL).then(() => console.log('DB is connected'));

//middleware
app.use(helmet());
app.use(cors({ origin: 'https://localhost:3000' , optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(hsts);

//Routes 
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user')); // Update the path to use './routes/user'
app.use('/api/posts', require('./routes/posts'));


//listen
https
.createServer(
    {
        key: fs.readFileSync('./keys/key.pem'),
        cert: fs.readFileSync('./keys/cert.pem'),
        passphrase: 'apds', 
    },
    app
)
.listen(3000);