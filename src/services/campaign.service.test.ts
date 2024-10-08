import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CampaignService } from './campaign'
import { InMemoryCamapignRepository } from '../repositories/inMemory/inMemoryCampaignRepository'
import { CreateCampaignDTO } from '../dtos/createCampaign'
import { CampaignRepository } from '../repositories/campaignRepository'

describe("CampaignService", () => {

    let campaignService: CampaignService
    let campaignRepository: CampaignRepository

    beforeEach(() => {
        campaignRepository = new InMemoryCamapignRepository()
        campaignService = new CampaignService(campaignRepository)
        vi.resetAllMocks()
    })

    it("should create a campaign with valid data", async () => {
        const validCampaign: CreateCampaignDTO = {
            categoria: "Marketing",
            dataInicio: new Date(Date.now() + 3600 * 1000),
            dataFim: new Date(Date.now() + 7200 * 1000),
            nome: "Test",
        }

        const campaign = await campaignService.createCampaign(validCampaign)

        expect(campaign).toHaveProperty("id")
        expect(campaign.nome).toBe(validCampaign.nome)
        expect(campaign.categoria).toBe(validCampaign.categoria)
        expect(campaign.status).toBe("ativa")

        const storedCampaign = await campaignRepository.findById(campaign.id)
        expect(storedCampaign).not.toBeNull()
    })

    it("should throw an error if dataInicio is in the past", async () => {
        const invalidCampaign: CreateCampaignDTO = {
            categoria: "Marketing",
            dataInicio: new Date(Date.now() - 3600 * 1000),
            dataFim: new Date(Date.now() + 7200 * 1000),
            nome: "Test",
        }

        await expect(campaignService.createCampaign(invalidCampaign)).rejects.toThrow("A data de início deve ser igual ou posterior à data atual.")
    })

    it("should throw an error if dataFim is before dataInicio", async () => {
        const invalidCampaign: CreateCampaignDTO = {
            categoria: "Marketing",
            dataInicio: new Date(Date.now() + 3600 * 1000),
            dataFim: new Date(Date.now() - 7200 * 1000),
            nome: "Test",
        }

        await expect(campaignService.createCampaign(invalidCampaign)).rejects.toThrow("A data de fim deve ser maior que a data de início.")

        // Garantir que nenhuma campanha foi criada
        const campaigns = await campaignRepository.findAll()
        expect(campaigns).toHaveLength(0)
    })

    it("should throw an error if updating a non-existing campaing", async () => {
        await expect(campaignService.updateCampaign(0, { nome: "Campanha inexistente" })).rejects.toThrow("Campanha não encontrada.")
    })

    it('should soft delet a campaign by setting status to "pausada"', async () => {
        const campaign = await campaignService.createCampaign({
            categoria: "Marketing",
            dataInicio: new Date(Date.now() + 3600 * 1000),
            dataFim: new Date(Date.now() + 7200 * 1000),
            nome: "Test",
        })

        expect(campaign.status).toBe("ativa")

        // soft delete
        await campaignService.deleteCampaign(campaign.id)

        // Buscar campanha deletada
        const deletedCampaign = await campaignService.getCampaignById(campaign.id)
        expect(deletedCampaign?.status).toBe("pausada")

    })

    it("should throw an error when deleting a non-existing campaign", async () => {
        await expect(campaignService.deleteCampaign(0)).rejects.toThrow("Campanha não encontrada.")
    })

    it("should throw an error if dataInicio is in the past at updating a campaign", async () => {
        const validCampaign: CreateCampaignDTO = {
            categoria: "Marketing",
            dataInicio: new Date(Date.now() + 3600 * 1000),
            dataFim: new Date(Date.now() + 7200 * 1000),
            nome: "Test",
        }

        const campaign = await campaignService.createCampaign(validCampaign)

        await expect(campaignService.updateCampaign(campaign.id, {
            dataInicio: new Date(Date.now() - 3600 * 1000),
        })).rejects.toThrow("A data de início deve ser igual ou posterior à data atual.")
    })

    it("should throw an error if dataFim is before dataInicio on update", async () => {
        const validCampaign: CreateCampaignDTO = {
            categoria: "Marketing",
            dataInicio: new Date(Date.now() + 3600 * 1000),
            dataFim: new Date(Date.now() + 7200 * 1000),
            nome: "Test",
        }

        const campaign = await campaignService.createCampaign(validCampaign)

        await expect(campaignService.updateCampaign(campaign.id, {
            dataFim: new Date(Date.now() + 3600 * 1000),
            dataInicio: new Date(Date.now() + 14400 * 1000)
        })).rejects.toThrow("A data de fim deve ser maior que a data de início.")
    })

    it('should mark the campaign as "expirada" when the updated dataFim is in the past', async () => {

        // Mock da data atual (now)
        const mockNow = new Date('2023-12-01');
        vi.setSystemTime(mockNow);

        const validCampaign: CreateCampaignDTO = {
            categoria: "Marketing",
            dataInicio: new Date(mockNow.getTime() + 3600 * 1000),
            dataFim: new Date(mockNow.getTime() + 7200 * 1000),
            nome: "Test",
        }

        const campaign = await campaignService.createCampaign(validCampaign)
        
        vi.useRealTimers()
        const updatedCampaign = await campaignService.updateCampaign(campaign.id, {
            dataFim: new Date(Date.now() - 3600 * 1000)
        })
        
        expect(updatedCampaign.status).toBe("expirada")
    })

    it("should throw an error if dataFim is before dataInicio on update", async () => {
        const validCampaign: CreateCampaignDTO = {
            categoria: "Marketing",
            dataInicio: new Date(Date.now() + 3600 * 1000),
            dataFim: new Date(Date.now() + 7200 * 1000),
            nome: "Test",
        }

        const campaign = await campaignService.createCampaign(validCampaign)

        await expect(campaignService.updateCampaign(campaign.id, {
            dataFim: new Date(Date.now() + 3600 * 1000),
            dataInicio: new Date(Date.now() + 14400 * 1000)
        })).rejects.toThrow("A data de fim deve ser maior que a data de início.")
    })

})