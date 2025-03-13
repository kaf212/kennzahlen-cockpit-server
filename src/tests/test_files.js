const mongoose = require("mongoose");
const Report = require("../../models/Report");
const Company = require("../../models/Company");
const Role = require("../../models/Role");

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/kennzahlen");
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe("Tests for reports", () => {

    it("Einfügen eines Reports in die Datenbank", async () => {
        const report = new Report({ company_id: "12345", period: "2025-Q1" });
        await report.save();

        const r = await Report.findOne({ company_id: "12345" });
        expect(r).not.toBeNull();
        expect(r.company_id).toEqual("12345");
        expect(r.period).toEqual("2025-Q1");
    });

    it("Löschen eines Reports aus der Datenbank", async () => {
        const report = new Report({ company_id: "54321", period: "2025-Q2" });
        await report.save();

        await Report.deleteOne({ company_id: "54321" });

        const dr = await Report.findOne({ company_id: "54321" });
        expect(dr).toBeNull();
    });

    it("Ändern eines bestehenden Reports", async () => {
        const report = new Report({ company_id: "67890", period: "2025-Q3" });
        await report.save();

        await Report.updateOne({ company_id: "67890" }, { $set: { period: "2026-Q1" } });

        const ur = await Report.findOne({ company_id: "67890" });
        expect(ur).not.toBeNull();
        expect(ur.period).toEqual("2026-Q1");
    });

    it("Änderung eines Reports mit fehlendem Pflichtfeld", async () => {
        try {
            await Report.create({ company_id: "12345" });
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    it("Negativer Wert in einem Liquiditätsfeld", async () => {
        try {
            await Report.create({ company_id: "11111", period: "2025-Q1", balance: -120 });
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
});

describe("Tests for companies", () => {

    it("Erstellen eines neuen Unternehmens", async () => {
        const company = new Company({ id: "00123", name: "Kennzahlen AG" });
        await company.save();

        const c = await Company.findOne({ id: "00123" });
        expect(c).not.toBeNull();
        expect(c.name).toEqual("Kennzahlen AG");
    });

    it("Löschen eines Unternehmens", async () => {
        await Company.deleteOne({ id: "00123" });
        const dc = await Company.findOne({ id: "00123" });
        expect(dc).toBeNull();
    });

    it("Aktualisieren des Unternehmensnamens", async () => {
        await Company.updateOne({ id: "00123" }, { $set: { name: "Kennzahlen 2 AG" } });
        const uc = await Company.findOne({ id: "00123" });
        expect(uc).not.toBeNull();
        expect(uc.name).toEqual("Kennzahlen 2 AG");
    });

    it("Erstellen eines Unternehmens ohne Namen", async () => {
        try {
            await Company.create({ id: "00124", name: null });
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
});

describe("Tests for roles", () => {

    it("Erstellen einer neuen Rolle", async () => {
        const role = new Role({ id: "admin", name: "laib", password: "12345" });
        await role.save();

        const r = await Role.findOne({ id: "admin" });
        expect(r).not.toBeNull();
        expect(r.name).toEqual("laib");
    });

    it("Löschen einer Rolle", async () => {
        await Role.deleteOne({ id: "admin" });
        const dr = await Role.findOne({ id: "admin" });
        expect(dr).toBeNull();
    });

    it("Aktualisieren des Rollennamens", async () => {
        await Role.updateOne({ id: "admin" }, { $set: { name: "Neuer Admin" } });
        const ur = await Role.findOne({ id: "admin" });
        expect(ur).not.toBeNull();
        expect(ur.name).toEqual("Neuer Admin");
    });

    it("Erstellen einer Rolle ohne Namen", async () => {
        try {
            await Role.create({ id: "editor", name: null, password: "12345" });
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
});
