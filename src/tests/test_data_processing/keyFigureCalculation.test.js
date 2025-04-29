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

    it("01_test_equity_ratio", async () => {
        const equity = testReport.balance_sheet.passives.equity.total
        const totalCapital = testReport.balance_sheet.passives.debt.total + equity
        const expectedResult = equity / totalCapital

        expect(calculationResults["equityRatio"]).toEqual(expectedResult)

    })

    it("02_test_debt_ratio", async () => {
        const debt = testReport.balance_sheet.passives.debt.total
        const totalCapital = testReport.balance_sheet.passives.equity.total + debt
        const expectedResult = debt / totalCapital

        expect(calculationResults["debtRatio"]).toEqual(expectedResult)

    })

    it("03_test_self_financing_ratio", async () => {
        const legalReserve = testReport.balance_sheet.passives.equity.legal_reserve
        const retainedEarnings = testReport.balance_sheet.passives.equity.retained_earnings
        const growthCapital = legalReserve + retainedEarnings
        const shares = testReport.balance_sheet.passives.equity.shares
        const expectedResult = growthCapital / shares

        expect(calculationResults["selfFinancingRatio"]).toEqual(expectedResult)

    })

    it("04_test_working_capital_intensity", async () => {
        const workingCapital = testReport.balance_sheet.actives.current_assets.total
        const totalAssets = testReport.balance_sheet.actives.fixed_assets.total + workingCapital
        const expectedResult = workingCapital / totalAssets

        expect(calculationResults["workingCapitalIntensity"]).toEqual(expectedResult)
    })

    it("05_test_fixed_asset_intensity", async () => {
        const fixedAssets = testReport.balance_sheet.actives.fixed_assets.total
        const totalAssets = testReport.balance_sheet.actives.current_assets.total + fixedAssets
        const expectedResult = fixedAssets / totalAssets

        expect(calculationResults["fixedAssetIntensity"]).toEqual(expectedResult)
    })

    it("06_test_cash_ratio", async () => {
        const liquidAssets = testReport.balance_sheet.actives.current_assets.liquid_assets.total
        const shortTermDebt = testReport.balance_sheet.passives.debt.short_term.total
        const expectedResult = liquidAssets / shortTermDebt

        expect(calculationResults["cashRatio"]).toEqual(expectedResult)
    })

    it("07_test_quick_cash", async () => {
        const liquidAssets = testReport.balance_sheet.actives.current_assets.liquid_assets.total
        const receivables = testReport.balance_sheet.actives.current_assets.receivables
        const shortTermDebt = testReport.balance_sheet.passives.debt.short_term.total
        const expectedResult = (liquidAssets + receivables) / shortTermDebt

        expect(calculationResults["quickCash"]).toEqual(expectedResult)
    })

    it("08_test_current_ratio", async () => {
        const liquidAssets = testReport.balance_sheet.actives.current_assets.liquid_assets.total
        const receivables = testReport.balance_sheet.actives.current_assets.receivables
        const stocks = testReport.balance_sheet.actives.current_assets.stocks
        const shortTermDebt = testReport.balance_sheet.passives.debt.short_term.total
        const expectedResult = (liquidAssets + receivables + stocks) / shortTermDebt

        expect(calculationResults["currentRatio"]).toEqual(expectedResult)
    })

    it("09_test_fixed_asset_coverage_1", async () => {
        const equity = testReport.balance_sheet.passives.equity.total
        const fixedAssets = testReport.balance_sheet.actives.fixed_assets.total

        const expectedResult = equity / fixedAssets

        expect(calculationResults["fixedAssetCoverage1"]).toEqual(expectedResult)
    })

    it("10_test_fixed_asset_coverage_2", async () => {
        const equity = testReport.balance_sheet.passives.equity.total
        const longTermDebt = testReport.balance_sheet.passives.debt.long_term.total
        const fixedAssets = testReport.balance_sheet.actives.fixed_assets.total

        const expectedResult = (equity + longTermDebt) / fixedAssets

        expect(calculationResults["fixedAssetCoverage2"]).toEqual(expectedResult)
    })

    it("11_test_roe", async () => {
        const equity = testReport.balance_sheet.passives.equity.total
        const totalExpense = testReport.income_statement.expense.total
        const totalEarnings = testReport.income_statement.earnings.total
        const profit = totalEarnings - totalExpense
        const expectedResult = profit / equity

        expect(calculationResults["roe"]).toEqual(expectedResult)
    })

    it("12_test_roa", async () => {
        const workingCapital = testReport.balance_sheet.actives.current_assets.total
        const totalAssets = testReport.balance_sheet.actives.fixed_assets.total + workingCapital
        const financialExpense = testReport.income_statement.expense.financial_expense
        const totalExpense = testReport.income_statement.expense.total
        const totalEarnings = testReport.income_statement.earnings.total
        const profit = totalEarnings - totalExpense
        const expectedResult = (profit + financialExpense) / totalAssets

        expect(calculationResults["roa"]).toEqual(expectedResult)
    })

    it("13_test_profit_margin", async () => {
        const totalExpense = testReport.income_statement.expense.total
        const totalEarnings = testReport.income_statement.earnings.total
        const profit = totalEarnings - totalExpense
        const expectedResult = profit / totalEarnings

        expect(calculationResults["profitMargin"]).toEqual(expectedResult)
    })

})