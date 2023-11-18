const _ = require('lodash');
const FAQ = require('../models/faq.js');
const {faqValidate} = require('../helpers/validation.js');


const fetchFAQ = async (req, res) => {
    try {
       const faqs = await FAQ.find().select("-__v");
       res.send(faqs); 
    } catch (error) {
        res.status(500).send('Internal server error');
    }
}

const createFAQ = async (req, res) => {
    try {
        const {Title, Description} = req.body;
        const obj=new FAQ({Title, Description});
        obj.save();
        res.status(201).send({
            success:true,
            message:"FAQ created successfully",
            data:obj
        });
    } catch (error) {
        res.status(500).send('Internal server error');
    }
}

const updateFAQ = async (req, res) => {
    try {
        const {faqId} = req.params;
        const {Title, Description} = req.body; 

        const faq = await FAQ.findById(faqId);
        if(!faq) return res.status(400).send('FAQ not found');
        if((Title === faq.Title) && (Description === faq.Description)) return res.status(400).send('Change the FAQ details');

        const {error} = faqValidate({Title, Description});
        if(error) return res.status(400).send(error.details[0].message);

        const updatedData = await FAQ.findByIdAndUpdate(faqId, req.body, {new: true}).select('-__v');
        res.send(updatedData);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
}

const deleteFAQ = async (req, res) => {
    try {
        const {faqId} = req.params;
        const faq = await FAQ.findById(faqId);
        if(!faq) return res.status(404).send('FAQ not found');

        const deletedData = await FAQ.findByIdAndDelete(faqId);
        res.send(deletedData._id);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
}


module.exports = {fetchFAQ, createFAQ, updateFAQ, deleteFAQ};