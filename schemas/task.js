const { gql } = require('apollo-server-express')

module.exports = gql`
    extend type Query {
        tasks(cursor: String, limit: Int): Taskfeed!
        task(id: ID!): Task
    }

    type Taskfeed {
        taskFeed: [Task!]
        pageInfo: PageInfo!
    }
    type PageInfo {
        nextPageCursor: String
        hasNextPage: Boolean
    }

    input createTask {
        name: String!
        completed: Boolean!
    }
    extend type Mutation {
        createTask(task: createTask): Task
        updateTask(id: ID!, task: updateTask): Task
        deleteTask(id: ID!): Task
    }
    input updateTask {
        name: String
        completed: Boolean
    }
    type Task {
        id: ID!
        name: String!
        completed: Boolean!
        user: User!
        createdAt: Date
        updateAt: Date
    }
`