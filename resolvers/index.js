const { GraphQLDateTime } = require('graphql-iso-date')

const customDateResolver = {
    Date: GraphQLDateTime
}

module.exports = [
    customDateResolver,
    require('./user'),
    require('./task')
]