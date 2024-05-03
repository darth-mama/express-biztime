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
  test("It should respond w/ an array of companies", async function () {
    const response = await request(app).get("/companies");
    expect(response.body).toEqual({
      companies: [
        { code: "x", name: "X" },
        { code: "amzn", name: "Amazon" },
      ],
    });
  });
});

describe("GET /x", function () {
  test("It should return X's company info", async function () {
    const response = await request(app).get("/companies/apple");
    expect(response.body).toEqual({
      company: {
        code: "x",
        name: "Apple",
        description: "Techno King's media platform",
        invoices: [1, 2],
      },
    });
  });
});

describe("POST /", function () {
  test("It should add a company", async function () {
    const response = await request(app)
      .post("/companies")
      .send({ name: "DumplingDive", description: "Nomnomnom" });

    expect(response.body).toEqual({
      company: {
        code: "dumplingdive",
        name: "DumplingDive",
        description: "Nomnomnom",
      },
    });
  });
});
