const {
    getUserByEmail, jwtSign,
    getTaskByUserId 
} = require('../services')
const { combineResolvers } = require('graphql-resolvers')

const { User } = require('../models') 
const {tasks, users} = require('../seeds')
const { isAuthenticated } = require('./middlewares')

const {userEvents} = require('../subscriptions/events')
const PubSub = require('../subscriptions')

module.exports = {
    Query:{
        user: combineResolvers(
            isAuthenticated,
            async ( _, __ , { email } ) => {
                try {
                    const user = await getUserByEmail(email)
                    if(!user) {
                        throw new Error('User not found')
                    }
                    return user
                } catch (e) {
                    console.log(e)
                    throw e
                }
            }
        )
    },
    Mutation: {
        signup: async (_, {user}) => {
            try {
                const isUser = await getUserByEmail(user.email)
                if(isUser) { 
                    throw new Error('Email already in use') 
                }
                const newUser = new User(user)
                const result = await newUser.save()
                PubSub.publish(userEvents.USER_CREATED, {
                    userCreated: result
                })
                return result
            } catch (err){
                console.log(err)
            }
        },
        login: async (_, {userData:{email, password } }) => {
            try {
                const user = await getUserByEmail(email)
                if(!user) {
                    throw new Error('User not found')
                }
                const isPasswordValid = user.comparePassword(password)
                if(!isPasswordValid) {
                    throw new Error('Email or password is incorrect')
                }
                const token = jwtSign({email: user.email, id: user.id})
                return {token}
            } catch (e) {
                console.log(e)
                throw e
            }
        }
    },
    Subscription: {
        userCreated: {
            subscribe: () => PubSub.asyncIterator(userEvents.USER_CREATED)
        }
    }
    ,
    //Field level resolver
    User: {
        tasks: async (parent,_,{loaders}) => {
            try {
                // const tasks = await getTaskByUserId(parent.id)
                const tasks = await loaders.task.load(parent.id)
                return tasks
            } catch (error) {
                console.error(error)
                throw error
            }
        }
    }
}