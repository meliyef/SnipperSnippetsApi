const express = require('express');
const { hashPassword, comparePassword } = require('../../encryption');
const router = express.Router();

let users = [{
    "email": "user@example.com",
    "password": "mysecretpassword"
}]

//User registation 
router.post('/users',async(req,res)=>{
    const{email,password} = req.body;
    if (!email || !password)
        return res.status(400).json({message : "Email and password are required"})

    const hashedPassword = await hashPassword(password);//hash the password using the hashPassword method created on the encryption module
    users.push({email,password: hashedPassword})
    res.status(201).json({message:"User created successfully"})
})
//User Login (verification)

router.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    if (!email || !password)
        return res.status(400).json({message : "Email and password are required"})

    const user = users.find(u => u.email === email) // find if the user is existing on the DB
    if(!user) return res.status(401).json({message : 'Invalid credentials'})
    
    const isMatching = await comparePassword(password,user.password)
    if (!isMatching) return res.status(401).json({message :"Invalid credentials"})
    
    res.status(200).json({message:"Login successful",user:{email:user.email}})

})
async function authenticate(req, res, next) {
    const { email, password } = req.body;
    
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
  
    const user = users.find(u => u.email === email); // Find the user by email
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
  
    const isMatch = await comparePassword(password, user.password); // Verify password
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  
    req.user = user; // Store the user in the request object for later use
    next();  // Proceed to the next handler
  }
  
  // Protected route for fetching the user data (without password)
  router.get('/user', authenticate, (req, res) => {
    const { password, ...userWithoutPassword } = req.user;  // Remove the password from the response
    res.json(userWithoutPassword);  // Send the user data without password
  });

module.exports = router;