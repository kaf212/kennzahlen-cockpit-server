const {MongoClient} = require('mongodb');
const Report = require('../models/Report.js')
const math = require('mathjs');

async function equityRatio(request) {
    try {
        const query = {"company_id": request.company_id};
        let data = await Report.find(query)
        console.log(data);

        const result = {
            "company_id": request.company_id,
            "equity_ratios": []
        };

        await data.forEach((dataset) => {
            if (dataset){
                const equity = dataset.balance_sheet.passives.equity.total;
                const currentAssetsTotal = dataset.balance_sheet.actives.current_assets.total;
                const fixedAssetsTotal = dataset.balance_sheet.actives.fixed_assets.total;

                const keyFigure = equity / (currentAssetsTotal + fixedAssetsTotal);

                result.equity_ratios.push({
                    "period": dataset.period,
                    "key_figure": keyFigure
                });
            }else{
                console.log("empty dataset")
            }
        })
        return result;

    } catch (e) {
        console.error(e);
        return false;
    }
}

async function debtRatio(request) {
    try {
        const query = {"company_id": request.company_id};
        let data = await Report.find(query)

        const result = {
            "company_id": request.company_id,
            "debt_ratios": []
        };

        await data.forEach((dataset) => {
            if (dataset){
                const stDebt = dataset.balance_sheet.passives.debt.short_term.liabilities;
                const ltDebt = dataset.balance_sheet.passives.debt.long_term.total;
                const fixedAssetsTotal = dataset.balance_sheet.actives.fixed_assets.total;
                const currentAssetsTotal = dataset.balance_sheet.actives.current_assets.total;

                const keyFigure = (stDebt + ltDebt) / (currentAssetsTotal + fixedAssetsTotal);

                result.debt_ratios.push({
                    "period": dataset.period,
                    "key_figure": keyFigure
                });
            }else{
                console.log("empty dataset")
            }
        })
        return result;

    } catch (e) {
        console.error(e);
        return false;
    }
}

async function selfFinancingRatio(request) {
    try {
        const query = {"company_id": request.company_id};
        let data = await Report.find(query)

        const result = {
            "company_id": request.company_id,
            "self_financing_ratios": []
        };

        await data.forEach((dataset) => {
            if (dataset) {
                const legalReserve = dataset.balance_sheet.passives.equity.legal_reserve;
                const retainedEarnings = dataset.balance_sheet.passives.equity.retained_earnings;
                const equityShares = dataset.balance_sheet.passives.equity.shares;

                const keyFigure = (legalReserve + retainedEarnings) / equityShares;

                result.self_financing_ratios.push({
                    "period": dataset.period,
                    "key_figure": keyFigure
                });
            }
        });
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function workingCapitalIntensity(request) {
    try {
        const query = {"company_id": request.company_id};
        let data = await Report.find(query)

        const result = {
            "company_id": request.company_id,
            "working_capital_intensity": []
        };

        await data.forEach((dataset) => {
            if (dataset) {
                const liquidMoney = dataset.balance_sheet.actives.current_assets.total;
                const currentAssetsTotal = dataset.balance_sheet.actives.current_assets.total;
                const fixedAssetsTotal = dataset.balance_sheet.actives.fixed_assets.total;

                const keyFigure = liquidMoney / (currentAssetsTotal + fixedAssetsTotal);

                result.working_capital_intensity.push({
                    "period": dataset.period,
                    "key_figure": keyFigure
                });
            }
        });
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function fixedAssetIntensity(request) {
    try {
        const query = {"company_id": request.company_id};
        let data = await Report.find(query)

        const result = {
            "company_id": request.company_id,
            "fixed_asset_intensity": []
        };

        await data.forEach((dataset) => {
            if (dataset) {
                const fixedAssets = dataset.balance_sheet.actives.fixed_assets.total;
                const currentAssetsTotal = dataset.balance_sheet.actives.current_assets.total;
                const fixedAssetsTotal = dataset.balance_sheet.actives.fixed_assets.total;

                const keyFigure = fixedAssets / (currentAssetsTotal + fixedAssetsTotal);

                result.fixed_asset_intensity.push({
                    "period": dataset.period,
                    "key_figure": keyFigure
                });
            }
        });
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function cashRatio(request){
    try {
        const query = {"company_id": request.company_id};
        let data = await Report.find(query)

        const result = {
            "company_id": request.company_id,
            "cash_ratio": []
        };

        await data.forEach((dataset) => {
            if (dataset) {
                const liquidMoney = dataset.balance_sheet.actives.current_assets.liquid_assets.total;
                const stDebt = dataset.balance_sheet.passives.debt.short_term.liabilities;

                const keyFigure = liquidMoney / stDebt

                result.cash_ratio.push({
                    "period": dataset.period,
                    "key_figure": keyFigure
                });
            }
        });
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function quickCash(request){
    try {
        const query = {"company_id": request.company_id};
        let data = await Report.find(query)

        const result = {
            "company_id": request.company_id,
            "quick_cash": []
        };

        await data.forEach((dataset) => {
            if (dataset) {
                const liquidMoney = dataset.balance_sheet.actives.current_assets.liquid_assets.total;
                const stDebt = dataset.balance_sheet.passives.debt.short_term.liabilities;
                const receivables = dataset.balance_sheet.actives.current_assets.receivables;

                const keyFigure = (liquidMoney + receivables) / stDebt

                result.quick_cash.push({
                    "period": dataset.period,
                    "key_figure": keyFigure
                });
            }
        });
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function currentRatio(request){
    try {
        const query = {"company_id": request.company_id};
        let data = await Report.find(query)

        const result = {
            "company_id": request.company_id,
            "current_ratio": []
        };

        await data.forEach((dataset) => {
            if (dataset) {
                const currentAssets = dataset.balance_sheet.actives.current_assets.total;
                const stDebt = dataset.balance_sheet.passives.debt.short_term.liabilities;

                const keyFigure = currentAssets / stDebt

                result.current_ratio.push({
                    "period": dataset.period,
                    "key_figure": keyFigure
                });
            }
        });
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function fixedAssetCoverage1(request){
    try {
        const query = {"company_id": request.company_id};
        let data = await Report.find(query)

        const result = {
            "company_id": request.company_id,
            "fixed_Asset_Coverage1": []
        };

        await data.forEach((dataset) => {
            if (dataset) {
                const fixedAssets = dataset.balance_sheet.actives.fixed_assets.total;
                const shares = dataset.balance_sheet.passives.equity.shares;

                const keyFigure = shares / fixedAssets

                result.fixed_Asset_Coverage1.push({
                    "period": dataset.period,
                    "key_figure": keyFigure
                });
            }
        });
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function fixedAssetCoverage2(request){
    try {
        const query = {"company_id": request.company_id};
        let data = await Report.find(query)

        const result = {
            "company_id": request.company_id,
            "fixed_Asset_Coverage2": []
        };

        await data.forEach((dataset) => {
            if (dataset) {
                const fixedAssets = dataset.balance_sheet.actives.fixed_assets.total;
                const shares = dataset.balance_sheet.passives.equity.shares;
                const ltDebt = dataset.balance_sheet.passives.debt.long_term.total;

                const keyFigure = (shares + ltDebt) / fixedAssets

                result.fixed_Asset_Coverage2.push({
                    "period": dataset.period,
                    "key_figure": keyFigure
                });
            }
        });
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

//return on equity
async function roe(request){
    try {
        const query = {"company_id": request.company_id};
        let data = await Report.find(query)

        const result = {
            "company_id": request.company_id,
            "roe": []
        };

        await data.forEach((dataset) => {
            if (dataset) {
                const expenses = dataset.income_statement.expense.total;
                const earnings = dataset.income_statement.earnings.total;
                const shares = dataset.balance_sheet.passives.equity.shares;

                const keyFigure = (earnings - expenses) / shares

                result.roe.push({
                    "period": dataset.period,
                    "key_figure": keyFigure
                });
            }
        });
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

//return on assets
async function roa(request){
    try {
        const query = {"company_id": request.company_id};
        let data = await Report.find(query)

        const result = {
            "company_id": request.company_id,
            "roa": []
        };

        await data.forEach((dataset) => {
            if (dataset) {
                const expenses = dataset.income_statement.expense.total;
                const earnings = dataset.income_statement.earnings.total;
                const financalExpense = dataset.income_statement.expense.financial_expense;
                const currentAssetsTotal = dataset.balance_sheet.actives.current_assets.total;
                const fixedAssetsTotal = dataset.balance_sheet.actives.fixed_assets.total;

                const keyFigure = (earnings + financalExpense - expenses) / (currentAssetsTotal + fixedAssetsTotal)

                result.roa.push({
                    "period": dataset.period,
                    "key_figure": keyFigure
                });
            }
        });
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function profitMargin(request){
    try {
        const query = {"company_id": request.company_id};
        let data = await Report.find(query)

        const result = {
            "company_id": request.company_id,
            "profitMargin": []
        };

        await data.forEach((dataset) => {
            if (dataset) {
                const expenses = dataset.income_statement.expense.total;
                const earnings = dataset.income_statement.earnings.total;

                const keyFigure = (earnings - expenses) / earnings

                result.profitMargin.push({
                    "period": dataset.period,
                    "key_figure": keyFigure
                });
            }
        });
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

function searchReport(obj, keyString){
    if (!obj || typeof obj !== 'object') return null
    else{
        if (obj.hasOwnProperty(keyString)) return obj[keyString];

        for (let i in obj){
            let value = searchReport(obj[i], keyString)
            if (value !== null) return value;
        }

    }
    return null
}

async function customKeyFigure(request, keyFigureString){
     try {
        const query = {"company_id": request.company_id};
        // lean: makes mongodb return pure JSON objects, which better enables recursive processing of the object
        let data = await Report.find(query).lean()

         const result = {
             "company_id": request.company_id,
             "customKeyFigure": []
         };

        for (const dataset of data) {
            if (dataset) {
                let variables = new Set(keyFigureString.match(/[a-zA-Z_]\w*/g));
                 let values = {}

                 variables.forEach( (string)=>{
                let value = searchReport(dataset, string)
                 if (value !== null){
                     values[string] = value
                 }else{
                     console.log('value not found')
                 }
                 })
                let keyFigure = math.evaluate(keyFigureString, values)

                result.customKeyFigure.push({
                    "period": dataset.period,
                    "key_figure": keyFigure
                });
            }
        }
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function printResults() {
    console.log(await equityRatio({ company_id: "12345" }));
    console.log(await debtRatio({ company_id: "12345" }));
    console.log(await selfFinancingRatio({ company_id: "12345" }));
    console.log(await workingCapitalIntensity({ company_id: "12345" }));
    console.log(await fixedAssetIntensity({ company_id: "12345" }));
    console.log(await cashRatio({ company_id: "12345" }));
    console.log(await quickCash({ company_id: "12345" }));
    console.log(await currentRatio({ company_id: "12345" }));
    console.log(await fixedAssetCoverage1({ company_id: "12345" }));
    console.log(await fixedAssetCoverage2({ company_id: "12345" }));
    console.log(await roe({ company_id: "12345" }));
    console.log(await roa({ company_id: "12345" }));
    console.log(await profitMargin({ company_id: "12345" }));
    console.log(await customKeyFigure({ company_id: "12345" }, "receivables/(stocks+cash)"));

}


module.exports = {customKeyFigure}
