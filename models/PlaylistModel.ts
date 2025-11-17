import mongoose, { Schema, Document } from "mongoose";

export interface IPlaylistVideo {
    videoId: string;
    title: string;
    duration: string;
    position: number;
}

export interface IAssignment {
    assignmentId: string;
    title: string;
    dueDate?: Date;
    completed?: boolean;
    submission?: string;
}

export interface IQuiz {
    quizId: string;
    title: string;
    questions: any[];
}

export interface IDocumentation {
    title: string;
    content: string;
}

export interface IPlaylist extends Document {
    playlistId: string;
    title: string;
    description: string;
    user: mongoose.Types.ObjectId;
    thumbnail?: string;
    totalVideos?: number;
    totalDuration?: string;
    videos: IPlaylistVideo[];
    assignments: IAssignment[];
    quizzes: IQuiz[];
    documentation: IDocumentation[];
    createdAt?: Date;
    updatedAt?: Date;
}

const VideoSchema = new Schema<IPlaylistVideo>({
    videoId: { type: String, required: true },
    title: { type: String, required: true },
    duration: { type: String },
    position: { type: Number },
});

const AssignmentSchema = new Schema<IAssignment>({
    assignmentId: { type: String, required: true },
    title: { type: String, required: true },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
    submission: { type: String },
});

const QuizSchema = new Schema<IQuiz>({
    quizId: { type: String, required: true },
    title: { type: String, required: true },
    questions: { type: Array, default: [] },
});

const DocumentationSchema = new Schema<IDocumentation>({
    title: { type: String, required: true },
    content: { type: String, required: true },
});

const PlaylistSchema = new Schema<IPlaylist>(
    {
        playlistId: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        thumbnail: { type: String },
        totalVideos: { type: Number },
        totalDuration: { type: String },
        videos: [VideoSchema],
        assignments: [AssignmentSchema],
        quizzes: [QuizSchema],
        documentation: [DocumentationSchema],
    },
    { timestamps: true }
);

export const Playlist = mongoose.models.Playlist || mongoose.model<IPlaylist>("Playlist", PlaylistSchema);
