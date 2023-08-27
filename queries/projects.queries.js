const Project = require("../database/models/projects.model");

exports.getProjects = () => {
  return Project.find({}).exec();
};

exports.createProject = async (project) => {
  try {
    const newProject = new Project({
      reference: project.reference,
      status: project.status,
      createdBy: project.createdBy,
      title: project.title,
      type: project.type,
      description: project.description,
    });
    return newProject.save();
  } catch (e) {
    throw e;
  }
};

exports.findProjectPerId = (id) => {
  return Project.findById(id).exec();
};

exports.updateProject = async (id, updatedData) => {
  try {
    return await Project.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).exec();
  } catch (e) {
    throw e;
  }
};

exports.deleteProject = async (id) => {
  try {
    return await Project.findByIdAndDelete(id).exec();
  } catch (e) {
    throw e;
  }
};
