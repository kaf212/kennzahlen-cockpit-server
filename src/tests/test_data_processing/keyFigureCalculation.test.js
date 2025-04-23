const mongoose = require('mongoose')
const Report = require('../../models/Report')


beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/kennzahlen")
    const testReport = new Report({
        company_id: "_testCompany",
        period: 2024,
        balance_sheet: {
            actives: {
                current_assets: {
                    total: 595,
                    liquid_assets: {
                        total: 70,
                        cash: 30,
                        postal: 25,
                        bank: 15
                    },
                    receivables: 300,
                    stocks: 225
                },
                fixed_assets: {
                    total: 1605,
                    machines: 295,
                    movables: 160,
                    active_real_estate: 1150
                }
            },
            passives: {
                debt: {
                    total: 1248,
                    short_term: {
                        total: 348,
                        liabilities: 348
                    },
                    long_term: {
                        total: 900,
                        loans: 200,
                        mortgage: 700
                    }
                },
                equity: {
                    total: 952,
                    shares: 700,
                    legal_reserve: 250,
                    retained_earnings: 2
                }
            }
        },
        income_statement: {
            expense: {
                total: 4287,
                operating_expense: 1768,
                staff_expense: 1790,
                other_expenses: 410,
                depreciation: 210,
                financial_expense: 59,
                real_estate_expense: 50
            },
            earnings: {
                total: 4505,
                operating_income: 4440,
                financial_income: 20,
                real_estate_income: 45
            }
        }
    })
    await testReport.save()
})

afterAll(async () => {
    await Report.deleteMany({company_id: "_testCompany"})
    await mongoose.disconnect()
})


describe("Custom key figure tests", () => {
    it("Test 1", async () => {
        const report = await Report.findOne({company_id: "_testCompany"})
        expect(report).toHaveProperty("company_id", "_testCompany")
    })
})