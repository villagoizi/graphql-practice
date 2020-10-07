const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const cors = require('cors')
//Variables enviroment
require('dotenv').config()
const PORT = process.env.PORT || 5001
const resolvers = require('./resolvers')
const typeDefs = require('./schemas')
const {verifyJwt} = require('./ctx')
require('./database')

const loaders = require('./dataloaders')
const Dataloader = require('dataloader')

const app = express()
app.use(cors())
app.use(express.json())

//Apollo server
const serverApollo = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: async ({ req }) => {
        try {
            await verifyJwt(req)
            return {
                email: req.email,
                userId: req.userId,
                loaders:{
                    user: new Dataloader(keys => loaders.user.bacthLoadUser(keys)),
                    task: new Dataloader(keys => loaders.task.batchTask(keys))
                } 
            }
            
        } catch (error) {
            console.log(error)
        }
    }
})
serverApollo.applyMiddleware({ app, path: '/graphql' })

const httpServer = app.listen(PORT, ()=>{
    console.log(`Server listenning ${PORT}`)
    console.log(`Graphql server: ${serverApollo.graphqlPath}`)
})

serverApollo.installSubscriptionHandlers(httpServer)