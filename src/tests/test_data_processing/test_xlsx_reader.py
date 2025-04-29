import pytest
import json
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../data_processing')))

TEST_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "testdata")


import src.data_processing.xlsx_reader as xlsx_reader



def test_1_read_single_report():
    file_path = os.path.join(TEST_DATA_DIR, "test_file_01.xlsx")
    data = xlsx_reader.main(file_path)
    report = json.loads(data)[0]
    assert type(report) == dict
    # Check if necessary attributes are present in the dictionary
    assert report["company_id"]
    assert report["period"]
    assert report["balance_sheet"]
    assert report["income_statement"]


def test_2_read_multiple_reports():
    file_path = os.path.join(TEST_DATA_DIR, "test_file_02.xlsx")
    data = xlsx_reader.main(file_path)
    data = json.loads(data)

    assert len(data) == 3  # Three reports should be returned
    for report in data:
        assert type(report) == dict
        assert report["company_id"]
        assert report["period"]
        assert report["balance_sheet"]
        assert report["income_statement"]


def test_3_read_numerically_invalid_report():
    file_path = os.path.join(TEST_DATA_DIR, "test_file_03.xlsx")
    data = xlsx_reader.main(file_path)
    report = json.loads(data)[0]
    assert report == "report contains invalid data"


def test_4_read_partially_numerically_invalid_report_collection():
    file_path = os.path.join(TEST_DATA_DIR, "test_file_04.xlsx")
    data = xlsx_reader.main(file_path)
    data = json.loads(data)
    assert type(data[0]) == dict  # First report should be processed without issues
    assert data[1] == "report contains invalid data"


def test_5_read_invalid_report():
    file_path = os.path.join(TEST_DATA_DIR, "test_file_05.xlsx")
    data = xlsx_reader.main(file_path)
    report = json.loads(data)[0]
    assert report == "report contains invalid data"


def test_6_read_partially_invalid_report_collection():
    file_path = os.path.join(TEST_DATA_DIR, "test_file_06.xlsx")
    data = xlsx_reader.main(file_path)
    data = json.loads(data)
    assert type(data[0]) == dict  # First report should be processed without issues
    assert data[1] == "report contains invalid data"


def test_7_read_incomplete_report():
    file_path = os.path.join(TEST_DATA_DIR, "test_file_07.xlsx")
    data = xlsx_reader.main(file_path)
    report = json.loads(data)[0]
    assert report == "report contains invalid data"


def test_8_read_partially_incomplete_report_collection():
    file_path = os.path.join(TEST_DATA_DIR, "test_file_08.xlsx")
    data = xlsx_reader.main(file_path)
    data = json.loads(data)
    assert type(data[0]) == dict  # First report should be processed without issues
    assert data[1] == "report contains invalid data"


def test_9_calculate_liquid_assets():
    file_path = os.path.join(TEST_DATA_DIR, "test_file_09.xlsx")
    data = xlsx_reader.main(file_path)
    report = json.loads(data)[0]
    assert report["balance_sheet"]["actives"]["current_assets"]["liquid_assets"]["total"] == 300


def test_10_calculate_current_assets():
    file_path = os.path.join(TEST_DATA_DIR, "test_file_10.xlsx")
    data = xlsx_reader.main(file_path)
    report = json.loads(data)[0]
    assert report["balance_sheet"]["actives"]["current_assets"]["total"] == 500


def test_11_calculate_fixed_assets():
    file_path = os.path.join(TEST_DATA_DIR, "test_file_11.xlsx")
    data = xlsx_reader.main(file_path)
    report = json.loads(data)[0]
    assert report["balance_sheet"]["actives"]["fixed_assets"]["total"] == 300


def test_12_calculate_long_term_debt():
    file_path = os.path.join(TEST_DATA_DIR, "test_file_12.xlsx")
    data = xlsx_reader.main(file_path)
    report = json.loads(data)[0]
    assert report["balance_sheet"]["passives"]["debt"]["long_term"]["total"] == 200


def test_13_calulate_equity():
    file_path = os.path.join(TEST_DATA_DIR, "test_file_13.xlsx")
    data = xlsx_reader.main(file_path)
    report = json.loads(data)[0]
    assert report["balance_sheet"]["passives"]["equity"]["total"] == 300


def test_14_calculate_expense():
    file_path = os.path.join(TEST_DATA_DIR, "test_file_14.xlsx")
    data = xlsx_reader.main(file_path)
    report = json.loads(data)[0]
    assert report["income_statement"]["expense"]["total"] == 600


def test_15_calculate_earnings():
    file_path = os.path.join(TEST_DATA_DIR, "test_file_15.xlsx")
    data = xlsx_reader.main(file_path)
    report = json.loads(data)[0]
    assert report["income_statement"]["earnings"]["total"] == 300


