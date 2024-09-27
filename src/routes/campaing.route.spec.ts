import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import prisma from '../../prisma/client'
import app from '../server'
import request from 'supertest'

describe("Campaign API", () => {
    beforeAll(async () => {
        await prisma.$connect()
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    beforeEach(async () => {
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
})