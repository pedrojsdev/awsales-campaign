import express from 'express';
import { campaignController } from '../factories/campaignController';

const router = express.Router();

// Rota para criar uma nova campanha
router.post('/', (req: any, res: any) => {
  campaignController.create(req, res);
});

// Rota para listar todas as campanhas
router.get('/', (req: any, res: any) => {
  campaignController.getAll(req, res);
});

// Rota para listar uma campanha específica por ID
router.get('/:id', (req: any, res: any) => {
  campaignController.getById(req, res);
});

// Rota para atualizar uma campanha existente
router.put('/:id', (req: any, res: any) => {
  campaignController.update(req, res);
});

// Rota para deletar uma campanha existente
router.delete('/:id', (req: any, res: any) => {
  campaignController.delete(req, res);
});

export default router;
