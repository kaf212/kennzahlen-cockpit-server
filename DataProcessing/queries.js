const {MongoClient} = require('mongodb');


async function EquityRatio(request) {
    try {
        const uri = "mongodb://localhost:27017/";
        const client = new MongoClient(uri);
        await client.connect();

        const database = client.db("kennzahlen")
        const query = {"company_id": request.company_id};
        let data = database.collection('report').find(query)

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
        await client.close();
        return result;

    } catch (e) {
        console.error(e);
        return false;
    }
}

async function printResults(){
    console.log(await EquityRatio({company_id: "12345"}));
    console.log(await debtRatio({company_id: "12345"}));
}

printResults();
