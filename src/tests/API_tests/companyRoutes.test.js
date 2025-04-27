require('dotenv').config();

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const getTokens = require('./supportFunctions').getTokens;
const isValidJson = require('./supportFunctions').isValidJson;
const companyName = 'ApiTestCompany'
const companyName2 = 'Api-TestCompany'

describe('Company Routes Testing', () => {
    it('Testfall 8: Aufruf einer Liste aller Firmen', async () => {
        let tokens = await getTokens();

        try {
            let res = await axios.get(`${process.env.URL}api/companies`, {
                headers: {Authorization: `Bearer ${tokens.admin}`}
            });
            expect(isValidJson(res.data, ['name', '_id'], true)).toBeTruthy()

        } catch (error) {
            console.log(error)
            throw error;
        }
    });

    it('Testfall 9: Erstellen eines Unternehmens (falscher nutzer)', async () => {
        let tokens = await getTokens();

        try {
            console.log(`Bearer ${tokens.standard}`)
            let res = await axios.post(`${process.env.URL}api/companies`, {
                name: companyName
            }, {
                headers: {'Authorization': `Bearer ${tokens.standard}`}
            });

        } catch (error) {
            console.log(error)
            expect(error.response.status).toBe(403);
        }
    });

    it('Testfall 10: Erstellen eines Unternehmens (als Admin)', async () => {
        let tokens = await getTokens();
        try {
            let res = await axios.post(`${process.env.URL}api/companies`, {
                name: companyName
            }, {
                headers: {'Authorization': `Bearer ${tokens.admin}`}
            });
            expect(res.status).toBe(201);
            expect(res.data.message).toBe('company created successfully')

        } catch (error) {
            console.log(error)
            throw error;
        }
    });

    it('Testfall 11: Erstellen eines Unternehmens (gleichnamig)', async () => {
        let tokens = await getTokens();
        try {
            let res = await axios.post(`${process.env.URL}api/companies`, {
                name: companyName
            }, {
                headers: {'Authorization': `Bearer ${tokens.admin}`}
            });
        } catch (error) {
            console.log(error.response)
            expect(error.response.status).toBe(400);
            expect(error.response.data.message).toBe('company ApiTestCompany already exists')
        }
    });

    it('Testfall 12: Excel Upload (schlechtes format)', async () => {
        let tokens = await getTokens();

        for (let i = 1; i++; i <= 5) {
            if (i <= 4) {
                console.log(i)
                const form = new FormData();
                const filePath = path.join(__dirname, `testdata_bad/bad_excel${i}.xlsx`);

                form.append('file', fs.createReadStream(filePath));
                try {
                    let res = await axios.post(`${process.env.URL}api/upload`, form, {
                        headers: {
                            'Authorization': `Bearer ${tokens.admin}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    throw new Error('it should not reach here')
                } catch (error) {
                    expect(error.response.status).toBe(400);
                }
            } else {
                const form = new FormData();
                const filePath = path.join(__dirname, `testdata_bad/bad_excel5.txt`);

                form.append('file', fs.createReadStream(filePath));
                try {
                    let res = await axios.post(`${process.env.URL}api/upload`, form, {
                        headers: {
                            'Authorization': `Bearer ${tokens.admin}`,
                            'Content-Type': 'text/plain'
                        }
                    });
                    throw new Error('it should not reach here')
                } catch (error) {
                    console.log(error)
                    expect(error.response.status).toBe(400);
                }
            }

        }

    }, 20000);

    it('Testfall 13: Excel Upload ', async () => {
        let tokens = await getTokens();


        try {
            const form = new FormData();
            const filePath = path.join(__dirname, `testdata_good/good_excel.xlsx`);

            form.append('file', fs.createReadStream(filePath));

            let res = await axios.post(`${process.env.URL}api/upload`, form, {
                headers: {
                    'Authorization': `Bearer ${tokens.admin}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res.data.message)
            expect(res.status).toBe(201);
            expect(res.data.message).toBe('successfully saved 2 reports');
        } catch (error) {
            console.log(error)
            throw error;
        }

        try {
            const form = new FormData();
            const filePath = path.join(__dirname, `testdata_good/good_excel2.xlsx`);

            form.append('file', fs.createReadStream(filePath));

            let res = await axios.post(`${process.env.URL}api/upload`, form, {
                headers: {
                    'Authorization': `Bearer ${tokens.standard}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res.data.message)
            expect(res.status).toBe(201);
            expect(res.data.message).toBe('successfully saved 1 reports');
        } catch (error) {
            console.log(error)
            throw error;
        }
    }, 20000);

    it('Testfall 14: Aufruf einer spezifischen Firma', async () => {
        let tokens = await getTokens();
        let all_companies;

        try {
            let res = await axios.get(`${process.env.URL}api/companies`, {
                headers: {Authorization: `Bearer ${tokens.standard}`}
            });
            expect(isValidJson(res.data, ['name', '_id'], true)).toBeTruthy()
            all_companies = res.data

            for (i in all_companies){
                if (all_companies[i].name === companyName){
                    let res2 = await axios.get(`${process.env.URL}api/companies/${all_companies[i]._id}`, {
                        headers: {Authorization: `Bearer ${tokens.standard}`}
                    });
                    expect(res2.status).toBe(200);
                    expect(res2.data.name).toBe(companyName);

                }
            }
        } catch (error) {
            console.log(error)
            throw error;
        }

        try {
            let res = await axios.get(`${process.env.URL}api/companies`, {
                headers: {Authorization: `Bearer ${tokens.admin}`}
            });
            expect(isValidJson(res.data, ['name', '_id'], true)).toBeTruthy()
            all_companies = res.data

            for (i in all_companies){
                if (all_companies[i].name === companyName){
                    let res2 = await axios.get(`${process.env.URL}api/companies/${all_companies[i]._id}`, {
                        headers: {Authorization: `Bearer ${tokens.admin}`}
                    });
                    expect(res2.status).toBe(200);
                    expect(res2.data.name).toBe(companyName);
                }
            }
        } catch (error) {
            console.log(error)
            throw error;
        }
    });

    it('Testfall 15: Aufruf einer spezifischen Firma (falsche Angaben)', async () => {
        let tokens = await getTokens();
        const fakeID = "5f47ac8b3e2f4d1b9c0a1234FAKE"

        try {
            await axios.get(`${process.env.URL}api/companies/${fakeID}`, {
                headers: {Authorization: `Bearer ${tokens.standard}`}
            });
            throw new Error('It should not get this far')

        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data.message).toBe('invalid ID format');
        }

        try {
            await axios.get(`${process.env.URL}api/companies/${fakeID}`, {
                headers: {Authorization: `Bearer ${tokens.admin}`}
            });
            throw new Error('It should not get this far')

        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toBe('invalid ID format');
        }
    });

    it('Testfall 16: Bearbeitung des Namens eines Unternehmens (Standartnutzer)', async () => {
        let tokens = await getTokens();
        let all_companies;

        try {
            let res = await axios.get(`${process.env.URL}api/companies`, {
                headers: {Authorization: `Bearer ${tokens.standard}`}
            });
            expect(isValidJson(res.data, ['name', '_id'], true)).toBeTruthy()
            all_companies = res.data

            for (i in all_companies){
                if (all_companies[i].name === companyName){
                    let res2 = await axios.patch(`${process.env.URL}api/companies/${all_companies[i]._id}`, {
                      name: companyName2
                    }, {
                        headers: {Authorization: `Bearer ${tokens.standard}`}
                    });
                    throw new Error('it should not come this far')

                }
            }
        } catch (error) {
            expect(error.response.status).toBe(403)
        }

    });

    it('Testfall 17: Bearbeitung des Namens eines Unternehmens (Admin)', async () => {
        let tokens = await getTokens();
        let all_companies;

        try {
            let res = await axios.get(`${process.env.URL}api/companies`, {
                headers: {Authorization: `Bearer ${tokens.admin}`}
            });
            expect(isValidJson(res.data, ['name', '_id'], true)).toBeTruthy()
            all_companies = res.data

            for (i in all_companies){
                if (all_companies[i].name === companyName){
                    let res2 = await axios.patch(`${process.env.URL}api/companies/${all_companies[i]._id}`, {
                      name: companyName2
                    }, {
                        headers: {Authorization: `Bearer ${tokens.admin}`}
                    });
                    expect(res2.status).toBe(201);

                }
            }
        } catch (error) {
            console.log(error)
            throw error;
        }
    })

    it('Testfall 18: Löschen eines Unternehmens', async () => {
        let tokens = await getTokens();
        let all_companies;

        try {
             let res = await axios.get(`${process.env.URL}api/companies`, {
                headers: {Authorization: `Bearer ${tokens.admin}`}
            });

            expect(isValidJson(res.data, ['name', '_id'], true)).toBeTruthy()

            all_companies = res.data

            for (i in all_companies){
                if (all_companies[i].name === companyName2){
                    let res2 = await axios.patch(`${process.env.URL}api/companies/${all_companies[i]._id}`, {
                        headers: {Authorization: `Bearer ${tokens.standard}`}
                    });
                    throw new Error('it should not come this far')

                }
            }
        } catch (error) {
            expect(error.response.status).toBe(401)

        }

        try {
             let res = await axios.get(`${process.env.URL}api/companies`, {
                headers: {Authorization: `Bearer ${tokens.admin}`}
            });

            expect(isValidJson(res.data, ['name', '_id'], true)).toBeTruthy()

            all_companies = res.data
            for (i in all_companies){
                if (all_companies[i].name === companyName2){
                    let res2 = await axios.delete(`${process.env.URL}api/companies/${all_companies[i]._id}`, {
                        headers: {Authorization: `Bearer ${tokens.admin}`}
                    });
                    expect(res2.status).toBe(200);

                }
            }
        } catch (error) {
            console.log(error)
            throw error;
        }
    });

    it('Testfall 19: Löschen eines nichtexistenten Unternehmens', async () => {
        let tokens = await getTokens();
        const fakeID = "5f47ac8b3e2f4d1b9c0a1234FAKE"

        try {

            await axios.delete(`${process.env.URL}api/companies/${fakeID}`, {
                headers: {Authorization: `Bearer ${tokens.admin}`}
            });

            throw new Error('it should not come this far')
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });

});