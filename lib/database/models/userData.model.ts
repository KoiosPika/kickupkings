import { Schema, model, models, Document } from "mongoose";
import { IUser } from "./user.model";

export interface IUserData extends Document {
    _id: string,
    User: IUser,

}

interface IPosition {
    position: string;
    level: number;
    availableTime: boolean;
}

const PositionSchema: Schema<IPosition> = new Schema({
    position: { type: String, required: true },
    level: { type: Number, required: true, default: 0 },
    availableTime: { type: Boolean, required: true, default: false }
});

const UserDataSchema = new Schema({
    User: { type: Schema.Types.ObjectId, ref: "User", index: true },
    formation: { type: String, default: '4-3-3' },
    coins: { type: Number, default: 0 },
    diamonds: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    Rank: { type: String, default: 'Youth Coach' },

})

const UserData = models.UserData || model('UserData', UserDataSchema);

export default UserData;