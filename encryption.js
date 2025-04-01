const bcrypt = require('bcrypt')
const saltRound = 10;

// Hash and salt the password before saving

async function hashPassword(password) {
    if (typeof password !== 'string') {
        console.error('Password is not a string:', password);  // Log if it's not a string
    }

    const salt = await bcrypt.genSalt(saltRound);  // Generate salt
    console.log("Generated Salt:", salt);  // Log the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password
    return hashedPassword;
}


//compare the provided password with the one stored hashed password 

async function comparePassword (providedPassword,storedPassword){
    const match = await bcrypt.compare(providedPassword,storedPassword)
    return match;
}

module.exports = {hashPassword,comparePassword};