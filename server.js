import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from "express-session";

import authRoutes from './routes/authRoutes.js'; 
import dashboardRoutes from './routes/dashboardRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import userDashboardRoutes from './routes/userDashboardRoutes.js'
import testerDashboard from './routes/testerDashboardRoutes.js'
import sequelize from './config/db.js';
import User from './models/suserModel.js'
import Task, { associateTask } from './models/taskModel.js'
import Project, { associateProject } from './models/projectModel.js';
import TestCase,{associateTestCase} from './models/testCasesModel.js';
import { syncTestCaseTable } from './models/testCasesModel.js';
import { associateBugReport, syncBugReportTable } from './models/bugReportModel.js';
import Epic,{associateEpic} from './models/epicModel.js'
import ReAssign, { associateReAssign, syncReAssignTable } from './models/reAssignModel.js';
import BugReport from './models/bugReportModel.js'

dotenv.config();

const app = express();
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ["set-cookie"],
}));

app.use(
    session({
      secret: "your_session_secret",
      resave: false,
      saveUninitialized: false,
    })
  );
  

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/userDashboard',userDashboardRoutes)
app.use('/api/tester',testerDashboard)

app.use('/uploads', express.static('assets'));// path redirection




app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Server Error!' });
});

const syncModels = async () => {
    try {
        
        await sequelize.sync();
        console.log('Database models synced successfully');

        associateTask({ Project, User , TestCase,Epic });
        associateProject({ Task }); 
        associateTestCase({ Task });
        associateBugReport({ TestCase, Task, User });
        associateEpic({ Project }); 
        associateReAssign({ Task, User, BugReport,Project });
       
    } catch (error) {
        console.error('Error syncing models:', error);
    }
};

const initializeDatabase = async () => {
    await syncTestCaseTable();
    await syncBugReportTable();
    await syncReAssignTable();
  };
  
  initializeDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        await syncModels(); 
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
