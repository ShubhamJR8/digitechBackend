const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const cors = require('cors')
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoutes");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { notFound, errorHandler } = require("./middlewares/errorHandler");
dbConnect();
app.use(cors({
  origin : ['http://localhost:4200'],
}));
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/user', authRouter);
app.use("/api/product", productRouter);

app.use(cookieParser);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running  at PORT ${PORT}`);
});