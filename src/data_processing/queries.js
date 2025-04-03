const {MongoClient} = require('mongodb');
const Report = require('../models/Report')

async function equityRatio(request) {
    try {
        const query = {"company_id": request.company_id};
        let data = await Report.find(query)

        const result = []

        await data.forEach((dataset) => {
            if (dataset){
                const equity = dataset.balance_sheet.passives.equity.total;
                const currentAssetsTotal = dataset.balance_sheet.actives.current_assets.total;
                const fixedAssetsTotal = dataset.balance_sheet.actives.fixed_assets.total;

                const keyFigure = equity / (currentAssetsTotal + fixedAssetsTotal);

                result.push({
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

        const result = []

        await data.forEach((dataset) => {
            if (dataset){
                const stDebt = dataset.balance_sheet.passives.debt.short_term.liabilities;
                const ltDebt = dataset.balance_sheet.passives.debt.long_term.total;
                const fixedAssetsTotal = dataset.balance_sheet.actives.fixed_assets.total;
                const currentAssetsTotal = dataset.balance_sheet.actives.current_assets.total;

                const keyFigure = (stDebt + ltDebt) / (currentAssetsTotal + fixedAssetsTotal);

                result.push({
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

        const result = []

        await data.forEach((dataset) => {
            if (dataset) {
                const legalReserve = dataset.balance_sheet.passives.equity.legal_reserve;
                const retainedEarnings = dataset.balance_sheet.passives.equity.retained_earnings;
                const equityShares = dataset.balance_sheet.passives.equity.shares;

                const keyFigure = (legalReserve + retainedEarnings) / equityShares;

                result.push({
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

        const result = []

        await data.forEach((dataset) => {
            if (dataset) {
                const liquidMoney = dataset.balance_sheet.actives.current_assets.total;
                const currentAssetsTotal = dataset.balance_sheet.actives.current_assets.total;
                const fixedAssetsTotal = dataset.balance_sheet.actives.fixed_assets.total;

                const keyFigure = liquidMoney / (currentAssetsTotal + fixedAssetsTotal);

                result.push({
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

        const result = []

        await data.forEach((dataset) => {
            if (dataset) {
                const fixedAssets = dataset.balance_sheet.actives.fixed_assets.total;
                const currentAssetsTotal = dataset.balance_sheet.actives.current_assets.total;
                const fixedAssetsTotal = dataset.balance_sheet.actives.fixed_assets.total;

                const keyFigure = fixedAssets / (currentAssetsTotal + fixedAssetsTotal);

                result.push({
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

        const result = []

        await data.forEach((dataset) => {
            if (dataset) {
                const liquidMoney = dataset.balance_sheet.actives.current_assets.liquid_assets.total;
                const stDebt = dataset.balance_sheet.passives.debt.short_term.liabilities;

                const keyFigure = liquidMoney / stDebt

                result.push({
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

        const result = []

        await data.forEach((dataset) => {
            if (dataset) {
                const liquidMoney = dataset.balance_sheet.actives.current_assets.liquid_assets.total;
                const stDebt = dataset.balance_sheet.passives.debt.short_term.liabilities;
                const receivables = dataset.balance_sheet.actives.current_assets.receivables;

                const keyFigure = (liquidMoney + receivables) / stDebt

                result.push({
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

        const result = []

        await data.forEach((dataset) => {
            if (dataset) {
                const currentAssets = dataset.balance_sheet.actives.current_assets.total;
                const stDebt = dataset.balance_sheet.passives.debt.short_term.liabilities;

                const keyFigure = currentAssets / stDebt

                result.push({
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

        const result = []

        await data.forEach((dataset) => {
            if (dataset) {
                const fixedAssets = dataset.balance_sheet.actives.fixed_assets.total;
                const shares = dataset.balance_sheet.passives.equity.shares;

                const keyFigure = shares / fixedAssets

                result.push({
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

        const result = []

        await data.forEach((dataset) => {
            if (dataset) {
                const fixedAssets = dataset.balance_sheet.actives.fixed_assets.total;
                const shares = dataset.balance_sheet.passives.equity.shares;
                const ltDebt = dataset.balance_sheet.passives.debt.long_term.total;

                const keyFigure = (shares + ltDebt) / fixedAssets

                result.push({
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

        const result = []

        await data.forEach((dataset) => {
            if (dataset) {
                const expenses = dataset.income_statement.expense.total;
                const earnings = dataset.income_statement.earnings.total;
                const shares = dataset.balance_sheet.passives.equity.shares;

                const keyFigure = (earnings - expenses) / shares

                result.push({
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

        const result = []

        await data.forEach((dataset) => {
            if (dataset) {
                const expenses = dataset.income_statement.expense.total;
                const earnings = dataset.income_statement.earnings.total;
                const financalExpense = dataset.income_statement.expense.financial_expense;
                const currentAssetsTotal = dataset.balance_sheet.actives.current_assets.total;
                const fixedAssetsTotal = dataset.balance_sheet.actives.fixed_assets.total;

                const keyFigure = (earnings + financalExpense - expenses) / (currentAssetsTotal + fixedAssetsTotal)

                result.push({
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

        const result = []

        await data.forEach((dataset) => {
            if (dataset) {
                const expenses = dataset.income_statement.expense.total;
                const earnings = dataset.income_statement.earnings.total;

                const keyFigure = (earnings - expenses) / earnings

                result.push({
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

async function customKeyFigure(request, keyFigureString){
     try {
        const query = {"company_id": request.company_id};
        let data = await Report.find(query)

        const result = {
            "company_id": request.company_id,
            "customKeyFigure": []
        };

        await data.forEach((dataset) => {
            if (dataset) {
                // do the math and logic

                result.customKeyFigure.push({
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

}

async function getCurrentKeyFigures(companyId) {
    /*
    Calls all calculation functions for all key figures and filters out the newest data from the historic values.
    The individual calculation functions return the respective key figure for all available periods. All data except
    the figures of the most recent period is removed and the array of historic values is substituted by the single most
    recent value for the respective key figure.
    :param: companyId (str): The ID of the company that should be queried
    :return: currentKeyFigures (object): An object with the most recent period and the corresponding key figure values
    */
    const historicValues = {
        equityRatio: await equityRatio({company_id: companyId}),
        debtRatio: await debtRatio({company_id: companyId}),
        selfFinancingRatio: await selfFinancingRatio({company_id: companyId}),
        workingCapitalIntensity: await workingCapitalIntensity({company_id: companyId}),
        fixedAssetIntensity: await fixedAssetIntensity({company_id: companyId}),
        cashRatio: await cashRatio({company_id: companyId}),
        quickCash: await quickCash({company_id: companyId}),
        currentRatio: await currentRatio({company_id: companyId}),
        fixedAssetCoverage1: await fixedAssetCoverage1({company_id: companyId}),
        fixedAssetCoverage2: await fixedAssetCoverage2({company_id: companyId}),
        roe: await roe({company_id: companyId}),
        roa: await roa({company_id: companyId}),
        profitMargin: await profitMargin({company_id: companyId})
    }

    for (const [keyFigure, historicValueArray] of Object.entries(historicValues)) {
        if (historicValueArray.length === 0) {
            return null // Return null if no reports were found for this company
        }
    }

    let newestPeriod = undefined

    for (const [keyFigure, historicValueArray] of Object.entries(historicValues)) {

        let highestPeriodItem = historicValueArray[0]
        Array.from(historicValueArray).forEach(item => {
            if (item.period > highestPeriodItem.period) {
                highestPeriodItem = item // Substitute the highest period item with current item if its period is newer
            }
        })

        // Substitute the array of historic values with the most current key figure value:
        historicValues[keyFigure] = highestPeriodItem.key_figure
        // Set the highest period as period for all current key figure values:
        newestPeriod = highestPeriodItem.period
    }

    /* Create a new object with the filtered historic values object (= the current key figures)
    and the corresponding period: */
    const currentKeyFigures = {
        period: newestPeriod,
        keyFigures: historicValues
    }
    return currentKeyFigures
}

async function getHistoricKeyFigures(companyId) {
    const historicValues = {
        equityRatio: await equityRatio({company_id: companyId}),
        debtRatio: await debtRatio({company_id: companyId}),
        selfFinancingRatio: await selfFinancingRatio({company_id: companyId}),
        workingCapitalIntensity: await workingCapitalIntensity({company_id: companyId}),
        fixedAssetIntensity: await fixedAssetIntensity({company_id: companyId}),
        cashRatio: await cashRatio({company_id: companyId}),
        quickCash: await quickCash({company_id: companyId}),
        currentRatio: await currentRatio({company_id: companyId}),
        fixedAssetCoverage1: await fixedAssetCoverage1({company_id: companyId}),
        fixedAssetCoverage2: await fixedAssetCoverage2({company_id: companyId}),
        roe: await roe({company_id: companyId}),
        roa: await roa({company_id: companyId}),
        profitMargin: await profitMargin({company_id: companyId})
    }

    return historicValues
}


module.exports = {
    getCurrentKeyFigures, getHistoricKeyFigures
}
