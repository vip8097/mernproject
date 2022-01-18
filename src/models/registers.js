const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmpassword: {
        type: String,
        required: true,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
})

// generating tokens define with the help of middleware
employeeSchema.methods.generateAuthToken = async function () {
    try {
        const token = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token })
        await this.save()
        return token
    } catch (error) {
        res.send('the error part' + error)
        console.log('the error part' + error)
    }
}

// converting password into hash
employeeSchema.pre('save', async function (next) {
    // Only run this function if password was moddified (not on other update functions)
    if (this.isModified('password')) {
        // Hash password with strength of 10

        // console.log(`the current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10)
        // console.log(`the current password is ${this.password}`);

        this.confirmpassword = await bcrypt.hash(this.password, 10)

        // //remove the confirm field
        // this.confirmpassword = undefined
    }
    next()
})

// now we need to to create a collections
const Register = new mongoose.model('Register', employeeSchema)

module.exports = Register
