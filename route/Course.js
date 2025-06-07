const express = require('express');
const courseRouter = express.Router();

const {getAllCategory,createCategory} = require('../controller/category.js');
const {createCourse,myCourses,getCourseDetails,getAllCourses} = require('../controller/course.js');
const {createSection,deleteSection} = require('../controller/section.js');
const {createSubSection} = require('../controller/subsection.js');
const {auth,isInstructor} = require('../middleware/authorization.js');

courseRouter.get('/getallcategory',getAllCategory);
courseRouter.post('/createcategory',createCategory)
courseRouter.post('/createcourse',auth,isInstructor,createCourse);
courseRouter.get('/mycourse',auth,myCourses);
courseRouter.post('/createsection',createSection);
courseRouter.post('/createsubsection',createSubSection);
courseRouter.delete('/deletesection/:id',deleteSection);
courseRouter.post('/getcoursedetails',auth,getCourseDetails);
courseRouter.get('/getallcourses',getAllCourses);

module.exports = courseRouter;