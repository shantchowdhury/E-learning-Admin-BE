const _ = require('lodash');
const bcrypt = require("bcryptjs");
const User = require('../models/user.js');
const Code = require('../models/code.js');
const {sendLoginCode} = require('../mail/mail.js');
const generateToken = require('../jwt/token.js');
const jwt=require('jsonwebtoken');


const check = async (req, res) => {
    try {
        const {id} = req.body;
        const user = await User.findById(id);
        if(!user) return res.status(400).send('User not found');
        res.send({id: user._id, role: user.Role});
    } catch (error) {
        res.status(500).send('Internal server error');
    }
}


const login = async (req, res) => {
    try {
        const {Phone, Password} = req.body; 
        const user = await User.findOne({Phone: `+88${Phone}`});
        console.log(user);
        if(!user) return res.status(400).send('Invalid credentials');
        
        const validPassword = await bcrypt.compare(Password, user.Password);
        if(!validPassword) return res.status(400).send("Invalid credentials");
        
        const login_code = Math.random().toString(36).slice(-6);

        await Code.deleteMany({user: user._id}); // Deleting the old codes 
        const code = new Code({user: user._id, login_code, expire: Date.now() + 600000}); // 10 minutes expire
        await code.save();

        sendLoginCode({Name: user.Name, Email: user.Email, Code: login_code});
        const data=await Code.findOne({
            user:user._id
        });
        // const payload = _.pick(JSON.parse(JSON.stringify(user)), ['_id', 'Name', 'Role', 'joined']);
        // const token = generateToken(payload);
      
        // await Code.deleteMany({user: user._id});
        
        // const cookieOption = {
        //     path: '/',
        //     httpOnly: true, 
        //     secure: true,
        //     sameSite: 'none',
        //     maxAge: 604800000 // 7 days
        // };

        const token = jwt.sign({ id: user._id },process.env.JWT_SECRET , {
            expiresIn: 30 * 24 * 60 * 60,
        });

        res.status(201).json({ token,id: user._id, role: user.Role,otp:data.login_code});
  
    } catch (error) {
        res.status(500).send('Internal server error');
    }
};

const verify = async (req, res) => {
    try {
      const {login_code,id} = req.body;
      const checkCode = await Code.findOne({user: id, login_code}).populate('user');

      if(!checkCode) return res.status(400).send('Code is not valid');

      if(Date.now() > checkCode.expire) return res.status(400).send('Code is not valid');
    //   const payload = _.pick(JSON.parse(JSON.stringify(checkCode.user)), ['_id', 'Name', 'Role', 'joined']);
    //   const token = generateToken(payload);
    
    const token = jwt.sign({ id: id },process.env.JWT_SECRET , {
        expiresIn: 30 * 24 * 60 * 60,
    });

      await Code.deleteMany({user:id});
      
    //   const cookieOption = {
    //       path: '/',
    //       httpOnly: true, 
    //       secure: true,
    //       sameSite: 'none',
    //       maxAge: 604800000 // 7 days
    //   };

    //   res.cookie('access_token', token, cookieOption).send(checkCode.user._id);

    res.status(201).json({ token,id: checkCode.user._id});
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal server error');
    }
}

const logout = async (req, res) => {
    try{
        res.clearCookie('access_token').send('Logged out');
    }catch(err){
        res.status(500).send('Internal server error');
    }
  }

module.exports = {login, verify, check, logout};