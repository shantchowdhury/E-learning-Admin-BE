const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// If you change something on here you need to also update it on where the token is generating

const iss = "NonAcademy";
const aud = "http://nonacademy.org";
const maxAge = "7d";

async function authrization(req, res, next) {
  // try{
  //    const token = req.cookies;

  //    // If there will be any error in jwt verification, it will send the error on Catch block
  //    if(!token.access_token) return res.status(401).clearCookie('access_token').send('Access denied');
  //    const {sub} = jwt.decode(token.access_token);

  //    const publicKey = fs.readFileSync(path.join(__dirname, '../jwt/public.key'), 'utf8');
  //    const {_id} = jwt.verify(token.access_token, publicKey, {
  //         issuer: iss,
  //         subject: sub,
  //         audience: aud,
  //         maxAge,
  //         algorithms: ['RS256']
  //     });

  //    const user = await User.findById(_id);
  //    if(!user) return res.status(401).clearCookie('access_token').send('Access denied');
  //    req.body.id = _id;
  //    next();
  // }catch(err){
  //     return res.status(401).clearCookie('access_token').send('Access denied');
  // }

  try {
    let token = req.headers["authorization"];

    if (token && token.startsWith("Bearer ")) {
      try {
        token = token.split(" ")[1];
        console.log(token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(401).send("Access denied");
        req.body.id = decoded.id;
        next();
      } catch (err) {
        console.log(err);
        return res.status(401).json({
          message: "Invalid token",
        });
      }
    } else {
      return res.status(401).json({
        message: "No token provided",
      });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

module.exports = authrization;
