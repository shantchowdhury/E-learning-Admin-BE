const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, './private.key'), 'utf8');

const iss = "NonAcademy";
const aud = "http://nonacademy.org";
const exp = '7d';


const generateToken = (payload) => {
 return jwt.sign(payload, privateKey, {
    issuer: iss,
    subject: payload.Name,
    audience: aud,
    expiresIn: exp,
    algorithm: 'RS256'
 })
}

module.exports = generateToken;

