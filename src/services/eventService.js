import Disaster from "../models/Disaster.js";

export default {
    create(eventData, userId) {
        return Disaster.create({ ...eventData, owner: userId });
    },
    getAll(filter = {}) {
        let query = Disaster.find();

        if (filter.name) {
            query = query.where({ name: { $regex: filter.name, $options: 'i' } });
        };
        if(filter.type){
            query = query.where({ type: { $regex: filter.type, $options: 'i' } });
        };
        return query;
    },
    getOne(eventId) {
        return Disaster.findById(eventId);
    },
    async update(eventData, eventId, userId) {
        const event = await Disaster.findOne({ _id: eventId }).select("owner");
        if (event.owner.toString() !== userId) {
            throw new Error('Only owners of this post can delete!');
        }
        return Disaster.findByIdAndUpdate(eventId, eventData, { runValidators: true });
    },
    async remove(eventId, userId) {
        const event = await Disaster.findOne({ _id: eventId }).select("owner");
        if (event.owner.toString() !== userId) {
            throw new Error('Only owners of this post can delete!');
        }
        return Disaster.findByIdAndDelete(eventId);
    },
    async addInterest(eventId, userId) {
        const isInterested = await Disaster.findOne({ _id: eventId, interestedList: { $in: userId } });
        if (isInterested) {
            return;
        }
        const event = await Disaster.findById(eventId);
        event.interestedList.push(userId);
        return event.save();
    },
}