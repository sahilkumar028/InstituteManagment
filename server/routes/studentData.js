const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Course = require('../models/Course');
const Payment = require('../models/Payment');

// Get student count data by time period
router.get('/monthly', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const monthlyData = await Student.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(currentYear, 0, 1),
                        $lte: new Date(currentYear, 11, 31)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        
        const formattedData = monthlyData.map(item => ({
            month: months[item._id - 1],
            count: item.count
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching monthly data:', error);
        res.status(500).json({ message: 'Error fetching monthly data' });
    }
});

// Get quarterly data
router.get('/quarterly', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const quarterlyData = await Student.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(currentYear, 0, 1),
                        $lte: new Date(currentYear, 11, 31)
                    }
                }
            },
            {
                $group: {
                    _id: { $quarter: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        
        const formattedData = quarterlyData.map(item => ({
            month: quarters[item._id - 1],
            count: item.count
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching quarterly data:', error);
        res.status(500).json({ message: 'Error fetching quarterly data' });
    }
});

// Get yearly data
router.get('/yearly', async (req, res) => {
    try {
        const yearlyData = await Student.aggregate([
            {
                $group: {
                    _id: { $year: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const formattedData = yearlyData.map(item => ({
            month: item._id.toString(),
            count: item.count
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching yearly data:', error);
        res.status(500).json({ message: 'Error fetching yearly data' });
    }
});

// Get course distribution data
router.get('/courses', async (req, res) => {
    try {
        const courseData = await Student.aggregate([
            {
                $lookup: {
                    from: 'courses',
                    localField: 'courseId',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            {
                $unwind: '$course'
            },
            {
                $group: {
                    _id: '$course.name',
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedData = courseData.map(item => ({
            course: item._id,
            count: item.count
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching course data:', error);
        res.status(500).json({ message: 'Error fetching course data' });
    }
});

// Get fees data by time period
router.get('/fees/:period', async (req, res) => {
    try {
        const { period } = req.params;
        const currentYear = new Date().getFullYear();
        let groupBy;

        switch (period) {
            case 'monthly':
                groupBy = { $month: "$createdAt" };
                break;
            case 'quarterly':
                groupBy = { $quarter: "$createdAt" };
                break;
            case 'yearly':
                groupBy = { $year: "$createdAt" };
                break;
            default:
                return res.status(400).json({ message: 'Invalid period' });
        }

        const feesData = await Payment.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(currentYear, 0, 1),
                        $lte: new Date(currentYear, 11, 31)
                    }
                }
            },
            {
                $group: {
                    _id: groupBy,
                    amount: { $sum: "$amount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        let formattedData;
        if (period === 'monthly') {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
            formattedData = feesData.map(item => ({
                month: months[item._id - 1],
                amount: item.amount
            }));
        } else if (period === 'quarterly') {
            const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
            formattedData = feesData.map(item => ({
                month: quarters[item._id - 1],
                amount: item.amount
            }));
        } else {
            formattedData = feesData.map(item => ({
                month: item._id.toString(),
                amount: item.amount
            }));
        }

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching fees data:', error);
        res.status(500).json({ message: 'Error fetching fees data' });
    }
});

module.exports = router; 