const Company = require("../../models/Company")
const Report = require("../../models/Report")
const Role = require("../../models/Role")
const mongoose = require("mongoose")

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/kennzahlen")
})

afterAll(async () => {
    await mongoose.disconnect()
})

describe("Tests for report collection", ()=>{

    it("insert a report into the collection", async ()=>{
        const testReport = new Report({
            company_id: "12345",
            period: "2025-Q1",
            balance_sheet: {
                actives: {
                    current_assets: {
                        total: 100000,
                        liquid_assets: {
                            total: 50000,
                            cash: 20000,
                            postal: 10000,
                            bank: 20000
                        },
                        receivables: 30000,
                        stocks: 20000
                    },
                    fixed_assets: {
                        total: 150000,
                        machines: 50000,
                        movables: 30000,
                        real_estate: 70000
                    }
                },
                passives: {
                    debt: {
                        short_term: {
                            liabilities: 20000
                        },
                        long_term: {
                            total: 100000,
                            loans: 70000,
                            mortgage: 30000
                        }
                    },
                    equity: {
                        total: 120000,
                        shares: 50000,
                        legal_reserve: 10000,
                        retained_earnings: 60000
                    }
                }
            },
            income_statement: {
                expense: {
                    total: 50000,
                    goods: 20000,
                    staff: 10000,
                    other_expenses: 5000,
                    depreciation: 2000,
                    financial: 3000,
                    real_estate: 1000
                },
                earnings: {
                    total: 100000,
                    operating_income: 70000,
                    financial: 20000,
                    real_estate: 10000
                }
            }
        })
        await testReport.save()

        foundDocument = await Report.find({company_id: "12345"})
        expect(foundDocument[0].company_id).toEqual("12345")
    })

})

describe("Tests for company collection", ()=>{
})

describe("Tests for role collection", ()=>{
})
