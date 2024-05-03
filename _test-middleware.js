/** code common to tests. */

const db = require("./db");

async function createData() {
  await db.query("DELETE FROM invoices");
  await db.query("DELETE FROM companies");
  await db.query("SELECT setval('invoices_id_seq', 1, false)");

  await db.query(`INSERT INTO companies (code, name, description)
                    VALUES ('x', 'X', 'Techno Kings media platform'),
                           ('amzn', 'Amazon', 'Bezos E-tailer')`);

  const inv = await db.query(
    `INSERT INTO invoices (comp_Code, amt, paid, add_date, paid_date)
           VALUES ('x', 100, false, '2024-05-01', null),
                  ('x', 200, true, '2024-02-01', '2024-02-02'),
                  ('amzn', 300, false, '2024-03-01', null)
           RETURNING id`
  );
}

module.exports = { createData };
