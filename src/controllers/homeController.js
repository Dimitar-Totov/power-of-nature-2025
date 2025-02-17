import { Router } from "express";
import eventService from "../services/eventService.js";
import { getErrorMessage } from "../utils/errorUtils.js";

const router = Router();

router.get('/', (req, res) => {
    res.render('home', { title: 'Home Page' });
});

router.get('/catalog', async (req, res) => {
    try {
        const events = await eventService.getAll();
        res.render('events/catalog', { title: 'Catalog Page', events });
    } catch (err) {
        res.render('events/catalog', { title: 'Catalog Page', error: getErrorMessage(err) });
    }
});

router.get('/catalog/:eventId/details', async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.user?.id;

    try {
        const event = await eventService.getOne(eventId);
        const isOwner = event.owner.toString() === userId;
        const isInterested = event.interestedList.includes(userId);
        const interestedCount = event.interestedList.length;
        res.render('events/details', { title: 'Details Page', event, isOwner, userId, isInterested, interestedCount })
    } catch (err) {
        res.render('events/details', { title: 'Details Page', error: getErrorMessage(err) });
    }
});

router.get('/search', (req, res) => {
    res.render('events/search', { title: 'Search Page' });
});

router.post('/search', async (req, res) => {
    const filter = req.body;

    try {
        const events = await eventService.getAll(filter);
        res.render('events/search', { title: 'Search Page', events });
    } catch (err) {
        res.render('events/search', { title: 'Search Page', error: getErrorMessage(err) });
    }
});

export default router;