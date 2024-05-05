const request = require("supertest");

const app = require("../app");
const { createData } = require("../_test-middleware");
const db = require("../db");

//before each test, clear out data
beforeEach(createData);

afterAll(async () => {
  await db.end();
});

describe("GET /", function () {
  test("It should repsond with a list of invoices", async function () {
    const response = await request(app).get("/invoices");
    expect(response.body).toEqual({
      invoices: [
        { id: 1, comp_code: "x" },
        { id: 2, comp_code: "x" },
        { id: 3, comp_code: "amzn" },
      ],
    });
  });
});

describe("GET /1", function () {
  test("It returns invoice info by id input", async function () {
    const response = await request(app).get("/invoices/1");
    expect(response.body).toEqual({
      invoice: {
        id: 1,
        company: {
          code: "x",
          name: "X",
          description: "Techno Kings media platform",
        },
        amt: 100,
        paid: false,
        add_date: "2024-05-01",
        paid_date: null,
      },
    });
  });

  test("It should return 404 for no-such-invoice", async function () {
    const response = await request(app).get("/invoices/999");
    expect(response.status).toEqual(404);
  });
});

describe("POST /", function () {
  test("It should add an invoice.", async function () {
    const response = await request(app)
      .post("/invoices")
      .send({ amt: 200, comp_code: "amzn" });

    expect(response.body).toEqual({
      invoice: {
        id: 4,
        comp_code: "amzn",
        amt: 200,
        paid: false,
        add_date: expect.any(String),
        paid_date: null,
      },
    });
  });
});

describe("PUT /", function () {
  test("It should edit requested invoice.", async function () {
    const response = await request(app)
      .put("/invoices/1")
      .send({ amt: 1000, paid: false });

    expect(response.body).toEqual({
      invoice: {
        id: 1,
        comp_code: "x",
        paid: false,
        amt: 1000,
        add_date: expect.any(String),
        paid_date: null,
      },
    });
  });
});

test("It should return a 404 if invoice dne", async function () {
  const response = await request(app).put("/invoices/999").send({ amt: 1000 });

  expect(response.status).toEqual(404);
});

test("It should return a 500 if missing data", async function () {
  const response = await request(app).put("/invoices/1").send({});

  expect(response.status).toEqual(500);
});

describe("DELETE /", function () {
  test("It should delete an invoice", async function () {
    const response = await request(app).delete("/invoices/1");

    expect(response.status).toEqual(200);
    expect(response.status).toEqual({ status: "deleted" });
  });

  test("It should return a 404 for non-existent invoices", async function () {
    const response = await request(app).delete("/invoices/123");

    expect(response.status).toEqual(404);
  });
});
