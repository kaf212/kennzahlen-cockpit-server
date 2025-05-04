const Company = require("../src/models/Company")
const Report = require("../src/models/Report")
const Role = require("../src/models/Role")
const bcrypt = require("bcrypt");


function seedDB() {
    /**
     * Executes all database seeding functions.
     *
     * @returns {void}
     */
    seedReportCollection()
    seedRoleCollection()
}

async function seedReportCollection() {
    /**
     * Checks if the test report is present in the report collection and inserts it if that isn't the case.
     * The testreport is used to validate custom key figure formulas. Its existence in the db is guaranteed
     * by this function.
     *
     * @return {Promise} A promise without a return value
     */
    const testReport = await Report.findOne({company_id: "testReport"})
    if (!testReport) {
        const testReport = new Report({
            company_id: "testReport",
            period: 2025,
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
                        active_real_estate: 70000
                    }
                },
                passives: {
                    debt: {
                        total: 120000,
                        short_term: {
                            total: 20000,
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
                    operating_expense: 20000,
                    staff_expense: 10000,
                    other_expenses: 5000,
                    depreciation: 2000,
                    financial_expense: 3000,
                    real_estate_expense: 1000
                },
                earnings: {
                    total: 100000,
                    operating_income: 70000,
                    financial_income: 20000,
                    real_estate_income: 10000
                }
            }
        })
        await testReport.save()
        console.log('Seeded collection "report"')
    }

}

async function seedRoleCollection() {
    /**
     * Deletes both roles inside the role collection upon server start and saves new ones with
     * fresh password hashes so that password changes in the .env file are always applied if the
     * server is restarted.
     * @return {Promise} A promise without a return value
     */

    await Role.deleteMany({}) // delete all documents

    const standardPassword = process.env.STANDARD_PASSWORD
    const adminPassword = process.env.ADMIN_PASSWORD

    // Raise an error if one of the passwords is undefined
    if (!standardPassword || !adminPassword) {
        throw new Error("standard or admin password could not be found in environment variables.")
    }

    // Hash the standard and admin passwords
    const standardPwHash = bcrypt.hashSync(standardPassword, bcrypt.genSaltSync(10))
    const adminPwHash = bcrypt.hashSync(adminPassword, bcrypt.genSaltSync(10))

    const adminRole = new Role({
        name: "Admin",
        password: adminPwHash,
    })
    const standardRole = new Role({
        name: "Standard",
        password: standardPwHash
    })

    // Insert the roles into the database
    await adminRole.save()
    await standardRole.save()

    console.log('Seeded collection "role"')

}

module.exports = seedDB
