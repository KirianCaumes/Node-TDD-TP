const express = require('express')
const bodyParser = require('body-parser')
// const db = require('./models')
const postRoutes = require('./app/api/post')
const authorRoutes = require('./app/api/author')
const mongoose = require('mongoose')

const AuthorModel = require('./models/mongoModels/author.js')
const PostModel = require('./models/mongoModels/post.js')
const db = {
    Author: AuthorModel,
    Post: PostModel
}
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static('app/public'))

mongoose.connect('mongodb+srv://@emptio-uzbyz.mongodb.net/Node-TDD-TP', { user: 'root', pass: 'V6Oz9dNHvZZ1ynEl', auth: { authdb: "admin" }, useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }).then(
    () => console.log("Connected to MongoDB"),
    err => console.error(err)
);

app.get('/', async (req, res) => {
    res.status(200).send('Hello World!')
})

postRoutes(app, db)
authorRoutes(app, db)


module.exports = app

