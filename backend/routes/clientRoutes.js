import express from 'express';
const router = express.Router();
import { getClients, createClient, updateClient, deleteClient } from '../controllers/clientController.js';

router.route('/').get(getClients).post(createClient);
router.route('/:id').delete(deleteClient).put(updateClient);

export default router;
