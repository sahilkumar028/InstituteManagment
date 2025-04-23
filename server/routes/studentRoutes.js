const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const upload = require('../middleware/upload');

// Student routes
router.post('/add-student', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'marksheet', maxCount: 1 },
    { name: 'aadhaar', maxCount: 1 }
]), studentController.createStudent);

router.get('/api/students', studentController.getAllStudents);
router.get('/api/students/:id', studentController.getStudentById);
router.put('/api/students/:id', studentController.updateStudent);
router.delete('/api/students/:id', studentController.deleteStudent);
router.put('/api/students/:id/complete', studentController.completeCourse);
router.get('/api/students/download', studentController.downloadStudents);


module.exports = router; 