const db = require("../db");
const express = require("express");
const router = express.Router();
const slugiy = require("slugify");

// Define the base route for all routes in this router
router.use("/companies", require("./companies"));

//GET /companies - Fetch all companies

router.get("/", async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM companies");
    return res.json({ companies: result.rows });
  } catch (e) {
    return next(e);
  }
});

//GET /companies/[code]

router.get("/:code", async (req, res, next) => {
  try {
    let code = req.params.code;
    const companiesResult = await db.query(
      `SELECT code, name, description FROM companies WHERE code=$1`,
      [code]
    );
  } catch (e) {
    return res.statusCode(404);
  }
  return next(e);
});

// Adds a company
router.post("/", async (req, res, next) => {
  let { name, description } = req.body;
  let code = slugify(name, { lower: true });

  try {
    const result = await db.query(
      `INSERT INTO companies (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING code, name, description`,
      [code, name, description]
    );
    return res.status(201).json({ company: result.rows[0] });
  } catch (e) {
    return next(e);
  }
});
// Edit existing company.
router.put("/:code", async (req, res, next) => {
  let { name, description } = req.body;
  let code = req.params.code;

  try {
    const result = await db.query(
      `UPDATE companies
            SET name=$1, descripton=$2
            WHERE code=$3)

            RETURNING code, name, description`,
      [name, description, code]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(`${code} does not exist, 404`);
    } else {
      return res.status(201).json({ company: result.rows[0] });
    }
  } catch (e) {
    return next(e);
  }
});

//Deletes company
router.patch("/:code", async (req, res, next) => {
  try {
    let { name, description } = req.body;
    let code = req.params.code;

    const result = await db.query(
      `DELETE FROM companies
        WHERE code = $1
        RETURNING code`,
      [code]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`${code} does not exist`, 404);
    } else {
      return res.json({ status: "deleted" });
    }
  } catch (e) {
    return next(e);
  }
});

module.exports.router;
