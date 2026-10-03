import mongoose from 'mongoose';

const aiExplanationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    explanation: {
      type: String,
      required: true
    },
    realWorldExample: {
      type: String,
      required: true
    },
    interviewAnswer: {
      type: String,
      required: true
    },
    keyPoints: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

const AIExplanation = mongoose.model('AIExplanation', aiExplanationSchema);

export default AIExplanation;
