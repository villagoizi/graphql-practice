const { gql } = require('apollo-server-express')

const typeDefs = gql`
    scalar Date
    type Query {
        _:String
    }
    type Mutation {
        _:String
    }
    type Subscription {
        _:String
    }
`

module.exports = [
    typeDefs,
    require('./user'),
    require('./task')
]