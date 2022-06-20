const express = require('express')
const app = express()

const port = process.env.PORT || 5001;

app.get('/', (req,res) => {
    res.send('Welcome to the server')
})

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})