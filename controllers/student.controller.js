const Student = require('../models/student.js');
const { emailValidate } = require('../helpers/validation.js');

const fetchStudents = async (req, res) => {
    try {
    const students = await Student.find().select('-Password -__v');
    res.send(students); 

    } catch (error) {
        res.status(500).send('Internal server error');
    }
}

const blockStudent = async (req, res) => {
    try {
        const {studentId} = req.params;
        const student = await Student.findById(studentId);
        if(!student) return res.status(404).send('Student not found');
        const updatedData = await Student.findByIdAndUpdate(studentId, {is_active: false}, {new: true}).select('-Password -__v');
        res.send(updatedData);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
}

const unblockStudent = async (req, res) => {
    try {
        const {studentId} = req.params;
        const student = await Student.findById(studentId);
        if(!student) return res.status(404).send('Student not found');
        const updatedData = await Student.findByIdAndUpdate(studentId, {is_active: true}, {new: true}).select('-Password -__v');
        res.send(updatedData);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
}

const updateStudent = async (req, res) => {
    try {
        const {Email, isActive} = req.body; 
        const {studentId} = req.params;
        const student = await Student.findById(studentId);
        if((Email === student.Email) && (isActive === student.is_active)) return res.status(400).send('Change the student details');
        
        let updatedData = {};

        if(Email !== student.Email) {
            const checkEmail = await Student.findOne({Email});
            if(checkEmail) return res.status(400).send('Email is already in use');
            const {error} = emailValidate({Email});
            if(error) return res.status(400).send(error.details[0].message);
            updatedData = await Student.findByIdAndUpdate(studentId, {Email}, {new: true}).select('-__v');
        }


        if(isActive !== student.is_active) {
            updatedData = await Student.findByIdAndUpdate(studentId, {is_active: isActive}, {new: true}).select('-__v');
        }

        res.send(updatedData);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
}

module.exports = {fetchStudents, blockStudent, unblockStudent, updateStudent};