import { Schema, model, models, Document } from "mongoose";
import { IUser } from "./user.model";
import { positions } from "@/constants";

export interface IUserData extends Document {
    _id: string,
    User: IUser,
    coins: number,
    formation: string,
    diamonds: number,
    points: number,
    Rank: number,
    country: string,
    played: number,
    won: number,
    lost: number,
    scored: number,
    conceded: number,
    positions: IPosition[],
    dailyQuizzes: IQuiz[],
    dailyPredictions: IPrediction[],
    teamOverall: number,
    icons: IIcon[]
}

interface IIcon {
    name: string,
    theme: string,
    type: string
}

interface IQuiz {
    quizId: string;
    answered: number;
}

interface IPrediction {
    quizId: string;
    predictedTeam1Score: number;
    predictedTeam2Score: number;
    collected: boolean
}

interface IPosition {
    position: string;
    level: number;
    availableTime: Date;
}

const QuizSchema = new Schema({
    quizId: { type: String, required: true },
    answered: { type: Boolean, default: false }
});

const PredictionSchema = new Schema({
    matchId: { type: String, required: true },
    predictedTeam1Score: { type: Number, required: true },
    predictedTeam2Score: { type: Number, required: true },
    collected: { type: Boolean, default: false },
});

const PositionSchema: Schema<IPosition> = new Schema({
    position: { type: String, required: true },
    level: { type: Number, required: true, default: 0 },
    availableTime: { type: Date, required: true, default: Date.now }
});

const IconSchema = new Schema({
    name: { type: String },
    theme: { type: String },
    type: { type: String }
})

const UserDataSchema = new Schema({
    User: { type: Schema.Types.ObjectId, ref: "User", index: true },
    formation: { type: String, default: '4-3-3' },
    coins: { type: Number, default: 0 },
    diamonds: { type: Number, default: 50 },
    points: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    played: { type: Number, default: 0 },
    won: { type: Number, default: 0 },
    lost: { type: Number, default: 0 },
    Rank: { type: Number, default: 0 },
    scored: { type: Number, default: 0 },
    conceded: { type: Number, default: 0 },
    country: { type: String, default: 'unknown' },
    teamOverall: { type: Number, default: 0 },
    positions: {
        type: [PositionSchema], default: () => positions.map(position => ({
            position: position.symbol,
            level: 0,
        }))
    },
    icons: [IconSchema],
    dailyQuizzes: [QuizSchema],
    dailyPredictions: [PredictionSchema],
})

const UserData = models.UserData || model('UserData', UserDataSchema);

export default UserData;