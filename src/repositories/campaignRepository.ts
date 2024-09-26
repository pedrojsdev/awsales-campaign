import { Campaign } from "@prisma/client"
import { CreateCampaignDTO } from "../dtos/createCampaign"

export interface CampaignRepository {
    create(data: CreateCampaignDTO): Promise<void>
    findAll(): Promise<Campaign[]>
    findById(id: number): Promise<Campaign | null>
    update(id: number, data: Partial<CreateCampaignDTO>): Promise<void>
}