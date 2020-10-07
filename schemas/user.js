const {gql} = require('apollo-server-express')

module.exports = gql`
    extend type Query {
        user: User
    }

    extend type Mutation {
        signup(user: ISignup): User
        login(userData: ILogin): Token
    }
    input ISignup {
        name: String!
        email: String!
        password: String!
    }
    input ILogin {
        email: String!
        password: String!
    }
    type Token {
        token: String!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        tasks: [Task!]
        createdAt: Date
        updateAt: Date
    }
    extend type Subscription {
        userCreated: User
    }
`