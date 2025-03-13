const mongoose = require("mongoose");
const Report = require("../../models/Report");

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/kennzahlen")
})

afterAll(async () => {
    await mongoose.disconnect()
})

describe("Tests for reports", () => {

    it("Einfügen eines Reports in die Datenbank", async () => {
        const testReport = new Report({ company_id: "12345", period: "2025-Q1" });
        await testReport.save();

        const foundDocument = await Report.findOne({ company_id: "12345" });
        expect(foundDocument).not.toBeNull();
        expect(foundDocument.company_id).toEqual("12345");
        expect(foundDocument.period).toEqual("2025-Q1");
    });

    it("Löschen eines Reports aus der Datenbank", async () => {
        const testReport = new Report({ company_id: "54321", period: "2025-Q2" });
        await testReport.save();

        await Report.deleteOne({ company_id: "54321" });

        const deletedDocument = await Report.findOne({ company_id: "54321" });
        expect(deletedDocument).toBeNull();
    });

    it("Ändern eines bestehenden Reports", async () => {
        const testReport = new Report({ company_id: "67890", period: "2025-Q3" });
        await testReport.save();

        await Report.updateOne({ company_id: "67890" }, { $set: { period: "2026-Q1" } });

        const updatedDocument = await Report.findOne({ company_id: "67890" });
        expect(updatedDocument).not.toBeNull();
        expect(updatedDocument.period).toEqual("2026-Q1");
    });

    it("Änderung eines nicht vorhandenen Reports", async () => {
        const result = await Report.updateOne({ company_id: "00000" }, { period: "2026-Q1" });


        expect(result.matchedCount).toBe(0);
        if (result.matchedCount === 0) {
            throw new Error("Report existiert nicht")
        }
    });

    it("Änderung eines Reports mit fehlendem Pflichtfeld", async () => {
        const testReport = new Report({ company_id: "12345", period: "2025-Q3" });
        await testReport.save();

        try {
            await Report.updateOne({ company_id: "12345" }, { period: null });
        } catch (error) {
            expect(error).toBeDefined();
            throw new Error("ungültiger Wert")
        }
    });

    it("Negativer Wert in einem Liquiditätsfeld", async () => {
        try {
            await Report.create({ company_id: "11111", period: "2025-Q1", balance_sheet: { actives: { current_assets: { liquid_assets: { cash: -69 } } } } });
        } catch (error) {
            expect(error).toBeDefined();
            throw new Error("ungültiger Wert")
        }
    });

    it("Finanzielle Erträge werden korrekt erfasst", async () => {
        const testReport = new Report({ company_id: "22222", period: "2025-Q2", income_statement: { earnings: { financial: 123 } } });
        await testReport.save();

        const foundDocument = await Report.findOne({ company_id: "22222" });
        expect(foundDocument.income_statement.earnings.financial).toBe(123);
    });

    it("Berechnung des Gesamtergebnisses", async () => {
        const testReport = new Report({ company_id: "33333", period: "2025-Q3", income_statement: { earnings: { total: 1000 }, expense: { total: 400 } } });
        await testReport.save();

        const foundDocument = await Report.findOne({ company_id: "33333" });
        const totalResult = foundDocument.income_statement.earnings.total - foundDocument.income_statement.expense.total;
        expect(totalResult).toBe(600);
    });

});
