import express from 'express'
import { client } from '../db';
import { authenticate, authorize} from '../middlewares';

export const listingsRouter = express.Router()

listingsRouter.get('/', async (req, res) => {
    const listings = await client.listing.findMany({
        include: {
            owner: {
                select: {
                    id: true,
                    email: true,
                },
            },
        },
    });

    res.json(listings);
})

listingsRouter.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const listing = await client.listing.findUnique({
        where: { id },
        include: {
            owner: {
                select: {
                    id: true,
                    email: true,
                },
            },
        },
    });

    if (!listing) {
        return res.status(404).json({
            message: 'Объявление не найдено',
        });
    }

    res.json(listing);
})

listingsRouter.post('/', authenticate, async (req, res) => {
    const { title, description, price, category } = req.body;

    const listing = await client.listing.create({
        data: {
            title,
            description,
            price: Number(price),
            category,
            ownerId: req.user.id
        },
    });

    res.status(201).json(listing);
})

listingsRouter.patch('/:id', authenticate, async (req, res) => {
    const id = Number(req.params.id);
    // находим объявление в БД
    const listing = await client.listing.findUnique({
        where: { id },
    });

    if (!listing) {
    return res.status(404).json({
        message: 'Объявление не найдено',
    });
    }

    // редактировать объявление может владелец или модератор
    const isOwner = req.user.id == listing.ownerId
    const isModerator = req.user.role == 'MODERATOR'

    if (!isModerator && !isOwner){
        res.status(403).json({
            error: 'Недостаточно прав'
        })
    }
    else{
        const updateListing = await client.listing.update({
        where: { id },
        data: req.body,
    });
        res.json(updateListing);
    }
})

listingsRouter.delete('/:id', authenticate, authorize('MODERATOR', 'ADMIN'), async (req, res) => {
    const id = Number(req.params.id);
    await client.listing.delete({
        where: { id },
    });

    res.status(204).send();
})