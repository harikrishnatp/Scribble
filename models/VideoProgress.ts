import mongoose, { Schema, Document } from "mongoose";

export interface IVideoProgress extends Document {
  user: mongoose.Types.ObjectId;
  playlist: mongoose.Types.ObjectId;
  videoId: string;
  progress: number; // 0-100
  completed: boolean;
  watchedAt?: Date;
  totalWatchTime?: number; // seconds
  createdAt?: Date;
  updatedAt?: Date;
}

const VideoProgressSchema = new Schema<IVideoProgress>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    playlist: { type: mongoose.Schema.Types.ObjectId, ref: "Playlist", required: true },
    videoId: { type: String, required: true },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    watchedAt: { type: Date },
    totalWatchTime: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const VideoProgress = mongoose.models.VideoProgress || mongoose.model<IVideoProgress>("VideoProgress", VideoProgressSchema);
