const validator = require("validator");

const HandleSignin = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    if (!validator.isEmail(email) || !password) {
        return res.status(400).json("Incorrect form submission")
    }
    db.select("email", "hash").from("login")
        .where("email", "=", email)
        .then(data => {
            bcrypt.compare(password, data[0].hash, function(err, bcryptRes) {
                if (bcryptRes) {
                    return db.select("*").from("users")
                    .where("email", "=", email)
                    .then(user => {
                        res.json(user[0])  
                    })
                    .catch(err => res.status(400).json("Unable to sign-in"))
                } else {
                    res.status(400).json("Invalid credentials")  
                }
            });
        })
        .catch(err => res.status(400).json("Invalid credentials"))  
}

module.exports = {
    HandleSignin
};
