const Category = require('../models/category.js');
const {categoryValidate} = require('../helpers/validation.js');
const _ = require('lodash');

const fetchCategory = async (req, res) => {
    try {
        const categories = await Category.find().select("-__v");
        res.send(categories);   
    } catch (error) {
        res.status(500).send('Internal server error');
    }
}

const createCategory = async (req, res) => {
    try {
        const {error} = categoryValidate(_.omit(req.body, ['id']));
        if(error) return res.status(400).send(error.details[0].message);
        
        const checkName = await Category.findOne({Name: req.body.Name});
        if(checkName) return res.status(400).send('Category is already created');

        const checkSlug = await Category.findOne({Slug: req.body.Slug});
        if(checkSlug) return res.status(400).send('Choose a different url');
        
        const category = new Category(_.omit(req.body, ['id']));
        await category.save();

        res.status(201).send(category);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
}

const updateCategory = async (req, res) => {
    try {
        const {categoryId} = req.params;
        const {Name, Slug} = req.body;

        const category = await Category.findById(categoryId);
        if(!category) return res.status(404).send('Category not found');
        
        if((Name === category.Name) && (Slug === category.Slug)) return res.status(400).send('Change the category details');

        // const {error} = categoryValidate(req.body);
        // if(error) return res.status(400).send(error.details[0].message);
        
        let updatedData = {};

        if(Name !== category.Name){
            const checkName = await Category.findOne({Name: req.body.Name});
            if(checkName) return res.status(400).send('Category is already created');
            updatedData = await Category.findByIdAndUpdate(categoryId, {Name}, {new: true}).select('-__v');
        }

        if(Slug !== category.Slug){
            const checkSlug = await Category.findOne({Slug});
            if(checkSlug) return res.status(400).send('Choose a different URL');
            updatedData = await Category.findByIdAndUpdate(categoryId, {Slug}, {new: true}).select('-__v');
        }
        
        res.send(updatedData); 

    } catch (error) {
        res.status(500).send('Interval server error');
    }
}

const deleteCategroy = async (req, res) => {
    try {
        const {categoryId} = req.params;
        const category = await Category.findById(categoryId);
        if(!category) return res.status(400).send('Category not found');

        const deletedData = await Category.findByIdAndDelete(categoryId);
        res.send(deletedData._id);
    } catch (error) {
        res.status(500).send('Interval server error');
    }
}

module.exports = {fetchCategory, createCategory, updateCategory, deleteCategroy};