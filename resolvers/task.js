const { Task,User } = require('../models')
const { getUserByEmail, getUserById, 
    getTaskById, getTaskByUserId 
}= require('../services')
const {transformBase64OrString} = require('../helpers')
const { combineResolvers} = require('graphql-resolvers')
const {isAuthenticated, isTaskOwner} = require('./middlewares')
const {startSession} = require('mongoose')

module.exports = {
    Query:{
        tasks: combineResolvers(isAuthenticated, async (_, {cursor, limit=10}, { userId }) => {
            try {
               const query = { user: userId }
               if(cursor) {
                   let cursorId = transformBase64OrString(cursor, 'string')
                   query["_id"] = {
                       "$lt": cursorId
                   }
               }
               let tasks = await Task.find(query).sort({_id: -1}).limit(limit + 1)
               const hasNextPage = tasks.length > limit
               tasks = hasNextPage ? tasks.slice(0,-1) : tasks
               const nextPageCursor = hasNextPage ? transformBase64OrString( tasks[tasks.length - 1].id ) : null
               return {
                   taskFeed: tasks,
                   pageInfo: {
                       nextPageCursor,
                       hasNextPage
                   }
               }
            } catch (e) {
                console.log(e)
                throw e
            }
        }),
        task: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id }) => {
            try {
                const task = await getTaskById(id)
                if(!task) {
                    throw new Error('Task not found')
                }
                return task
            } catch (e) {
                console.log(e)
                throw e
            }
        })
    },
    //Field level resolver
    Task:{
        user: async (parent,__,{ loaders }) => {
            // const user = await getUserById(parent.user)
            const user = await loaders.user.load(parent.user.toString())
            return user
        }
    },
    Mutation: {
        createTask: combineResolvers(
            isAuthenticated,
            async (_, {task}, {email, userId }) => {
                try {
                    const session = await startSession()
                    session.startTransaction()
                    const user = await getUserById(userId)
                    const newTask = new Task({...task, user: user.id })
                    const result = await newTask.save()        
                    user.tasks.push( result.id)
                    await user.save()
                    await session.commitTransaction()
                    session.endSession()
                    return result
                } catch (e) {
                    await session.abortTransaction()
                    session.endSession()
                    console.log(e)
                    throw e
                }
           }

        ),
        updateTask: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id, task }) => {
            try {
                const taskUpdate = await Task.findByIdAndUpdate(id, {...task}, {new: true})
                return taskUpdate
            } catch (e) {
                console.log(e)
                throw e
            }
        }),
        deleteTask: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id }, { userId }) => {
            try {
                const session = await startSession()
                session.startTransaction()
                const task = await Task.findByIdAndDelete(id)
                await User.updateOne({_id: userId},{
                    $pull: { tasks: task.id }
                })
                await session.commitTransaction()
                session.endSession()
                return task
            } catch (e) {
                await session.abortTransaction()
                session.endSession()
                console.log(e)
                throw e
            }
        })
    }
}