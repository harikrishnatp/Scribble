import mongoose, { Schema, Document } from "mongoose";

export interface IQuizResult extends Document {
  user: mongoose.Types.ObjectId;
  playlist: mongoose.Types.ObjectId;
  quizId: string;
  score: number;
  totalQuestions: number;
  answers: any[];
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const QuizResultSchema = new Schema<IQuizResult>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    playlist: { type: mongoose.Schema.Types.ObjectId, ref: "Playlist", required: true },
    quizId: { type: String, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    answers: { type: Array, default: [] },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const QuizResult = mongoose.models.QuizResult || mongoose.model<IQuizResult>("QuizResult", QuizResultSchema);
