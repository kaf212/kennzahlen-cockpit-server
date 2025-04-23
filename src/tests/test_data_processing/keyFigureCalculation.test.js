const mongoose = require('mongoose')
const Report = require('../../models/Report')
const {getCurrentKeyFigures} = require("../../data_processing/queries")



/*
The used test report is partly based on the balance sheet and income statement from chapter 2.11.2.1.
 */


describe("Test key figure calculation", () => {

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

    let calculationResults

    beforeAll(async () => {
        await mongoose.connect("mongodb://localhost:27017/kennzahlen")
        await testReport.save()
        const returnedResult = await getCurrentKeyFigures(testReport.company_id)
        calculationResults = returnedResult.keyFigures
    })

    afterAll(async () => {
        await Report.deleteMany({company_id: "_testCompany"})
        await mongoose.disconnect()
    })

    it("Test equity ratio", async () => {
        const equity = testReport.balance_sheet.passives.equity.total
        const totalCapital = testReport.balance_sheet.passives.debt.total + equity
        const expectedResult = equity / totalCapital

        expect(calculationResults["equityRatio"]).toEqual(expectedResult)

    })

    it("Test debt ratio", async () => {
        const debt = testReport.balance_sheet.passives.debt.total
        const totalCapital = testReport.balance_sheet.passives.equity.total + debt
        const expectedResult = debt / totalCapital

        expect(calculationResults["debtRatio"]).toEqual(expectedResult)

    })

    it("Test self financing ratio", async () => {
        const legalReserve = testReport.balance_sheet.passives.equity.legal_reserve
        const retainedEarnings = testReport.balance_sheet.passives.equity.retained_earnings
        const growthCapital = legalReserve + retainedEarnings
        const shares = testReport.balance_sheet.passives.equity.shares
        const expectedResult = growthCapital / shares

        expect(calculationResults["selfFinancingRatio"]).toEqual(expectedResult)

    })
})