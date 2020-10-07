const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Task'
        }
    ]
}, {
    timestamps: true
})

userSchema.pre('save', function () {
    if(!this.isModified('password')) {
        return;
    }
    const salt = 10
    this.password = bcrypt.hashSync(this.password, salt)
    return
})

userSchema.methods.comparePassword = function (p) {
    return bcrypt.compareSync(p, this.password)
}

module.exports = model('User', userSchema)