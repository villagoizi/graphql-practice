const mongoose = require('mongoose')
require('dotenv').config()
mongoose.set('debug', true)
module.exports = mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true})
    .then( () => console.log('Db is connected'))
    .catch( err => {
        console.log('Error connect', err) 
    })
