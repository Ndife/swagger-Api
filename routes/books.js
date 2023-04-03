import { Router } from 'express'
const router = Router()
import { nanoid } from 'nanoid'
import db from '../db.js'

const idLength = 8;

/**
 * @swagger
 * components:
 *  parameters:
 *    idParam:
 *      name: id
 *      in: path
 *      required: true
 *      schema:
 *         type: string
 *      description: The book id
 *  schemas:
 *    Book:
 *      type: object
 *      required:
 *          - title
 *          - author
 *      properties:
 *          id: 
 *             type: string
 *             description: The auto generated id of the book
 *          title:
 *              type: string
 *              description: the book title 
 *          author:
 *              type: string
 *              description: The book author
 *      example:
 *          id: sSfE_as2
 *          title: The New Turing age
 *          author: Uche Ndife
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 */

/**
 * @swagger
 * /books:
 *  get:
 *     summary: Returns the list of all the boooks
 *     tags: [Books]
 *     responses:
 *        200:
 *           description: The list of the books
 *           content:
 *              application/json:
 *                 schema:
 *                   type: array
 *                   itmes:
 *                      $ref: '#/components/schemas/Book' 
 * 
 */

router.get('/', (req, res) => {
    const books = db.chain.get('books')
    res.send(books)
})

/**
 * @swagger
 * /books/{id}:
 *    get:
 *       summary: Get the book by id 
 *       tags: [Books]
 *       parameters:
 *          - $ref: '#/components/parameters/idParam'
 *       responses:
 *          200:
 *             description: The book description by id
 *             content:
 *                 application/json:
 *                    schema:
 *                       $ref: '#/components/schemas/Book'
 *          404:
 *             description: The book was not found
 */


router.get('/:id', (req, res) => {
    const book = db.chain
    .get('books')
    .find({ id: req.params.id })
    .value()

    if (!book) {
        return res.sendStatus(404)
    }

    res.send(book)
})


/**
 * @swagger
 * /books:
 *    post:
 *        summary: Create a new book
 *        tags: [Books]
 *        requestBody:
 *          required: true
 *          content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Book'
 *        responses:
 *          200:
 *             description: The book was successfully created
 *             content:
 *               application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Book'
 *          500:
 *              description: Some error occur
 */

router.post('/', async (req, res) => {
    try {
        const { books } = db.data
       
        const book = {
            id: nanoid(idLength),
            ...req.body
        }

        books.push(book)
        await db.write()

        res.send(book)
    } catch (error) {
        return res.status(500).send(error)
    }
})


/**
 * @swagger
 * /books/{id}:
 *    put:
 *       summary: Update the book by the id
 *       tags: [Books]
 *       parameters:
 *          - $ref: '#/components/parameters/idParam'
 *       requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Book'
 *       responses:
 *          200:
 *             description: The book was updated
 *             content:
 *               application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Book'
 *          404: 
 *             description: The book was not found
 *          500:
 *             description: Some error occur
 *        
 */

router.put('/:id', async (req, res) => {
    try {
        const book = db.chain.get('books').find({ id: req.params.id })

        if(!book.value()) {
            res.sendStatus(404)
        }

        await book.assign({title: req.body.title, author: req.body.author}).value()
        await db.write()

        res.send(db.chain.get('books').find({ id: req.params.id}))
    } catch (error) {
        return res.status(500).send(error)
    }
})


/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Remove the book by id 
 *     tags: [Books]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */

router.delete('/:id', async (req, res) => {

    const book = db.chain
    .get('books')
    .find({ id: req.params.id })
    .value()

    if (!book) {
        return res.sendStatus(404)
    }

    db.chain.get('books').remove({ id: req.params.id }).value()

    await db.write()

    res.sendStatus(200)
})

export { router as booksRouter }