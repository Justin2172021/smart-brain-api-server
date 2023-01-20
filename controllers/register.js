const validator = require("validator");

const HandleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!validator.isEmail(email) || !validator.isLength(name, { min: 3 })
    || !validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        return res.status(400).json("Invalid form submission")
    }
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            db.transaction(trx => {
                trx.insert({
                    hash: hash,
                    email: email
                })
                .into("login")
                .returning("email")
                .then(loginEmail => {
                    return trx("users")
                        .insert({
                            email: loginEmail[0].email,
                            name: name,
                            joined: new Date()
                        })
                        .returning("*")
                    .then(user => {
                        res.json(user[0]);
                    })
                })
                .then(trx.commit)
                .catch(trx.rollback)
            })
           .catch(err => res.status(400).json("Unable to register user at this time")) 
        })    
    })
}

module.exports = {
    HandleRegister
};