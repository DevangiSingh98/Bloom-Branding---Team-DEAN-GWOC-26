import Project from '../models/Project.js';

// @desc    Fetch all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({});
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
    const { title, description, imageUrl, image, images, category, link, video } = req.body;

    try {
        const project = new Project({
            title,
            description,
            imageUrl: imageUrl || image,
            images: images || [],
            category,
            link,
            video
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            await project.deleteOne();
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
    const { title, description, imageUrl, image, images, category, link, video } = req.body;

    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            project.title = title !== undefined ? title : project.title;
            project.description = description !== undefined ? description : project.description;
            project.imageUrl = (imageUrl !== undefined ? imageUrl : (image !== undefined ? image : project.imageUrl));
            project.images = images !== undefined ? images : project.images;
            project.category = category !== undefined ? category : project.category;
            project.link = link !== undefined ? link : project.link;
            project.video = video !== undefined ? video : project.video;

            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { getProjects, createProject, deleteProject, updateProject };
