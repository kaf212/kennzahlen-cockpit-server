const {MongoClient} = require('mongodb');

async function equityRatio(request) {
    try {
        const uri = "mongodb://localhost:27017/";
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db("kennzahlen")
        const query = {"company_id": request.company_id};
        let data = database.collection('report').find(query)

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
        await client.close();
        return result;

    } catch (e) {
        console.error(e);
        return false;
    }
}

async function debtRatio(request) {
    try {
        const uri = "mongodb://localhost:27017/";
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db("kennzahlen")
        const query = {"company_id": request.company_id};
        let data = database.collection('report').find(query)

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
        await client.close();
        return result;

    } catch (e) {
        console.error(e);
        return false;
    }
}

async function selfFinancingRatio(request) {
    try {
        const uri = "mongodb://localhost:27017/";
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db("kennzahlen")
        const query = {"company_id": request.company_id};
        let data = database.collection('report').find(query)

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
        await client.close();
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function workingCapitalIntensity(request) {
    try {
        const uri = "mongodb://localhost:27017/";
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db("kennzahlen")
        const query = {"company_id": request.company_id};
        let data = database.collection('report').find(query)

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
        await client.close();
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function fixedAssetIntensity(request) {
    try {
        const uri = "mongodb://localhost:27017/";
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db("kennzahlen")
        const query = {"company_id": request.company_id};
        let data = database.collection('report').find(query)

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
        await client.close();
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function cashRatio(request){
    try {
        const uri = "mongodb://localhost:27017/";
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db("kennzahlen")
        const query = {"company_id": request.company_id};
        let data = database.collection('report').find(query)

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
        await client.close();
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function quickCash(request){
    try {
        const uri = "mongodb://localhost:27017/";
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db("kennzahlen")
        const query = {"company_id": request.company_id};
        let data = database.collection('report').find(query)

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
        await client.close();
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function currentRatio(request){
    try {
        const uri = "mongodb://localhost:27017/";
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db("kennzahlen")
        const query = {"company_id": request.company_id};
        let data = database.collection('report').find(query)

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
        await client.close();
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function fixedAssetCoverage1(request){
    try {
        const uri = "mongodb://localhost:27017/";
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db("kennzahlen")
        const query = {"company_id": request.company_id};
        let data = database.collection('report').find(query)

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
        await client.close();
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function fixedAssetCoverage2(request){
    try {
        const uri = "mongodb://localhost:27017/";
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db("kennzahlen")
        const query = {"company_id": request.company_id};
        let data = database.collection('report').find(query)

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
        await client.close();
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

//return on equity
async function roe(request){
    try {
        const uri = "mongodb://localhost:27017/";
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db("kennzahlen")
        const query = {"company_id": request.company_id};
        let data = database.collection('report').find(query)

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
        await client.close();
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

//return on assets
async function roa(request){
    try {
        const uri = "mongodb://localhost:27017/";
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db("kennzahlen")
        const query = {"company_id": request.company_id};
        let data = database.collection('report').find(query)

        const result = []

        await data.forEach((dataset) => {
            if (dataset) {
                const expenses = dataset.income_statement.expense.total;
                const earnings = dataset.income_statement.earnings.total;
                const financalExpense = dataset.income_statement.expense.financial;
                const currentAssetsTotal = dataset.balance_sheet.actives.current_assets.total;
                const fixedAssetsTotal = dataset.balance_sheet.actives.fixed_assets.total;

                const keyFigure = (earnings + financalExpense - expenses) / (currentAssetsTotal + fixedAssetsTotal)

                result.push({
                    "period": dataset.period,
                    "key_figure": keyFigure
                });
            }
        });
        await client.close();
        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function profitMargin(request){
    try {
        const uri = "mongodb://localhost:27017/";
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db("kennzahlen")
        const query = {"company_id": request.company_id};
        let data = database.collection('report').find(query)

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
        await client.close();
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

async function getCurrentKeyFigures(company_id) {
    const historicValues = {
        equityRatio: await equityRatio({company_id}),
        debtRatio: await debtRatio({company_id}),
        selfFinancingRatio: await selfFinancingRatio({company_id}),
        workingCapitalIntensity: await workingCapitalIntensity({company_id}),
        fixedAssetIntensity: await fixedAssetIntensity({company_id}),
        cashRatio: await cashRatio({company_id}),
        quickCash: await quickCash({company_id}),
        currentRatio: await currentRatio({company_id}),
        fixedAssetCoverage1: await fixedAssetCoverage1({company_id}),
        fixedAssetCoverage2: await fixedAssetCoverage2({company_id}),
        roe: await roe({company_id}),
        roa: await roa({company_id}),
        profitMargin: await profitMargin({company_id})
    }

    let newestPeriod = undefined

    for (const [keyFigure, historicValueArray] of Object.entries(historicValues)) {

        let highestPeriodItem = historicValueArray[0]
        Array.from(historicValueArray).forEach(item => {
            if (item.period > highestPeriodItem.period) {
                highestPeriodItem = item
            }
        })
        historicValues[keyFigure] = highestPeriodItem.key_figure // Keep only the item with the highest period
        newestPeriod = highestPeriodItem.period // Set the highest period as period for all current key figure values
    }

    const currentKeyFigures = {
        period: newestPeriod,
        keyFigures: historicValues
    }
    return currentKeyFigures
}


module.exports = {
    getAllKeyFigures: getCurrentKeyFigures
}
