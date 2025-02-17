import { Schema, model, Types } from "mongoose";

const disasterSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
    },
    type: {
        type: String,
        required: true,
        enum: ["Wildfire", "Flood", "Earthquake", "Hurricane", "Drought", "Tsunami", "Other"],
    },
    year: {
        type: Number,
        required: true,
        min: 0,
        max: 2024,
    },
    location: {
        type: String,
        required: true,
        minLength: 3,
    },
    image: {
        type: String,
        required: true,
        match: /^http?s:\/\//,
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
    },
    interestedList: [{
        type: Types.ObjectId,
        ref: 'User',
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User',
    }
});

const Disaster = model('Disaster', disasterSchema);

export default Disaster;