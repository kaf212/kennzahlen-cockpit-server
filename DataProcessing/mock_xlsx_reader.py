import pandas as pd


def main(filepath):
    """
    Mocks the XLSX-reader for the development of the uploading logic in the backend.
    """
    data = pd.read_excel(filepath)
    return data
