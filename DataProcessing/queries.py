"""
A collection of functions for the key figures, uses the Json called from the DB.
(here a mock of how one looks like based off the xlxs_reader)

package installed, pymongo
"""
import xlxs_reader as xlxsr
import pymongo

request = {"data": 123, "brand": "string"}

def initial_query(*args, **kwargs):
    """

    :return:
    """

    def wrapper(func):
        brand = request["brand"]
        #help, what am i doing???
        # aka work in progress

        myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        mydb = myclient["mydatabase"]
        mycol = mydb["entries"]

        myquery = {"company_id": brand}
        data = mycol.find(myquery)
        return func(data)

    return wrapper


@initial_query(request)
def eigenfinanzierungsgrad(data):
    """

    :param data:
    :return:
    """
    pass

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
