require('dotenv').config();

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const getTokens = require('./supportFunctions').getTokens;
const isValidJson = require('./supportFunctions').isValidJson;

const filePath = './testdata/'

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
        let companyName = 'ApiTestCompany'

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
        let companyName = 'ApiTestCompany'
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
        let companyName = 'ApiTestCompany'
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
                const filePath = path.join(__dirname, `testdata/bad_excel${i}.xlsx`);

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
                    console.log(error)
                    expect(error.response.status).toBe(400);
                }
            } else {
                const form = new FormData();
                const filePath = path.join(__dirname, `testdata/bad_excel5.txt`);

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


});