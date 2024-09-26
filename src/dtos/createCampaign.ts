export interface CreateCampaignDTO {
    nome: string
    dataInicio:Date
    dataFim: Date
    categoria: string
    status?: string
}