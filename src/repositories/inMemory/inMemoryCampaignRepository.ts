import { Campaign } from "@prisma/client";
import { CreateCampaignDTO } from "../../dtos/createCampaign";
import { CampaignRepository } from "../campaignRepository";
import { randomUUID } from "crypto";

export class InMemoryCamapignRepository implements CampaignRepository {

    private campaigns: Campaign[] = [];
    private currentId: number = 1

    async create(data: CreateCampaignDTO): Promise<Campaign> {
        const campaign: Campaign = {
            nome: data.nome,
            categoria: data.categoria,
            dataFim: new Date(data.dataFim),
            dataInicio: new Date(data.dataInicio),
            status: data.dataFim < new Date() ? 'expirada' : 'ativa',
            id: this.currentId++,
            dataCadastro: new Date()
        }
        this.campaigns.push(campaign)

        return campaign
    }

    async findAll(): Promise<Campaign[]> {
        return this.campaigns
    }
    async findById(id: number): Promise<Campaign | null> {
        const campaign = this.campaigns.find(c => c.id === id)
        return campaign || null
    }
    async update(id: number, data: Partial<CreateCampaignDTO>): Promise<Campaign> {
        const campaignIndex = this.campaigns.findIndex(c => c.id === id)

        const updatedCampaign = {
            ...this.campaigns[campaignIndex],
            ...data
        }

        this.campaigns[campaignIndex] = updatedCampaign

        return updatedCampaign
    }

}