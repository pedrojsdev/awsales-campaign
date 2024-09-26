import prisma from "../../../prisma/client";
import { CreateCampaignDTO } from "../../dtos/createCampaign";

export class CampaignRepository{
    async create(data: CreateCampaignDTO) {
        return await prisma.campaign.create({
            data: {
                nome: data.nome,
                categoria: data.categoria,
                dataFim: data.dataFim,
                dataInicio: data.dataInicio,
                status: data.dataFim < new Date() ? 'expirada' : 'ativa',
            }
        })
    }

    async findAll() {
        return await prisma.campaign.findMany()
    }

    async findById(id: number) {
        return await prisma.campaign.findUnique({where: {id}})
    }

    async update(id: number, data: Partial<CreateCampaignDTO>) {
        return await prisma.campaign.update({
            where: {id},
            data
        })
    }
}