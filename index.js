// const express = require('express')
import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUiExpress from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import helmet from "helmet";

import { booksRouter } from "./routes/books.js";

const app = express()
const PORT = process.env.PORT || 4000

app.listen(PORT, (error) => {
    if (error) throw error;
    console.log(`server running on port :${PORT}`);
});

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: " Library API",
            Version: "1.0.0",
            description: "A simple Express Library API"
        },
        servers: [
            {
                // url: "http://localhost:4000"
                url: "https://book-api-phi.vercel.app"
            }
        ],
    },
    apis: ["./routes/*.js"]
}

const specs = swaggerJSDoc(options)

app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(cors())
// This disables the `contentSecurityPolicy` middleware but keeps the rest.
app.use(helmet());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))

app.get("/", (req, res) => {
    res.send("Express on Vercel");
  });

app.use("/books", booksRouter)
