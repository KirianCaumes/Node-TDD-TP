require('dotenv').config({ path: process.cwd() + '/.env' })

// const db = require('./models')
const app = require('./app')

app.listen(process.env.SERVER_PORT, () => console.log('App listening on port 3000!'))
