import { Router } from "express";
import authService from "../services/authService.js";
import { AUTH_COOKIE_NAME } from "../config/authCookie.js";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import eventService from "../services/eventService.js";

const router = Router();

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register', { title: 'Register Page' });
});

router.post('/register', isGuest, async (req, res) => {
    const userData = req.body;

    try {
        const token = await authService.register(userData);
        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true });
        res.redirect('/');
    } catch (err) {
        const error = getErrorMessage(err);
        res.render('auth/register', { error, user: userData, title: 'Register Page' });
    }

});

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login', { title: 'Login Page' });
});

router.post('/login', isGuest, async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await authService.login(email, password);
        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true });
        res.redirect('/');
    } catch (err) {
        const error = getErrorMessage(err);
        res.render('auth/login', { error, user: { email }, title: 'Login Page' });
    }
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME);
    res.redirect('/');
});

router.get('/event/create', isAuth, (req, res) => {
    res.render('events/create', { title: 'Create Page' });
});
router.post('/event/create', isAuth, async (req, res) => {
    const eventData = req.body;
    const userId = req.user.id;
    try {
        await eventService.create(eventData, userId);
        res.redirect('/catalog');
    } catch (err) {
        res.render('events/create', { error: getErrorMessage(err), eventData, title: 'Create Page' });
    }
});

router.get('/:eventId/edit', isAuth, async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.user?.id;
    try {
        const event = await eventService.getOne(eventId);
        const types = getTypesData(event.type)
        if (event.owner.toString() !== userId) {
            return res.redirect('/catalog');
        }
        res.render('events/edit', { title: 'Edit Page', event, types });
    } catch (err) {
        res.render('events/edit', { title: 'Edit Page', error: getErrorMessage(err) });
    }
});

router.post('/:eventId/edit', isAuth, async (req, res) => {
    const eventData = req.body;
    const eventId = req.params.eventId;
    const userId = req.user?.id;
    try {
        await eventService.update(eventData, eventId, userId);
        res.redirect(`/catalog/${eventId}/details`);
    } catch (err) {
        res.render('events/edit', { title: 'Edit Page', error: getErrorMessage(err) });
    }
});

router.get('/:eventId/delete', isAuth, async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.user?.id;
    try {
        await eventService.remove(eventId, userId);
        res.redirect('/catalog');
    } catch (err) {
        res.setError(getErrorMessage(err));
        res.redirect('/catalog');
    }
});

router.get('/:eventId/interested', isAuth, async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.user?.id;
    try {
        await eventService.addInterest(eventId, userId);
    } catch (err) {
        res.setError(getErrorMessage(err));
    }
    res.redirect(`/catalog/${eventId}/details`);
});

function getTypesData(category) {
    const categoriesMap = {
        'Wildfire': 'Wildfire',
        'Flood': 'Flood',
        'Earthquake': 'Earthquake',
        'Hurricane': 'Hurricane',
        'Drought': 'Drought',
        'Tsunami': 'Tsunami',
        'Other': 'Other',
    };

    const categories = Object.keys(categoriesMap).map(value => ({
        value,
        label: categoriesMap[value],
        selected: value === category ? 'selected' : '',
    }));
    return categories;
}

export default router;