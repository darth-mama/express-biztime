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
    console.log(response.body);
    // expect(response.body).toHave({
    //   companies: [
    //     { code: "x", name: "X" },
    //     { code: "amzn", name: "Amazon" },
    //   ],
    // });
  });
});

describe("GET /x", function () {
  test("It should return X's company info", async function () {
    const response = await request(app).get("/companies/x");
    expect(response.body).toEqual({
      company: {
        code: "x",
        name: "X",
        description: "Techno Kings media platform",
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

describe("PUT /", function () {
  test("It should edit a company", async function () {
    const response = await request(app)
      .put("/companies/x")
      .send({ name: "XEdit", description: "1st Amendment platform" });

    expect(response.body).toEqual({
      company: {
        code: "x",
        name: "XEdit",
        description: "1st Amendment platform",
      },
    });
  });
});

// describe("DELETE /", function () {
//   test("It should delete a company"), async function () {
//     const response = await request(app)
//       .delete("/companies/x");

//     expect(response.body).toEqual({"status" : "deleted"});

//   }
// })
