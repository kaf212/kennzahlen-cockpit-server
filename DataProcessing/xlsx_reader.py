"""
reads xlxs files in specified format
format is based on the school book "Finanz- und Rechnungswesen Grundlagen 2" chapter 11.2.1
installed library pandas
:returns list of jsons
"""
import math
import pandas as pd


def main(filepath):
    data = pd.read_excel(filepath)
    value_indexes = [
        [3, 1],
        [5, 1], [6, 1], [7, 1], [9, 1], [11, 1], [13, 1], [14, 1], [15, 1],  # Aktive
        [19, 1], [21, 1], [22, 1], [24, 1], [25, 1], [26, 1],  # Passive
        [31, 1], [32, 1], [33, 1], [34, 1], [35, 1], [36, 1],  # Aufwände
        [40, 1], [41, 1], [42, 1]  # Erträge
    ]

    years_count = data.iloc[1, 1]

    json = write_json(data, years_count, value_indexes)
    return json


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


def valid_values(slot, data, years_count, value_indexes):
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
            print(data.iloc[value_index[0], value_index[1] + slot])
            print(f'bad value on: {value_index[0]}, {value_index[1] + slot}')
            return False, None
    return True, results


def write_json(data, years_count, value_indexes):
    """writes the read data into json-format needed for MongoDB"""
    results = []
    for i in range(0, years_count):
        is_valid, values = valid_values(i, data, years_count, value_indexes)
        if is_valid:
            result_json = {
                "company_id": str(data.iloc[0, 1]),
                "period": values[0],
                "balance_sheet": {
                    "actives": {
                        "current_assets": {
                            "total": values[1] + values[2] + values[3] + values[4] + values[5],
                            "liquid_assets": {
                                "total": values[1] + values[2] + values[3],
                                "cash": values[1],
                                "postal": values[2],
                                "bank": values[3]
                            },
                            "receivables": values[4],
                            "stocks": values[5]
                        },
                        "fixed_assets": {
                            "total": values[6] + values[7] + values[8],
                            "machines": values[6],
                            "movables": values[7],
                            "real_estate": values[8]
                        }
                    },
                    "passives": {
                        "debt": {
                            "short_term": {
                                "liabilities": values[9]
                            },
                            "long_term": {
                                "total": values[10] + values[11],
                                "loans": values[10],
                                "mortgage": values[11]
                            }
                        },
                        "equity": {
                            "total": values[12] + values[13] + values[14],
                            "shares": values[12],
                            "legal_reserve": values[13],
                            "retained_earnings": values[14]
                        }
                    }
                },
                "income_statement": {
                    "expense": {
                        "total": values[15] + values[16] + values[17] + \
                                 values[18] + values[19] + values[20],
                        "goods": values[15],
                        "staff": values[16],
                        "other_expenses": values[17],
                        "depreciation": values[18],
                        "financial": values[19],
                        "real_estate": values[20]
                    },
                    "earnings": {
                        "total": values[21] + values[22] + values[23],
                        "operating_income": values[21],
                        "financial": values[23],
                        "real_estate": values[22]
                    }
                }
            }
            results.append(result_json)
        else:
            # Enables the backend and unit tests to know if invalid reports were excluded from data processing
            results.append(f"report contains invalid data")
            print(f'{i}. entry has invalid Data')
    return results


if __name__ == '__main__':
    print(main("./Finanzbericht_Vorlage.xlsx"))
