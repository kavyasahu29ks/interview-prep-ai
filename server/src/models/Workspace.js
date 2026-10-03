import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Interview role is required'],
      enum: ['Manual Tester', 'QA Engineer', 'Software Developer', 'Data Analyst']
    },
    experienceLevel: {
      type: String,
      required: [true, 'Experience level is required'],
      enum: ['Fresher', '1-2 years', '3-5 years']
    },
    skills: {
      type: [String],
      default: []
    },
    topics: {
      type: [String],
      default: []
    },
    difficulty: {
      type: String,
      default: 'Medium',
      enum: ['Easy', 'Medium', 'Hard']
    },
    description: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace;
