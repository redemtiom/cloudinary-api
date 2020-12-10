const express = require("express")
const app = express()
const cors = require('cors');
const port = require('./config').port
const bodyParser = require("body-parser")
const path = require('path')
const router = express.Router()
const routes = require('./routes')

app.use(cors({ origin: true }));
app.use(bodyParser.json())

app.use(routes(router))

app.use(express.static(path.join(__dirname, 'cloudinary/build')));

app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
})
