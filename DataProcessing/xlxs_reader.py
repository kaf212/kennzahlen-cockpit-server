#installed library xlrd / pandas / openpyxl

import pandas as pd
import math

data = pd.read_excel('Finanzbericht_Vorlage.xlsx')
value_indexs = [[3, 1], [5, 1], [6, 1], [7, 1], [9, 1], [11, 1], [13, 1], [14, 1], [15, 1] ]

years_count = data.iloc[1,1]

def null_nan_value_check(value):
    try:
        value = float(value)
        if not math.isnan(value):
            return True, value
        return False, None
    except ValueError as exp:
        print(exp)
        return False, None

def valid_values():
    if not str(years_count).isdigit():
        print(f'{data.iloc[1, 1]} is not int')
        return False

    for i in range(0, years_count):
        for value_index in value_indexs:
            val = data.iloc[value_index[0], value_index[1] + i]
            is_number, value = null_nan_value_check(val)
            if not is_number:
                print(f'bad value on: {value_index[0]}, {value_index[1] + i}')
                return False

    return True

print(valid_values())
