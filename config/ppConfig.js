const passport = require('passport')
const db = require('../models')
const LocalStrategy = require('passport-local')

//configure this strategy

passport.serializeUser((user, doneCallback)=>{
    console.log('serializing user...')
    doneCallback(null,user.id)
})
passport.deserializeUser((id, doneCallback)=>{
    db.user.findByPk(id)
    .then(foundUser=>{
        console.log('deserializing user...')
        doneCallback(null, foundUser)
    })
    .catch(err=>{
        console.log('error deserializing user')
    })
})

// This is Passport's strategy to provide local authentication. We provide the
// following information to the LocalStrategy:
// Configuration: An object of data to identify our authentication fields, the
// username and password
// Callback function: A function that's called to log the user in. We can pass
// the email and password to a database query, and return the appropriate
// information in the callback. Think of "doneCallback" as a function that'll later look
// like this:
// login(error, user) {
//  // do stuff
// }
// We need to provide the error as the first argument, and the user as the
// second argument. We can provide "null" if there's no error, or "false" if
// there's no user.
// */

const findAndLogInUser = (email, password, doneCallback) =>{
    console.log('HELLO')
    db.user.findOne({where:{email:email}}) // go check for a user in the db with that email
    .then(async foundUser=>{
        let match = await foundUser.validPassword(password)
        if(!foundUser || !match){ //something is not working with user
            console.log('please work')
            return doneCallback(null, false) //send back "false"
        } else { //user was legit, no error. 
            console.log('yay')
            return doneCallback(null, foundUser) //send the found user object
        }
    })
    .catch(err=>doneCallback(err)) //doneCallback takes two params: error, userToBeLoggedIn
}

const fieldsToCheck = {
    usernameField : 'email', // tells the passport that the email is what we're using as 'username'
    passwordField: 'password'
}

const strategy = new LocalStrategy(fieldsToCheck, findAndLogInUser)

passport.use(strategy)


// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password'
// },
// (email, password, doneCallback) => {
//     console.log("passport-local is now trying to authenticate this user:", email)
//     db.user.findOne({where:{email:email}})
//     .then(foundUser=>{
//         if (!foundUser || !foundUser.validPassword(password)) { 
//             return doneCallback(null, false)
//         } else {
//             return doneCallback(null, foundUser);
//         }
//     })
//     .catch(err=>doneCallback(err))
// }


module.exports = passport