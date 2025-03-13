"""
A collection of functions for the key figures, uses the Json called from the DB.
(here a mock of how one looks like based off the xlxs_reader)

package installed, pymongo
"""
import xlxs_reader as xlxsr
import pymongo


def equity_ratio(request):
    """
    :param data:
    :return:
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

#Fremdfinanzierungsgrad
#Selbstfinanzierungsgrad
#Intensität des Umflaufvermögen
#Intensität des Anlagevermögen
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

if __name__ == "__main__":
    main()
