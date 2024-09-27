import { CreateCampaignDTO } from "../dtos/createCampaign";
import { CampaignRepository } from "../repositories/campaignRepository";

export class CampaignService {
    constructor(private campaignRepository: CampaignRepository){}
    
    async createCampaign(data: CreateCampaignDTO){
        const now = new Date()
        
        if(new Date(data.dataInicio) < now) {
            throw new Error("A data de início deve ser igual ou posterior à data atual.")
        }

        if(new Date(data.dataFim) <= data.dataInicio) {
            throw new Error("A data de fim deve ser maior que a data de início.")
        }

        return await this.campaignRepository.create({
            ...data
        })
    }

    async getAllCampaigns() {
        return await this.campaignRepository.findAll()
    }

    async getCampaignById(id: number) {
        return await this.campaignRepository.findById(id)
    }

    async updateCampaign(id: number, data: Partial<CreateCampaignDTO>) {
        const now = new Date()

        const existingCampaign = await this.campaignRepository.findById(id)
        if(!existingCampaign) {
            throw new Error("Campanha não encontrada.")
        }

        if(data.dataInicio && new Date(data.dataInicio) < now) {
            throw new Error("A data de início deve ser igual ou posterior à data atual.")
        }

        const newDataInicio = data.dataInicio ? new Date(data.dataInicio) : existingCampaign.dataInicio
        const newDataFim = data.dataFim ? new Date(data.dataFim) : existingCampaign.dataFim

        if(newDataFim <= newDataInicio) {
            throw new Error("A data de fim deve ser maior que a data de início.")
        }

        const status = newDataFim < now ? "expirada" : "ativa"

        return await this.campaignRepository.update(id, {
            ...data,
            status
        })
    }

    async deleteCampaign(id: number) {
        const existingCampaign = await this.campaignRepository.findById(id)
        if(!existingCampaign) {
            throw new Error("Campanha não encontrada.")
        }

        return await this.campaignRepository.update(id, {
            status: "pausada"
        })
    }
}