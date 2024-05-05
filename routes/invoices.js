//Routes for invoices

const express = require("express");
const ExpressError = require("../expressError");
const db = require("../db");

let router = express.Router();

//Get a list of invoices
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT id, comp_code FROM invoices
        ORDER BY id`
    );
    return res.json({ invoices: result.rows });
  } catch (e) {
    return next(e);
  }
});

//Get a detailed invoice by id input
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params; // Assuming the id is passed as a query parameter
    console.log(id);
    const result = await db.query(
      `SELECT
            i.id,
            i.comp_code,
            i.amt,
            i.paid,
            i.add_date,
            i.paid_date,
            c.code,
            c.name,
            c.description
            FROM invoices AS i
            INNER JOIN companies AS c ON (i.comp_code = c.code)
            WHERE i.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`${id} does not exist`, 404);
    }
    console.log("SQL Query:", result.rows);

    const data = result.rows[0]; // Assuming only one row is returned
    const invoice = {
      id: data.id,
      company: {
        code: data.comp_code,
        name: data.name,
        description: data.description,
      },
      amt: data.amt,
      paid: data.paid,
      add_date: data.add_date.toISOString().substring(0, 10),
      paid_date: data.paid_date,
    };

    return res.json({ invoice: invoice });
  } catch (e) {
    return next(e);
  }
});

//Adds invoice
router.post("/", async (req, res, next) => {
  try {
    let { comp_code, amt } = req.body;

    const result = await db.query(
      `
        INSERT INTO invoices (comp_code, amt)
        VALUES ($1, $2)
        RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [comp_code, amt]
    );
    console.log(`result: ${result}`);
    res.json({ invoice: result.rows[0] });
  } catch (e) {
    return next(e);
  }
});

//Updates an invoice
//Get current invoice, make changes the invoice
router.put("/:id", async (req, res, next) => {
  try {
    let { amt, paid } = req.body;
    let id = req.params.id;
    let paidDate = null;

    const currResult = await db.query(
      `
        SELECT paid, paid_date
        FROM invoices
        WHERE id = $1`,
      [id]
    );
    if (currResult.rows.length === 0) {
      throw new ExpressError(`Invoice ${id} does not exist`, 404);
    }
    const currPaidDate =
      currResult.rows[0].paid_date !== undefined
        ? currResult.rows[0].paid_date
        : null;

    if (!currPaidDate && paid) {
      paidDate = new Date();
    } else if (!paid) {
      paidDate = null;
    } else {
      paidDate = currPaidDate;
    }

    const result = await db.query(
      `
    UPDATE invoices
    SET amt=$1, paid=$2, paid_date=$3
    WHERE id=$4
    RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [amt, paid, paidDate, id]
    );
    return res.json({ invoice: result.rows[0] });
  } catch (e) {
    return next(e);
  }
});

//Deletes an invoice

router.delete("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;

    const result = await db.query(
      ` DELETE FROM invoices
        WHERE id = $1
        RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`Invoice ${id} does not exist`, 404);
    }

    return res.json({ status: "deleted" });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
