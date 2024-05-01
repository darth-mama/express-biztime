/** BizTime express application. */

const express = require("express");

const ExpressError = require("./expressError");
const companiesRoutes = require("./routes/companies");
const invoicesRoutes = require("./routes/invoices");

const app = express();

app.use(express.json());
app.use("/companies", companiesRoutes);
app.use("/invoices", invoicesRoutes);

/** 404 handler */

app.use(function (req, res, next) {
  const e = new ExpressError("Not Found", 404);
  return next(e);
});

/** general error handler */

app.use((e, req, res, next) => {
  res.status(e.status || 500);

  return res.json({
    error: e,
    message: e.message,
  });
});

module.exports = app;
