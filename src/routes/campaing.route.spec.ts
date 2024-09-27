import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import prisma from '../../prisma/client'
import app from '../server'
import request from 'supertest'
import { campaignService } from '../factories/campaignController'

describe("Campaign API", () => {
    beforeAll(async () => {
        await prisma.$connect()
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    beforeEach(async () => {
        vi.restoreAllMocks()
        await prisma.campaign.deleteMany({})
    })

    it('should create a new campaign with status "ativa"', async () => {
        const response = await request(app).post("/api/campaigns").send({
            nome: "Campaign",
            dataInicio: new Date(Date.now() + 3600*1000).toISOString(),
            dataFim: new Date(Date.now() + 14400*1000).toISOString(),
            categoria: "Marketing"
        })

        expect(response.status).toBe(201)
        expect(response.body.nome).toBe('Campaign')
        expect(response.body.status).toBe("ativa")
    })

    it('should return an error when dataInicio is in the past', async () => {
        const response = await request(app).post("/api/campaigns").send({
            nome: "Campaign",
            dataInicio: new Date(Date.now() - 3600*1000).toISOString(),
            dataFim: new Date(Date.now() + 3600*1000).toISOString(),
            categoria: "Marketing"
        })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("A data de início deve ser igual ou posterior à data atual.")
    })

    it('should be able to list all campaigns', async () => {
        await request(app).post("/api/campaigns").send({
            nome: "Campaign 1",
            dataInicio: new Date(Date.now() + 3600*1000).toISOString(),
            dataFim: new Date(Date.now() + 14400*1000).toISOString(),
            categoria: "Marketing"
        })

        await request(app).post("/api/campaigns").send({
            nome: "Campaign 2",
            dataInicio: new Date(Date.now() + 3600*1000).toISOString(),
            dataFim: new Date(Date.now() + 14400*1000).toISOString(),
            categoria: "Marketing"
        })

        const response = await request(app).get("/api/campaigns").send()

        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(2)
    })

    it('should be able to list a campaign by an specific ID', async () => {
        const createCampaignResponse = await request(app).post("/api/campaigns").send({
            nome: "Campaign",
            dataInicio: new Date(Date.now() + 3600*1000).toISOString(),
            dataFim: new Date(Date.now() + 14400*1000).toISOString(),
            categoria: "Marketing"
        })

        const response = await request(app).get(`/api/campaigns/${createCampaignResponse.body.id}`).send()

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createCampaignResponse.body.id)
    })

    it('should be able to update an existing campaign', async () => {
        const createCampaignResponse = await request(app).post("/api/campaigns").send({
            nome: "Campaign to update",
            dataInicio: new Date(Date.now() + 3600*1000).toISOString(),
            dataFim: new Date(Date.now() + 14400*1000).toISOString(),
            categoria: "Marketing"
        })

        // Atualiza nome da campanha
        const response = await request(app).put(`/api/campaigns/${createCampaignResponse.body.id}`).send({
            nome: "Campaign updated"
        })

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createCampaignResponse.body.id)
        expect(response.body.id).not.toBe(createCampaignResponse.body.nome)
        expect(response.body.nome).toBe("Campaign updated")
    })

    it('should be able to soft delete an existing campaign', async () => {
        const createCampaignResponse = await request(app).post("/api/campaigns").send({
            nome: "Campaign to delete",
            dataInicio: new Date(Date.now() + 3600*1000).toISOString(),
            dataFim: new Date(Date.now() + 14400*1000).toISOString(),
            categoria: "Marketing"
        })

        const response = await request(app).delete(`/api/campaigns/${createCampaignResponse.body.id}`).send()

        expect(response.status).toBe(204)

        const deletedCampaign = await request(app).get(`/api/campaigns/${createCampaignResponse.body.id}`).send()

        expect(deletedCampaign.body.id).toBe(createCampaignResponse.body.id)
        expect(deletedCampaign.body.status).toBe("pausada")
    })

    it('should return 404 if no campaign is found with the specific ID', async () => {
        const response = await request(app).get(`/api/campaigns/500`).send()

        expect(response.status).toBe(404)
    })

    it('should return 404 if updating a non-existing campaing', async () => {
        const response = await request(app).put(`/api/campaigns/999`).send({
            nome: "Campaign updated"
        })

        expect(response.status).toBe(404)
    })

    it('should return 404 if deleting a non-existing campaing', async () => {
        const response = await request(app).delete(`/api/campaigns/999`).send({
            nome: "Campaign updated"
        })

        expect(response.status).toBe(404)
    })

    it('should return 400 if get all campaigns service fail', async () => {

        vi.spyOn(campaignService, "getAllCampaigns").mockImplementationOnce(() => {
            throw new Error("Falha ao buscar todas as camapanhas")
        })

        const response = await request(app).get(`/api/campaigns`).send()

        expect(response.status).toBe(400)
    })

    it('should return 500 if get campaign by ID service fail', async () => {

        vi.spyOn(campaignService, "getCampaignById").mockImplementationOnce(() => {
            throw new Error("Falha ao buscar camapanha")
        })

        const response = await request(app).get(`/api/campaigns/0`).send()

        expect(response.status).toBe(500)
    })


    it('should return 400 if update campaign service fail', async () => {

        vi.spyOn(campaignService, "updateCampaign").mockImplementationOnce(() => {
            throw new Error("Falha ao atualizar camapanha")
        })

        const response = await request(app).put(`/api/campaigns/0`).send()

        expect(response.status).toBe(400)
    })
})