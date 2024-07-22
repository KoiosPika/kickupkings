import { Schema, model, models, Document } from "mongoose";
import { IUser } from "./user.model";

export interface IMatch extends Document {
    _id: string,
    Player: IUser,
    Opponent: IUser,
    attacks: any,
    winner: IUser
    createdAt: Date,
    type: string
}

const MatchSchema = new Schema({
    Player: { type: Schema.Types.ObjectId, ref: "User", index: true },
    Opponent: { type: Schema.Types.ObjectId, ref: "User", index: true },
    attacks: [{
        minute: Number,
        player: String,
        outcome: String
    }],
    winner: { type: Schema.Types.ObjectId, ref: "User", index: true },
    type: { type: String },
    createdAt: { type: Date, default: Date.now }
})

const Match = models.Match || model('Match', MatchSchema);

export default Match;