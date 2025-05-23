const Report = require('../models/Report')
const CustomKeyFigure = require('../models/customKeyFigure')
const math = require('mathjs');

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
                const equity = dataset.balance_sheet.passives.equity.total

                const keyFigure = equity / fixedAssets

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
                const equity = dataset.balance_sheet.passives.equity.total
                const ltDebt = dataset.balance_sheet.passives.debt.long_term.total;

                const keyFigure = (equity + ltDebt) / fixedAssets

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
                const equity = dataset.balance_sheet.passives.equity.total

                const keyFigure = (earnings - expenses) / equity

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


                for (const [accountName, accountValue] of Object.entries(values)) {
                    if (typeof accountValue === 'object') {
                        /* If the account is a group of subaccounts (for example current_assets),
                        the total value of this group should be used instead of the entire object for evaluation. */
                        values[accountName] = accountValue.total
                    }
                }
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


async function getHistoricKeyFigures(companyId) {
    /**
     * Calls all the query functions of the regular key figures which all return
     * an array of key figure data for each available accounting year. These historical arrays are then
     * stored in the historicalValues object that maps the name of the key figure to its corresponding
     * historical data. If any of the historical arrays are empty, null is returned. Else, the historical
     * data of the custom key figures is also retrieved and saved into historicalValues.
     *
     * @param {String} companyId - The ID of the company that is being queried
     * @returns {Object} An object that maps the key figures to their historical data
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

    const historicCustomKeyFigureValues = await getHistoricCustomKeyFigures(companyId)

    if (historicCustomKeyFigureValues !== null) {
        for (const [customKeyFigure, historicValueArray] of Object.entries(historicCustomKeyFigureValues)) {
            // Create a new entry for the custom key figure in the historicalValues object
            historicValues[customKeyFigure] = historicValueArray
        }
    }

    return historicValues
}

async function getHistoricCustomKeyFigures(companyId) {
    /**
     * Gets all custom key figures from the database and iteratively retrieves their historical data by calling
     * the customKeyFigure() query function. Similarly to getHistoricKeyFigures(), the historical arrays
     * are then mapped to the name of the custom key figure inside the historicValues object.
     *
     * @param {String} companyId - The ID of the company that is being queried
     * @returns {Object} An object that maps the custom key figures to their historical data
     */
    const historicValues = {}
    const customKeyFigures = await CustomKeyFigure.find()
    if (customKeyFigures.length === 0) {
        return null
    }

    for (const keyFigure of customKeyFigures) {
        const result = await customKeyFigure({ company_id: companyId }, keyFigure.formula)
        historicValues[keyFigure.name] = result.customKeyFigure
    }

    return historicValues
}

function extractCurrentKeyFigures(historicValues) {
    /**
     * Filters out the newest data from the historic key figure values.
     * The individual calculation functions return the respective key figure for all available periods.
     * All data except the figures of the most recent period is removed and the array of historic values
     * is substituted by the single most recent value for the respective key figure.
     *
     * @param {Object} historicValues - An object with the historic values for multiple key figures
     * @return {Object} currentKeyFigures - An object with the most recent period
     *                                      and the corresponding key figure values
     */

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


async function getCurrentKeyFigures(companyId) {
    /**
     * Calls all calculation functions for all key figures and returns the most current values.
     * @param companyId (str): The ID of the company that should be queried
     * @return currentKeyFigures (object): An object with the most recent period
     *                                     and the corresponding key figure values
     */
    const historicValues = await getHistoricKeyFigures(companyId)
    const historicCustomKeyFigureValues = await getHistoricCustomKeyFigures(companyId)

    if (historicValues === null) {
        return null
    }
    const currentValues = extractCurrentKeyFigures(historicValues)
    if (historicCustomKeyFigureValues !== null) {
        const currentCustomKeyFigureValues = extractCurrentKeyFigures(historicCustomKeyFigureValues)

        for (const [customKeyFigure, value] of Object.entries(currentCustomKeyFigureValues.keyFigures)) {
            currentValues.keyFigures[customKeyFigure] = value
        }
    }

    return currentValues

}




module.exports = {
    getCurrentKeyFigures, getHistoricKeyFigures, customKeyFigure
}
