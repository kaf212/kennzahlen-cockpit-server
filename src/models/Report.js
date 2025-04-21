const mongoose = require("mongoose")


// mongoose schemas translated from the original ERD JSON schema by ChatGPT:
// https://chatgpt.com/share/67cb33d1-8f8c-8011-904d-5dfaff431d58

// **** sub-schemas for nested objects inside the report schema ****
const liquidAssetsSchema = new mongoose.Schema({
    total: { type: Number, min: 0 },
    cash: { type: Number, min: 0 },
    postal: { type: Number, min: 0 },
    bank: { type: Number, min: 0 }
}, { _id: false });

const currentAssetsSchema = new mongoose.Schema({
    total: { type: Number, min: 0 },
    liquid_assets: liquidAssetsSchema,
    receivables: { type: Number, min: 0 },
    stocks: { type: Number, min: 0 }
}, { _id: false });

const fixedAssetsSchema = new mongoose.Schema({
    total: { type: Number, min: 0 },
    machines: { type: Number, min: 0 },
    movables: { type: Number, min: 0 },
    active_real_estate: { type: Number, min: 0 }
}, { _id: false });

const activesSchema = new mongoose.Schema({
    current_assets: currentAssetsSchema,
    fixed_assets: fixedAssetsSchema
}, { _id: false });

const shortTermDebtSchema = new mongoose.Schema({
    total: { type: Number, min: 0 },
    liabilities: { type: Number, min: 0 }
}, { _id: false });

const longTermDebtSchema = new mongoose.Schema({
    total: { type: Number, min: 0 },
    loans: { type: Number, min: 0 },
    mortgage: { type: Number, min: 0 }
}, { _id: false });

const debtSchema = new mongoose.Schema({
    total: { type: Number, min: 0 },
    short_term: shortTermDebtSchema,
    long_term: longTermDebtSchema
}, { _id: false });

const equitySchema = new mongoose.Schema({
    total: { type: Number, min: 0 },
    shares: { type: Number, min: 0 },
    legal_reserve: { type: Number, min: 0 },
    retained_earnings: { type: Number, min: 0 }
}, { _id: false });

const passivesSchema = new mongoose.Schema({
    debt: debtSchema,
    equity: equitySchema
}, { _id: false });

const expenseSchema = new mongoose.Schema({
    total: { type: Number, min: 0 },
    operating_expense: { type: Number, min: 0 },
    staff_expense: { type: Number, min: 0 },
    other_expenses: { type: Number, min: 0 },
    depreciation: { type: Number, min: 0 },
    financial_expense: { type: Number, min: 0 },
    real_estate_expense: { type: Number, min: 0 }
}, { _id: false });

const earningsSchema = new mongoose.Schema({
    total: { type: Number, min: 0 },
    operating_income: { type: Number, min: 0 },
    financial_income: { type: Number, min: 0 },
    real_estate_income: { type: Number, min: 0 }
}, { _id: false });

const incomeStatementSchema = new mongoose.Schema({
    expense: expenseSchema,
    earnings: earningsSchema
}, { _id: false });


// **** Main report schema ****
const reportSchema = new mongoose.Schema({
    company_id: { type: String },
    period: { type: Number, required: true},
    balance_sheet: {
        actives: activesSchema,
        passives: passivesSchema
    },
    income_statement: incomeStatementSchema
}, { timestamps: true });


const Report = mongoose.model('Report', reportSchema, "report");

module.exports = Report;