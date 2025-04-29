const mongoose = require("mongoose");
const Report = require("../../models/Report.js");
const Company = require("../../models/Company.js");
const Role = require("../../models/Role.js");
const CustomKeyFigure = require("../../models/customKeyFigure")

/*
 All test cases for report, company and role have been programmed by Adam Laib.
 The git blame is misinforming because the tests were copied and pasted from the original file to into this file
 becuase the original file by Adam was in the wrong location.
 */

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/kennzahlen");
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe("Tests for reports", () => {

    it("Einfügen eines Reports in die Datenbank", async () => {
        const report = new Report({ company_id: "12345", period: 2025 });
        await report.save();

        const r = await Report.findOne({ company_id: "12345" });
        expect(r).not.toBeNull();
        expect(r.company_id).toEqual("12345");
        expect(r.period).toEqual(2025);

        await Report.deleteOne({company_id: "12345"}) // Clean up testdata afterwards
    });

    it("Löschen eines Reports aus der Datenbank", async () => {
        const report = new Report({ company_id: "54321", period: 2025 });
        await report.save();

        await Report.deleteOne({ company_id: "54321" });

        const dr = await Report.findOne({ company_id: "54321" });
        expect(dr).toBeNull();
    });

    it("Ändern eines bestehenden Reports", async () => {
        const report = new Report({ company_id: "67890", period: 2025 });
        await report.save();

        await Report.updateOne({ company_id: "67890" }, { $set: { period: 2026 } });

        const ur = await Report.findOne({ company_id: "67890" });
        expect(ur).not.toBeNull();
        expect(ur.period).toEqual(2026);

        await Report.deleteOne({company_id: "67890"}) // Clean up testdata afterwards
    });

    it("Änderung eines Reports mit fehlendem Pflichtfeld", async () => {
        try {
            await Report.create({ company_id: "12345" });
        } catch (error) {
            expect(error).toBeDefined();
            console.log("period darf nicht leer sein")
        }
    });

    it("Negativer Wert in einem Liquiditätsfeld", async () => {
        try {
            await Report.create({ company_id: "11111", period: 2025, balance: -120 });
        } catch (error) {
            expect(error).toBeDefined();
            console.log("Wert darf nicht Negativ sein")
        }

        await Report.deleteOne({company_id: "11111"}) // Clean up testdata afterwards
    });
});

describe("Tests for companies", () => {

    it("Erstellen eines neuen Unternehmens", async () => {
        const company = new Company({ name: "Kennzahlen AG" });
        await company.save();

        const c = await Company.findOne({ name: "Kennzahlen AG" });
        expect(c).not.toBeNull();
        expect(c.name).toEqual("Kennzahlen AG");

        await Company.deleteOne({name: "Kennzahlen AG"}) // Clean up testdata afterwards
    });

    it("Löschen eines Unternehmens", async () => {
        await new Company({ name: "Kennzahlen12" }).save();
        await Company.deleteOne({ name: "Kennzahlen12" });
        const dr = await Company.findOne({ name: "Kennzahlen12" });
        expect(dr).toBeNull();
    });


    it("Aktualisieren des Unternehmensnamens", async () => {
        await new Company({ name: "Kennzahlen AG" }).save();
        await Company.updateOne({ name: "Kennzahlen AG" }, { $set: { name: "Kennzahlen 2 AG" } });
        const uc = await Company.findOne({ name: "Kennzahlen 2 AG" });
        expect(uc).not.toBeNull();
        expect(uc.name).toEqual("Kennzahlen 2 AG");

        await Company.deleteOne({name: "Kennzahlen 2 AG"}) // Clean up testdata afterwards
    });


    it("Erstellen eines Unternehmens ohne Namen", async () => {
        try {
            await Company.create({name: null });
        } catch (error) {
            expect(error).toBeDefined();
            console.log("Name darf nicht leer sein")
        }
    });
});

describe("Tests for roles", () => {

    it("Erstellen einer neuen Rolle", async () => {
        const role = new Role({ name: "laib", password: "12345" });
        await role.save();

        const r = await Role.findOne({ name: "laib" });
        expect(r).not.toBeNull();
        expect(r.name).toEqual("laib");

        await Role.deleteOne({name: "laib"}) // Clean up testdata afterwards
    });

    it("Löschen einer Rolle", async () => {
        await new Role({ name: "admins", password: "admin123" }).save();
        await Role.deleteOne({ name: "admins" });
        const dr = await Role.findOne({ name: "admins" });
        expect(dr).toBeNull();
    });

    it("Aktualisieren des Rollennamens", async () => {
        await new Role({ name: "admin" }).save();
        await Role.updateOne({ name: "admin" }, { $set: { name: "admin 121" } });
        const uc = await Role.findOne({ name: "admin 121" });
        expect(uc).not.toBeNull();
        expect(uc.name).toEqual("admin 121");

        await Role.deleteOne({name: "admin 121"}) // Clean up testdata afterwards
    });

    it("Erstellen einer Rolle ohne Namen", async () => {
        try {
            await Role.create({name: null, password: "12345" });
        } catch (error) {
            expect(error).toBeDefined();
            console.log("Name darf nicht leer sein")
        }
    });
});

describe("Tests for custom key figures", ()=> {

    it("Create new custom key figure", async ()=> {
        const newKeyFigure = new CustomKeyFigure({
            name: "Liquiditätsgrad 1",
            formula: "liquid_assets*100/long_term",
            type: "percentage",
            reference_value: "Mind. 20 %"
        })

        const savedKeyFigure = await newKeyFigure.save()

        expect(savedKeyFigure).toHaveProperty("_id")
        expect(savedKeyFigure.name).toBe("Liquiditätsgrad 1")
        expect(savedKeyFigure.formula).toBe("liquid_assets*100/long_term")
        expect(savedKeyFigure.type).toBe("percentage")
        expect(savedKeyFigure.reference_value).toBe("Mind. 20 %")

        await CustomKeyFigure.findByIdAndDelete(savedKeyFigure._id)
    })

    it("Modify an existing custom key figure", async ()=> {
        const newKeyFigure = new CustomKeyFigure({
            name: "Liquiditätsgrad 1",
            formula: "liquid_assets*100/long_term",
            type: "percentage",
            reference_value: "Mind. 20 %"
        })

        const savedKeyFigure = await newKeyFigure.save()

        // Modify the custom key figure
        savedKeyFigure.formula = "updated"
        const updatedKeyFigure = await savedKeyFigure.save()

        expect(updatedKeyFigure.formula).toBe("updated")

        await CustomKeyFigure.findByIdAndDelete(savedKeyFigure._id)
    })

    it("Should delete an existing document", async () => {
        const newKeyFigure = new CustomKeyFigure({
            name: "Liquiditätsgrad 1",
            formula: "liquid_assets*100/long_term",
            type: "percentage",
            reference_value: "Mind. 20 %"
        })

        const savedKeyFigure = await newKeyFigure.save()
        const keyFigureId = savedKeyFigure._id

        // Delete the custom key figure
        await CustomKeyFigure.findByIdAndDelete(keyFigureId)

        const deletedKeyFigure = await CustomKeyFigure.findById(keyFigureId)

        expect(deletedKeyFigure).toBeNull()
    })

})