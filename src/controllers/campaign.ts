import { Request, Response } from "express";
import { CampaignService } from "../services/campaign";

export class CampaignController {
    constructor(private campaignService: CampaignService) { }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const campaign = await this.campaignService.createCampaign(req.body)
            return res.status(201).json(campaign)
        } catch (error: any) {
            return res.status(400).json({ message: error.message })
        }
    }

    async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const campaigns = await this.campaignService.getAllCampaigns()
            return res.json(campaigns)
        } catch (error: any) {
            return res.status(400).json({ message: error.message })
        }
    }

    async getById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params
        try {
            const campaign = await this.campaignService.getCampaignById(Number(id))
            if (!campaign) {
                res.status(404).json({ message: "Campanha não encontrada" })
            }

            return res.json(campaign)
        } catch (error: any) {
            return res.status(500).json({ message: "Erro ao buscar a campanha" })
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params

        try {
            await this.campaignService.updateCampaign(Number(id), req.body)
            return res.status(200).send()
        } catch (error: any) {
            if (error.message === 'Campanha não encontrada.') {
                return res.status(404).json({ message: error.message })
            }

            return res.status(400).json({ message: error.message })
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params
        try {
            await this.campaignService.deleteCampaign(Number(id))
            return res.status(204).send()
        } catch (error: any) {
            return res.status(404).json({ message: error.message })
        }
    }
}