require('dotenv').config();
require('./db/conn.js')();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 8080;

const authorization = require('./middleware/authorization.js');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const postRoutes = require('./routes/postRoutes');
const contactRoutes = require('./routes/contactRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const faqRoutes = require('./routes/faqRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');
const teamRoutes = require('./routes/teamRoutes');

const courseRoute = require('./routes/courseRouter.js');
const courseSectionRoute = require('./routes/courseSectionRouter.js');
const courseSectionSubsectionRoute = require('./routes/courseSectionSubsectionRouter.js');
const aws_videos_route = require('./routes/aws_video_upload_route.js');
const aws_file_route = require('./routes/aws_file_upload.router.js');


// app.use(cors({
//   origin: ['0.0.0.0', 'http://35.173.125.140:3000/','http://localhost:3000'],
//   credentials:true
// }));


const allowedOrigins = ['https://admin.nonacademy.org','http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/student', authorization, studentRoutes);
app.use('/api/user', authorization, userRoutes);
app.use('/api/event', authorization, eventRoutes);
app.use('/api/category', authorization, categoryRoutes);
app.use('/api/post', authorization, postRoutes);
app.use('/api/contact', authorization, contactRoutes);
app.use('/api/testimonial', authorization, testimonialRoutes);
app.use('/api/faq', authorization, faqRoutes);
app.use('/api/sponsor', authorization, sponsorRoutes);
app.use('/api/team', authorization, teamRoutes);

app.use('/api/course', courseRoute);
app.use('/api/course-section', courseSectionRoute);
app.use('/api/course-section-subsection', courseSectionSubsectionRoute);
app.use('/api/aws-video-upload', aws_videos_route);
app.use('/api/aws-file-upload', aws_file_route);
app.get('/is_authenticated', authorization, (req, res) => {
  res.status(200).json({isAuthenticated: true});
});



app.listen(port, function(){ 
  console.log(`You are listening to the port ${port}`)
});