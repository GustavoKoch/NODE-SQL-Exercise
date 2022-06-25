require('dotenv').config();
const express = require("express");
const app = express();
const db = require("./database/client");
app.use(express.json());

const { validationResult } = require("express-validator");
const { clientValidators } = require("./validators/clients");
const { orderValidators } = require("./validators/orders");



const PORT = process.env.PGPORT || 3000;
 console.log(process.env.PGHOST);

app.get("/time", async (req, res) => {
  // Promises syntax (then)
  db.query("SELECT NOW()")
    .then((data) => res.send(data.rows[0].now))
    .catch((error) => {
      console.log(error.message);
      res.sendStatus(500);
    });
});

/* ----------------------------------------CLIENTS------------------------------------------------ */
/* ------------------GET ALL--------------------------- */

app.get("/api/clients", (req, res) => {
   db
    .query("SELECT * FROM users ORDER BY id ASC")
    .then((data) => res.json(data.rows))
    .catch((err) => res.sendStatus(500));
});

/* ------------------GET ONE--------------------------- */

app.get("/api/clients/:id", (req, res) => {
  // parameterized queries
  let{ id } = req.params; 


  const getOneClient = { text: `SELECT * FROM users WHERE id = $1`, values: [id], };

 db.query(getOneClient).then((data) => res.json(data.rows)).catch((error) =>
 res.sendStatus(500));});


/*  ---------------------------------- POST  ---------------------------------- */
  app.post("/api/clients", clientValidators, (req, res) => {
      console.log(req.body);
    // 1a. Destructure the data you need from req.body or req.params or req.query
    const { first_name, last_name, age, active } = req.body;
  
   // 1b. Data validation (with express-validator)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {   return res.status(422).json({ errors: errors.array() });  }
  
    // 2. Write the query and the needed parameters
    const createOneClient = {
      text: ` INSERT INTO 
     users 
              (first_name, last_name, age, active)  
    VALUES
              ($1, $2, $3, $4)
        RETURNING * `,
   values: [first_name, last_name, age, active], };
  
    // 3. Fire the query, send back the data, and finally error handling.
   db.query(createOneClient).then((data) => res.status(201).json(data.rows[0])).catch((error)  =>
    res.sendStatus(500)); });
  

  /*   -------------------------- PUT NEW ITEM ------------------------------------------- */

    app.put("/api/clients/:id", clientValidators, (req, res) => {
  /*     1) We need to extract the id from req.params */
      const { id } = req.params;
  /*  2) We need to extract the data from the body of the request */
      const { first_name, last_name, age, active } = req.body;
    
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
    
   /* 3) Create a parameterized query: the query object with SQL + values parameterized */
          //(postresqltutorial.com can help with sql)
    
      const updateOneclient = {
        text: `
        UPDATE users
          SET 
            first_name = $1,
            last_name = $2,
            age = $3,
            active = $4
          WHERE
            id = $5
        RETURNING *
        `,
        values: [first_name, last_name, age, active, id],
      };
  /* 4) Fire the query, send back the data, and finally error handling. */
      db.query(updateOneclient)
        .then((data) => res.json(data.rows))
        .catch((e) => res.status(500).send(e.message) );
    });
    
  /* ----------------------- DELETE  ------------------------- */
    
    app.delete("/api/clients/:id", (req, res) => {
      const { id } = req.params;
    
      const deadclient = {
        text: "DELETE FROM users WHERE id = $1 RETURNING *",
        values: [id],
      };
    
  //We also have to consider the case if the client was deleted before
     db.query(deadclient)
        .then((data) => {
          if (!data.rows.length) {
            return res.status(404).send("This client has been already retired");
          }
          res.json(data.rows);
        })
        .catch((e) => res.status(500).send(e.message));
    });
    

/* ----------------------------------------ORDERS------------------------------------------------ */
/* ------------------GET ALL--------------------------- */

app.get("/api/orders", (req, res) => {
  db
   .query("SELECT * FROM orders ORDER BY id ASC")
   .then((data) => res.json(data.rows))
   .catch((err) => res.sendStatus(500));
});

/* ------------------GET ONE--------------------------- */

app.get("/api/orders/:id", (req, res) => {
 // parameterized queries
 let{ id } = req.params; 


 const getOneClient = { text: `SELECT * FROM orders WHERE id = $1`, values: [id], };

db.query(getOneClient).then((data) => res.json(data.rows)).catch((error) =>
res.sendStatus(500));});


/*  ---------------------------------- POST  ---------------------------------- */
 app.post("/api/orders", orderValidators, (req, res) => {
     console.log(req.body);
   // 1a. Destructure the data you need from req.body or req.params or req.query
   const { price, date, user_id } = req.body;
 
  // 1b. Data validation (with express-validator)
   const errors = validationResult(req);
   if (!errors.isEmpty()) {   return res.status(422).json({ errors: errors.array() });  }
 
   // 2. Write the query and the needed parameters
   const createOneOrder = {
     text: ` INSERT INTO 
      orders 
             (price, date, user_id)  
   VALUES
             ($1, $2, $3)
       RETURNING * `,
  values: [price, date, user_id] };
 
   // 3. Fire the query, send back the data, and finally error handling.
  db.query(createOneOrder).then((data) => res.status(201).json(data.rows[0])).catch((error)  =>
   res.sendStatus(500)); });
 

 /*   -------------------------- PUT NEW ITEM ------------------------------------------- */

   app.put("/api/orders/:id", orderValidators, (req, res) => {
 /*     1) We need to extract the id from req.params */
     const { id } = req.params;
 /*  2) We need to extract the data from the body of the request */
     const { price, date, user_id } = req.body;
   
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(422).json({ errors: errors.array() });
     }
   
  /* 3) Create a parameterized query: the query object with SQL + values parameterized */
         //(postresqltutorial.com can help with sql)
   
     const updateOneOrder = {
       text: `
       UPDATE orders
         SET 
           price = $1,
           date = $2,
           user_id = $3,
           
         WHERE
           id = $4
       RETURNING *
       `,
       values: [price, date, user_id,  id],
     };
 /* 4) Fire the query, send back the data, and finally error handling. */
     db.query(updateOneOrder)
       .then((data) => res.json(data.rows))
       .catch((e) => res.status(500).send(e.message) );
   });
   
 /* ----------------------- DELETE  ------------------------- */
   
   app.delete("/api/orders/:id", (req, res) => {
     const { id } = req.params;
   
     const deadOrder = {
       text: "DELETE FROM orders WHERE id = $1 RETURNING *",
       values: [id],
     };
   
 //We also have to consider the case if the client was deleted before
    db.query(deadOrder)
       .then((data) => {
         if (!data.rows.length) {
           return res.status(404).send("This client has been already retired");
         }
         res.json(data.rows);
       })
       .catch((e) => res.status(500).send(e.message));
   });




/* ------------------GET HOME--------------------------- */

app.get("/", (req, res) => {
  res.send("Welcome to the client-orders exercise");});

  

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
