import Workspace from '../models/Workspace.js';
import Question from '../models/Question.js';

export const getWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ workspaces });
  } catch (error) {
    next(error);
  }
};

export const createWorkspace = async (req, res, next) => {
  try {
    const { name, role, experienceLevel, skills, topics, difficulty, description } = req.body;

    if (!name || !role || !experienceLevel) {
      return res.status(400).json({ message: 'Name, role, and experience level are required.' });
    }

    const normalizedSkills = Array.isArray(skills)
      ? skills.map((skill) => String(skill).trim()).filter(Boolean)
      : typeof skills === 'string'
        ? skills.split(',').map((skill) => skill.trim()).filter(Boolean)
        : [];

    const normalizedTopics = Array.isArray(topics)
      ? topics.map((topic) => String(topic).trim()).filter(Boolean)
      : typeof topics === 'string'
        ? topics.split(',').map((topic) => topic.trim()).filter(Boolean)
        : [];

    const workspace = await Workspace.create({
      user: req.user._id,
      name: name.trim(),
      role,
      experienceLevel,
      skills: normalizedSkills,
      topics: normalizedTopics,
      difficulty: difficulty || 'Medium',
      description: description || ''
    });

    res.status(201).json({ workspace });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceById = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found.' });
    }

    if (workspace.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this workspace.' });
    }

    const questions = await Question.find({ workspace: workspace._id, user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({ workspace, questions });
  } catch (error) {
    next(error);
  }
};

export const updateWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found.' });
    }

    if (workspace.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this workspace.' });
    }

    const { name, role, experienceLevel, skills, topics, difficulty, description } = req.body;
    const updates = {};

    if (name) updates.name = name.trim();
    if (role) updates.role = role;
    if (experienceLevel) updates.experienceLevel = experienceLevel;
    if (Array.isArray(skills)) updates.skills = skills.map((skill) => String(skill).trim()).filter(Boolean);
    if (Array.isArray(topics)) updates.topics = topics.map((topic) => String(topic).trim()).filter(Boolean);
    if (difficulty) updates.difficulty = difficulty;
    if (description !== undefined) updates.description = description;

    const updated = await Workspace.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    res.status(200).json({ workspace: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found.' });
    }

    if (workspace.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this workspace.' });
    }

    await Question.deleteMany({ workspace: workspace._id, user: req.user._id });
    await workspace.deleteOne();

    res.status(200).json({ message: 'Workspace deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
