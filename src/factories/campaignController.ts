import { CampaignController } from "../controllers/campaign";
import { PrismaCampaignRepository } from "../repositories/prisma/campaign";
import { CampaignService } from "../services/campaign";

export function createCampaignController(): CampaignController {
    const campaignRepository = new PrismaCampaignRepository()
    const campaignService = new CampaignService(campaignRepository)
    const campaignController = new CampaignController(campaignService)

    return campaignController
}