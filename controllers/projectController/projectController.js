import Project from '../../models/projectModel.js'
import Task from '../../models/taskModel.js'
import User from '../../models/userModel.js'


export const addProject = async (req, res) => {
    try {

        const { projectName, projectDescription, startDate, projectStatus } = req.body;
        
  if (!projectName || !projectDescription || !startDate || !projectStatus) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

    const newProject = new Project({
      name: projectName,
      description: projectDescription,
      startDate,
      status: projectStatus,
    });

    
    await newProject.save();

    res.status(201).json({ message: 'Project created successfully!', project: newProject });
        
    } catch (error) {
        console.log(error)
    }
}


export const displayProject  = async (req, res) => {
    try {

        const projects = await Project.findAll();
      
        res.status(200).json(projects);
        
    } catch (error) {
        console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error, unable to fetch projects.' });
    }
}

export const getProjectName = async (req, res) => {
    try {

        const projectId = req.params.id;
        const project = await Project.findOne({
            where: { id: projectId },
            attributes: ['name'], 
          });
          if (!project) {
            return res.status(404).json({ message: 'Project not found' });
          }
      
          res.status(200).json({ name: project.name });
    } catch (error) {
        console.error('Error fetching project name:', error);
    res.status(500).json({ message: 'Server error, unable to fetch project name.' });
        
    }
}

export const taskCreation = async (req, res) => {
    try {
        const { projectName, taskName, description, projectId } = req.body;
        const newTask = await Task.create({
            projectName,
            taskName,
            description,
            projectId,
            assigned: null, 
            starting: null, 
            deadline: null, 
          });
      
          res.status(201).json(newTask);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: 'Failed to create task' });
        
    }
}

export const taskList = async (req, res) => {
    try {
        const { projectId } = req.params;
        console.log('id',projectId);
        const tasks = await Task.findAll({
            where: { projectId },
            include: [
                {
                    model: User,
                    as: 'assignedUser', 
                    attributes: ['name'], 
                },
            ],
        });
        
        
    res.status(200).json(tasks);
        
    } catch (error) {
        console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
        
    }
}

export const taskModalData = async (req, res) => {
    try {
        

        
    } catch (error) {
        console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
    }
}

export const getroles = async (req, res) => {
    try {
       
        const roles = await User.findAll({   });
       
      
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching roles' });
        
    }
}

export const assignTo  = async (req, res) => {
    try {
        const { taskId, assignedTo, dueDate, deadlineDate } = req.body;
        

        const task = await Task.findOne({ where: { id: taskId } });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update the task fields
        task.assigned = assignedTo || task.assigned; // Only update if a new value is provided
        task.starting = dueDate ? new Date(dueDate) : task.starting; // Update only if dueDate is provided
        task.deadline = deadlineDate ? new Date(deadlineDate) : task.deadline; // Update only if deadlineDate is provided

        // Save the updated task
        await task.save();

        // Respond with the updated task
        res.status(200).json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Server error' });
    }
}




