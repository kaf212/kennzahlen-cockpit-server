import pandas as pd
import sys

def main():
    """
    Mocks the XLSX-reader for the development of the uploading logic in the backend.
    """
    filepath = sys.argv[2]
    data = pd.read_excel(filepath)
    print(data)
    return data


if sys.argv[1] == 'main':
    main()

sys.stdout.flush()