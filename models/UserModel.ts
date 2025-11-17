import mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface IUser extends Document {
    clerkId?: string;
    email: string;
    name: string;
    avatar?: string;
    playlists: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
    {
        clerkId: { type: String, required: false, unique: false },
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        avatar: { type: String },
        playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
    },
    { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);