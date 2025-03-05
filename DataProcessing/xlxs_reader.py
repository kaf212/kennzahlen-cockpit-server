"""reads xlxs files in specified format"""

#installed library pandas

import pandas as pd
import math

data = pd.read_excel('Finanzbericht_Vorlage.xlsx')
value_indexes = [[3, 1], [5, 1], [6, 1], [7, 1], [8, 1], [10, 1], [12, 1], [14, 1], [15, 1], [16, 1], #Aktive Konten
                 [20, 1], [21, 1], [23, 1], [24, 1], [26, 1], [27, 1], [28, 1], #Passive Konten
                 [33, 1], [34, 1], [35, 1], [36, 1], [37, 1], [38, 1], [39, 1], #Aufwände
                 [43, 1], [44, 1], [45, 1], [46, 1]] #Erträge

years_count = data.iloc[1,1]

def null_nan_value_check(value):
    """checks if a certain value is a float and excludes nan"""
    try:
        value = float(value)
        if not math.isnan(value):
            return True, value
        return False, None
    except ValueError as exp:
        print(exp)
        return False, None

def valid_values(slot):
    """checks if the xlsx file has valid values in it"""
    results = []
    if not str(years_count).isdigit():
        print(f'{data.iloc[1, 1]} is not int')
        return False
    for value_index in value_indexes:
        val = data.iloc[value_index[0], value_index[1] + slot]
        is_number, value = null_nan_value_check(val)
        if is_number:
            results.append(value)
        else:
            print(f'bad value on: {value_index[0]}, {value_index[1] + slot}')
            return False, None
    return True, results

def write_json():
    """writes the read data into json-format needed for MongoDB"""
    for i in range(0, years_count):
        is_valid, values = valid_values(i)
        print(values)
        if is_valid:
            print('one works')
            result_json = {
            "company_id": data.iloc[0,1],
            "period": values[0],
            "balance_sheet": {
                "actives": {
                    "current_assets": {
                        "total": 3,
                        "liquid_assets": {
                            "total": values[1] + values[2] + values[3],
                            "cash": values[1],
                            "postal" : values[2],
                            "bank": values[3]
                        },
                        "receivables": values[4],
                        "stocks": 45
                    },
                    "fixed_assets": {
                        "total": -95,
                        "machines": 73,
                        "movables": -92,
                        "real_estate": 31
                    }
                },
                "passives": {
                    "debt": {
                        "short_term": {
                            "liabilities": -39
                        },
                        "long_term": {
                            "total": -24,
                            "loans": -9,
                            "mortgage": 95
                        }
                    },
                    "equity": {
                        "total": 29,
                        "shares": -13,
                        "legal_reserve": -58,
                        "retained_earnings": 37
                    }
                }
            },
            "income_statement": {
                "expense": {
                    "total": -32,
                    "goods": -89,
                    "staff": -3,
                    "other_expenses": 13,
                    "depreciation": -22,
                    "financial": -91,
                    "real_estate": -93
                },
                "earnings": {
                    "total": -70,
                    "operating_income": 93,
                    "real_estate": 63
                }
            }
            }
            print(result_json)
        else:
            print('this doesnt work')
        # if values in year (slot1 + i) are valid, then proceed to write a json

write_json()
