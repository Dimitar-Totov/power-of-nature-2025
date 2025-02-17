import express from 'express';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';

import handlebarsSetup from './config/handlebarsSetup.js';
import mongooseSetup from './config/mongooseSetup.js';
import routes from './routes.js';
import { auth } from './middlewares/authMiddleware.js';
import { tempData } from './middlewares/tempData.js';

const app = express();

handlebarsSetup(app);
mongooseSetup();

app.use(express.static('src/public'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
    secret: 'ksadjhgojh3325jnn1jndsa125132sda',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }
}));
app.use(auth);
app.use(tempData);
app.use(routes);

app.listen(3000, () => console.log('Server is listening on port 3000'));