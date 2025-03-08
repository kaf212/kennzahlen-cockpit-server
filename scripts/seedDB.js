const Company = require("../src/models/Company")
const Report = require("../src/models/Report")
const Role = require("../src/models/Role")


function seedDB() {
    seedCompanyCollection()
    seedReportCollection()
    seedRoleCollection()
}

async function seedCompanyCollection() {
    const documentCount = await Company.countDocuments()
    if (documentCount === 0) {
        const testCompany = new Company({
            name: "TestCompany"
        })
        await testCompany.save()
        console.log('seeded collection "company"')
    }
}

async function seedReportCollection() {
    const documentCount = await Report.countDocuments()
    if (documentCount === 0) {
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
        console.log('seeded collection "report"')
    }

}

async function seedRoleCollection() {
    const documentCount = await Role.countDocuments()
    if (documentCount === 0) {
        const testRole = new Role({
            name: "testRole",
            password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
        })
        await testRole.save()
        console.log('seeded collection "role"')
    }

}

module.exports = seedDB
