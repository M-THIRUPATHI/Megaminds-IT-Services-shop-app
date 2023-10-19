const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "userdetails.db");
let db = null;

//INITIALIZATION DB AND SERVER
const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(4000, () => {
      console.log("Server Running at 4000");
    });
  } catch (error) {
    console.log(`DB Error:${error.message}`);
    process.exit(1);
  }
};
initializeDBandServer();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//USER REGISTER API
app.post("/register", async (request, response) => {
  const { username, email } = request.body;
  const hashedPassword = await bcrypt.hash(request.body.password, 10);
  const selectUserQuery = `SELECT * FROM userdetails WHERE username = ?`;
  const dbUser = await db.get(selectUserQuery, [username]);
  if (dbUser === undefined) {
    const createUserQuery = `
          INSERT INTO 
            userdetails (username, email, password) 
          VALUES 
            (?, ?, ?)`;
    await db.run(createUserQuery, [username, email, hashedPassword]);
    response.send("Register Successfully");
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

//USER LOGIN API
app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM userdetails WHERE username = '${username}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid User");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      const payload = {
        username: username,
      };
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});

//MIDDLEWARE FUNTION
const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        request.username = payload.username;
        next();
      }
    });
  }
};

//USER ACCOUNT
app.get("/account", authenticateToken, async (request, response) => {
  const username = request.username;
  const query = `SELECT * FROM userdetails WHERE username='${username}';`;
  const result = await db.get(query);
  response.send(result);
});

//GET ALL PRODUCTS WITH FILTERS
app.get("/products/", authenticateToken, async (request, response) => {
  const {
    sort_by = "",
    category = "",
    title_search = "",
    rating = 1,
  } = request.query;

  let sort = "";
  if (sort_by === "PRICE_HIGH") {
    sort = "DESC";
  } else {
    sort = "ASC";
  }

  const query = `
  SELECT * FROM products
  WHERE category LIKE ? AND title LIKE ? AND rating >= ? 
  ORDER BY price ${sort}
`;

  const result = await db.all(query, [
    `%${category}%`,
    `%${title_search}%`,
    rating,
  ]);
  response.send(result);
});

//GET PRODUCT FULL DETAILS
app.get("/shop/:id", authenticateToken, async (request, response) => {
  const { id } = request.params;
  const query = `SELECT * FROM products WHERE id=${id};`;
  const result = await db.get(query);
  response.send(result);
});
