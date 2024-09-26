import express from "express"
import campaignRoutes from "./routes/campaign"

const app = express()
app.use(express.json())

app.use('/api/campaigns', campaignRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running at ${PORT}`))


export default app