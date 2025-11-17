import mongoose, { Schema, Document } from "mongoose";

export interface IAssignmentResult extends Document {
  user: mongoose.Types.ObjectId;
  playlist: mongoose.Types.ObjectId;
  assignmentId: string;
  title: string;
  submission?: string;
  submitted: boolean;
  submittedAt?: Date;
  grade?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const AssignmentSchema = new Schema<IAssignmentResult>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    playlist: { type: mongoose.Schema.Types.ObjectId, ref: "Playlist", required: true },
    assignmentId: { type: String, required: true },
    title: { type: String, required: true },
    submission: { type: String },
    submitted: { type: Boolean, default: false },
    submittedAt: { type: Date },
    grade: { type: Number },
  },
  { timestamps: true }
);

export const Assignment = mongoose.models.Assignment || mongoose.model<IAssignmentResult>("Assignment", AssignmentSchema);
