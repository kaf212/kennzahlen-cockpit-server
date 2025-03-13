"""
A collection of functions for the key figures, uses the Json called from the DB.
(here a mock of how one looks like based off the xlxs_reader)

package installed, pymongo
"""
import xlxs_reader as xlxsr
import pymongo


def equity_ratio(request):
    """
    :param request:
    :return json:
    """
    '''
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["mydatabase"]
    mycol = mydb["entries"]

    myquery = {"company_id": request['company_id']}
    data = mycol.find(myquery)
    '''

    result = {
        "company_id": request['company_id'],
        "equity_ratios": []
    }
    data = xlxsr.write_json()

    for data_set in data:
        if data_set:
            equity = data_set["balance_sheet"]["passives"]["equity"]["total"]
            current_assets_total = data_set["balance_sheet"]["actives"]["current_assets"]["total"]
            fixed_assets_total = data_set["balance_sheet"]["actives"]["fixed_assets"]["total"]

            key_figure = equity / (current_assets_total + fixed_assets_total)

            result["equity_ratios"].append({
                "period" : data_set["period"],
                "key_figure" : key_figure
            })

    #return mock data results
    return result

def debt_ratio(request):
    """
    :param request:
    :return json:
    """
    '''
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["mydatabase"]
    mycol = mydb["entries"]

    myquery = {"company_id": request['company_id']}
    data = mycol.find(myquery)
    '''

    result = {
        "company_id": request['company_id'],
        "debt_ratio": []
    }
    data = xlxsr.write_json()

    for data_set in data:
        if data_set:
            st_debt = data_set["balance_sheet"]["passives"]["debt"]["short_term"]["liabilities"]
            lt_debt = data_set["balance_sheet"]["passives"]["debt"]["long_term"]["total"]
            current_assets_total = data_set["balance_sheet"]["actives"]["current_assets"]["total"]
            fixed_assets_total = data_set["balance_sheet"]["actives"]["fixed_assets"]["total"]

            key_figure = (st_debt + lt_debt) / (current_assets_total + fixed_assets_total)

            result["debt_ratio"].append({
                "period" : data_set["period"],
                "key_figure" : key_figure
            })

    #return mock data results
    return result

def self_finanzing_ratio(request):
    """
    :param request:
    :return json:
    """
    '''
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["mydatabase"]
    mycol = mydb["entries"]

    myquery = {"company_id": request['company_id']}
    data = mycol.find(myquery)
    '''

    result = {
        "company_id": request['company_id'],
        "self_finanzing_ratio": []
    }
    data = xlxsr.write_json()

    for data_set in data:
        if data_set:
            legal_reserve = data_set["balance_sheet"]["passives"]["equity"]["legal_reserve"]
            retained_earnings = data_set["balance_sheet"]["passives"]["equity"]["retained_earnings"]
            equity_shares = data_set["balance_sheet"]["passives"]["equity"]["shares"]

            key_figure = (legal_reserve + retained_earnings) / equity_shares

            result["self_finanzing_ratio"].append({
                "period" : data_set["period"],
                "key_figure" : key_figure
            })

    #return mock data results
    return result

def working_capital_intensity(request):
    """
    :param request:
    :return json:
    """
    '''
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["mydatabase"]
    mycol = mydb["entries"]

    myquery = {"company_id": request['company_id']}
    data = mycol.find(myquery)
    '''

    result = {
        "company_id": request['company_id'],
        "working_capital_intensity": []
    }
    data = xlxsr.write_json()

    for data_set in data:
        if data_set:
            liquid_money = data_set["balance_sheet"]["actives"]["current_assets"]["total"]
            current_assets_total = data_set["balance_sheet"]["actives"]["current_assets"]["total"]
            fixed_assets_total = data_set["balance_sheet"]["actives"]["fixed_assets"]["total"]

            key_figure = liquid_money / (current_assets_total + fixed_assets_total)

            result["working_capital_intensity"].append({
                "period" : data_set["period"],
                "key_figure" : key_figure
            })

    #return mock data results
    return result

def fixed_asset_intensity(request):
    """
    :param request:
    :return json:
    """
    '''
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["mydatabase"]
    mycol = mydb["entries"]

    myquery = {"company_id": request['company_id']}
    data = mycol.find(myquery)
    '''

    result = {
        "company_id": request['company_id'],
        "fixed_asset_intensity": []
    }
    data = xlxsr.write_json()

    for data_set in data:
        if data_set:
            fixed_assets = data_set["balance_sheet"]["actives"]["fixed_assets"]["total"]
            current_assets_total = data_set["balance_sheet"]["actives"]["current_assets"]["total"]
            fixed_assets_total = data_set["balance_sheet"]["actives"]["fixed_assets"]["total"]

            key_figure = fixed_assets / (current_assets_total + fixed_assets_total)

            result["fixed_asset_intensity"].append({
                "period" : data_set["period"],
                "key_figure" : key_figure
            })

    #return mock data results
    return result

#Liquiditätsgrad 1 (cash Ratio)
#Liquiditätsgrad 2 (Quick Ratio)
#Liquiditätgrad 3 (Current ratio)
#Anlagedeckungsgrad 1
#Anlagedeckungsgrad 2
#Eigenkapitalrendite
#Gesamtkapitalrendite
#Umsatzrendite

def main():
    """
    main
    :return:
    """
    print( equity_ratio({"company_id":"example"}) )
    print( debt_ratio({"company_id": "example"}) )
    print( self_finanzing_ratio({"company_id": "example"}) )
    print( working_capital_intensity({"company_id": "example"}) )
    print( fixed_asset_intensity({"company_id": "example"}) )


if __name__ == "__main__":
    main()
