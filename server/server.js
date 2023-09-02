const express = require('express')
const app = express()
const { PORT } = require('./constants/index')

//This is our Express App initialization

//import routes
const routes = require('./routes/routes')

//intialize routes
app.use('/api', routes)

//app start
const appStart = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`The app is running at http://localhost:${PORT}`)
        })   
    } catch (error) {
        console.log(error)
    }
}

appStart()