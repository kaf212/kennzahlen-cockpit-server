import pytest
import xlsx_reader
import json


def test_1_read_single_report():
    data = xlsx_reader.main("./testdata/test_file_01.xlsx")
    report = json.loads(data)[0]
    assert type(report) == dict
    # Check if necessary attributes are present in the dictionary
    assert report["company_id"]
    assert report["period"]
    assert report["balance_sheet"]
    assert report["income_statement"]


def test_2_read_multiple_reports():
    data = xlsx_reader.main("./testdata/test_file_02.xlsx")
    data = json.loads(data)

    assert len(data) == 3  # Three reports should be returned
    for report in data:
        assert type(report) == dict
        assert report["company_id"]
        assert report["period"]
        assert report["balance_sheet"]
        assert report["income_statement"]


def test_3_read_numerically_invalid_report():
    data = xlsx_reader.main("./testdata/test_file_03.xlsx")
    report = json.loads(data)[0]
    assert report == "report contains invalid data"


def test_4_read_partially_numerically_invalid_report_collection():
    data = xlsx_reader.main("./testdata/test_file_04.xlsx")
    data = json.loads(data)
    assert type(data[0]) == dict  # First report should be processed without issues
    assert data[1] == "report contains invalid data"


def test_5_read_invalid_report():
    data = xlsx_reader.main("./testdata/test_file_05.xlsx")
    report = json.loads(data)[0]
    assert report == "report contains invalid data"


def test_6_read_partially_invalid_report_collection():
    data = xlsx_reader.main("./testdata/test_file_06.xlsx")
    data = json.loads(data)
    assert type(data[0]) == dict  # First report should be processed without issues
    assert data[1] == "report contains invalid data"


def test_7_read_incomplete_report():
    data = xlsx_reader.main("./testdata/test_file_07.xlsx")
    report = json.loads(data)[0]
    assert report == "report contains invalid data"


def test_8_read_partially_incomplete_report_collection():
    data = xlsx_reader.main("./testdata/test_file_08.xlsx")
    data = json.loads(data)
    assert type(data[0]) == dict  # First report should be processed without issues
    assert data[1] == "report contains invalid data"


def test_9_calculate_liquid_assets():
    data = xlsx_reader.main("./testdata/test_file_09.xlsx")
    report = json.loads(data)[0]
    assert report["balance_sheet"]["actives"]["current_assets"]["liquid_assets"]["total"] == 300


def test_10_calculate_current_assets():
    data = xlsx_reader.main("./testdata/test_file_10.xlsx")
    report = json.loads(data)[0]
    assert report["balance_sheet"]["actives"]["current_assets"]["total"] == 500


def test_11_calculate_fixed_assets():
    data = xlsx_reader.main("./testdata/test_file_11.xlsx")
    report = json.loads(data)[0]
    assert report["balance_sheet"]["actives"]["fixed_assets"]["total"] == 300


def test_12_calculate_long_term_debt():
    data = xlsx_reader.main("./testdata/test_file_12.xlsx")
    report = json.loads(data)[0]
    assert report["balance_sheet"]["passives"]["debt"]["long_term"]["total"] == 200


def test_13_calulate_equity():
    data = xlsx_reader.main("./testdata/test_file_13.xlsx")
    report = json.loads(data)[0]
    assert report["balance_sheet"]["passives"]["equity"]["total"] == 300


def test_14_calculate_expense():
    data = xlsx_reader.main("./testdata/test_file_14.xlsx")
    report = json.loads(data)[0]
    assert report["income_statement"]["expense"]["total"] == 600


def test_15_calculate_earnings():
    data = xlsx_reader.main("./testdata/test_file_15.xlsx")
    report = json.loads(data)[0]
    assert report["income_statement"]["earnings"]["total"] == 300


