require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const connectToMongo = require('./config/db');

const app = express();


const postLoginRoute = require('./routes/postLoginRoute');
const postSignRoute = require('./routes/postSignRoute');
const getSignRoute = require('./routes/getSignRoute');
const getLoginRoute = require('./routes/getLoginRoute');
const getExpenseRoute = require('./routes/getExpenseRoute');
const postExpenseRoute = require('./routes/postExpenseRoute');
const deleteExpenseRoute = require('./routes/deleteExpenseRoute');
const premiumRoute = require('./routes/preminumRoute');
const leaderboardRoute = require('./routes/leaderboardRoute');
const getForgetPasswordRoute = require('./routes/getForgetPasswordRoute');
const postForgetPasswordRoute = require('./routes/postForgetPassword');
const getResetPasswordRoute = require('./routes/getResetPasswordRoute');
const downloadfileRoute = require ('./routes/downloadfileRoute');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));


app.use(postLoginRoute);
app.use(postSignRoute);
app.use(getSignRoute);
app.use(getLoginRoute);
app.use(getExpenseRoute);
app.use(postExpenseRoute);
app.use(deleteExpenseRoute);
app.use(premiumRoute);
app.use(leaderboardRoute);
app.use(getForgetPasswordRoute);
app.use(postForgetPasswordRoute);
app.use(getResetPasswordRoute);
app.use(downloadfileRoute);

// Connect to MongoDB and start server
connectToMongo().then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});




