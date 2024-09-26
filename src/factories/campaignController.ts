import { CampaignController } from "../controllers/campaign";
import { PrismaCampaignRepository } from "../repositories/prisma/campaign";
import { CampaignService } from "../services/campaign";

const campaignRepository = new PrismaCampaignRepository()
const campaignService = new CampaignService(campaignRepository)
export const campaignController = new CampaignController(campaignService)
