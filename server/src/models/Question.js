import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true
    },
    category: {
      type: String,
      required: [true, 'Question category is required'],
      trim: true
    },
    difficulty: {
      type: String,
      required: [true, 'Question difficulty is required'],
      enum: ['Easy', 'Medium', 'Hard']
    },
    prompt: {
      type: String,
      required: [true, 'Question prompt is required'],
      trim: true
    },
    answer: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'Technical'
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const Question = mongoose.model('Question', questionSchema);

export default Question;
