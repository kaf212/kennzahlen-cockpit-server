const mongoose = require("mongoose")


// mongoose schemas translated from the original ERD JSON schema by ChatGPT:
// https://chatgpt.com/share/67cb33d1-8f8c-8011-904d-5dfaff431d58

// **** sub-schemas for nested objects inside the report schema ****
const liquidAssetsSchema = new mongoose.Schema({
    total: { type: Number },
    cash: { type: Number },
    postal: { type: Number },
    bank: { type: Number }
}, { _id: false });

const currentAssetsSchema = new mongoose.Schema({
    total: { type: Number },
    liquid_assets: liquidAssetsSchema,
    receivables: { type: Number },
    stocks: { type: Number }
}, { _id: false });

const fixedAssetsSchema = new mongoose.Schema({
    total: { type: Number },
    machines: { type: Number },
    movables: { type: Number },
    real_estate: { type: Number }
}, { _id: false });

const activesSchema = new mongoose.Schema({
    current_assets: currentAssetsSchema,
    fixed_assets: fixedAssetsSchema
}, { _id: false });

const shortTermDebtSchema = new mongoose.Schema({
    liabilities: { type: Number }
}, { _id: false });

const longTermDebtSchema = new mongoose.Schema({
    total: { type: Number },
    loans: { type: Number },
    mortgage: { type: Number }
}, { _id: false });

const debtSchema = new mongoose.Schema({
    short_term: shortTermDebtSchema,
    long_term: longTermDebtSchema
}, { _id: false });

const equitySchema = new mongoose.Schema({
    total: { type: Number },
    shares: { type: Number },
    legal_reserve: { type: Number },
    retained_earnings: { type: Number }
}, { _id: false });

const passivesSchema = new mongoose.Schema({
    debt: debtSchema,
    equity: equitySchema
}, { _id: false });

const expenseSchema = new mongoose.Schema({
    total: { type: Number },
    goods: { type: Number },
    staff: { type: Number },
    other_expenses: { type: Number },
    depreciation: { type: Number },
    financial: { type: Number },
    real_estate: { type: Number }
}, { _id: false });

const earningsSchema = new mongoose.Schema({
    total: { type: Number },
    operating_income: { type: Number },
    financial: { type: Number },
    real_estate: { type: Number }
}, { _id: false });

const incomeStatementSchema = new mongoose.Schema({
    expense: expenseSchema,
    earnings: earningsSchema
}, { _id: false });


// **** Main report schema ****
const reportSchema = new mongoose.Schema({
    company_id: { type: String },
    period: { type: Number },
    balance_sheet: {
        actives: activesSchema,
        passives: passivesSchema
    },
    income_statement: incomeStatementSchema
}, { timestamps: true });


const Report = mongoose.model('Report', reportSchema, "report");

module.exports = Report;