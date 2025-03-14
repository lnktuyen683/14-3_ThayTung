var express = require('express');
var router = express.Router();
let categorySchema = require('../schemas/category');

/* GET all categories */
router.get('/', async function(req, res, next) {
    try {
        let categories = await categorySchema.find({ isDeleted: false });
        res.status(200).send({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

/* GET a category by ID */
router.get('/:id', async function(req, res, next) {
    try {
        let category = await categorySchema.findById(req.params.id);
        if (!category || category.isDeleted) {
            return res.status(404).send({
                success: false,
                message: 'Category not found'
            });
        }
        res.status(200).send({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

/* CREATE a new category */
router.post('/', async function(req, res, next) {
    try {
        let body = req.body;
        let newCategory = new categorySchema({
            name: body.name,
            description: body.description
        });

        await newCategory.save();
        res.status(201).send({
            success: true,
            data: newCategory
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

/* UPDATE a category by ID */
router.put('/:id', async function(req, res, next) {
    try {
        let body = req.body;
        let updatedObj = {};

        if (body.name) {
            updatedObj.name = body.name;
        }
        if (body.description) {
            updatedObj.description = body.description;
        }

        let updatedCategory = await categorySchema.findByIdAndUpdate(req.params.id, updatedObj, { new: true });

        if (!updatedCategory) {
            return res.status(404).send({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).send({
            success: true,
            data: updatedCategory
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

/* DELETE a category (soft delete) */
router.delete('/:id', async function(req, res, next) {
    try {
        let deletedCategory = await categorySchema.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });

        if (!deletedCategory) {
            return res.status(404).send({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Category deleted successfully',
            data: deletedCategory
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
