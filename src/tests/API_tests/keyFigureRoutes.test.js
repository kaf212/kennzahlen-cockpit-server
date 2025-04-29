require('dotenv').config();

const axios = require('axios');
const {isValidJson} = require("./supportFunctions");
const getTokens = require('./supportFunctions').getTokens;


describe('KeyFigure Routes Testing', () => {
    it('Testfall 20: Kennzahlen des Aktuellen Jahrs aufrufen', async () => {
        let tokens = await getTokens();

        try {
            let companiesRes = await axios.get(`${process.env.URL}api/companies`, {
                headers: {Authorization: `Bearer ${tokens.standard}`}
            });
            console.log(companiesRes.data)
            expect(isValidJson(companiesRes.data, ['name', '_id'], true)).toBeTruthy();
            let all_companies = companiesRes.data;
            console.log(all_companies)
            for (i in all_companies) {
                let res2 = await axios.get(`${process.env.URL}api/KeyFigures/current/${all_companies[i]._id}`, {
                    headers: {Authorization: `Bearer ${tokens.standard}`}
                });
                if (res2.status !== 404){
                    expect(res2.status).toBe(200);
                    expect(isValidJson(res2.data, ['keyFigures', 'period'], false)).toBeTruthy();
                }else{
                    expect(res2.data.message).toBe(`no reports were found for company ${all_companies[i]._id}`);
                }
            }

        } catch (error) {
            console.log(error)
            throw error;
        }

        try {
            let companiesRes = await axios.get(`${process.env.URL}api/companies`, {
                headers: {Authorization: `Bearer ${tokens.admin}`}
            });
            expect(isValidJson(companiesRes.data, ['name', '_id'], true)).toBeTruthy();
            let all_companies = companiesRes.data;
            for (i in all_companies) {
                let res2 = await axios.get(`${process.env.URL}api/KeyFigures/current/${all_companies[i]._id}`, {
                    headers: {Authorization: `Bearer ${tokens.admin}`}
                });
                if (res2.status !== 404){
                    console.log(res2.data)
                    expect(res2.status).toBe(200);
                    expect(isValidJson(res2.data, ['keyFigures', 'period'], false)).toBeTruthy();
                }else{
                    expect(res2.data.message).toBe(`no reports were found for company ${all_companies[i]._id}`);
                }
            }

        } catch (error) {it('Testfall 21: Alle Kennzahlen der Unternehmen aufrufen', async () => {
        let tokens = await getTokens();

        try {
            let companiesRes = await axios.get(`${process.env.URL}api/companies`, {
                headers: {Authorization: `Bearer ${tokens.standard}`}
            });
            expect(isValidJson(companiesRes.data, ['name', '_id'], true)).toBeTruthy();
            let all_companies = companiesRes.data;
            console.log(all_companies)
            for (i in all_companies) {
                let res2 = await axios.get(`${process.env.URL}api/KeyFigures/historic/${all_companies[i]._id}`, {
                    headers: {Authorization: `Bearer ${tokens.standard}`}
                });
                if (res2.status !== 404){
                    expect(res2.status).toBe(200);
                    expect(isValidJson(res2.data, ['cashRatio', 'roe', 'equityRatio'], false)).toBeTruthy();
                }else{
                    expect(res2.data.message).toBe(`no reports were found for company ${all_companies[i]._id}`);
                }
            }

        } catch (error) {
            console.log(error)
            throw error;
        }

        try {
            let companiesRes = await axios.get(`${process.env.URL}api/companies`, {
                headers: {Authorization: `Bearer ${tokens.admin}`}
            });
            expect(isValidJson(companiesRes.data, ['name', '_id'], true)).toBeTruthy();
            let all_companies = companiesRes.data;
            console.log(all_companies)
            for (i in all_companies) {
                let res2 = await axios.get(`${process.env.URL}api/KeyFigures/historic/${all_companies[i]._id}`, {
                    headers: {Authorization: `Bearer ${tokens.admin}`}
                });
                expect(res2.status).toBe(200);
                expect(isValidJson(res2.data, ['cashRatio', 'roe', 'equityRatio'], false)).toBeTruthy();
            }
        } catch (error) {
            console.log(error)
            throw error;
        }
    });
            console.log(error)
            throw error;
        }
    });

    it('Testfall 22: Erstellen einer Kennzahl (schlechte Angaben)', async () => {
        let tokens = await getTokens();

        try {
            await axios.post(`${process.env.URL}api/customKeyFigures/`, {
                name: 'bad results',
                formula: undefined,
                type:  'percentage'
            }, {
                headers: {'Authorization': `Bearer ${tokens.standard}`}
            });
            throw new Error('it should not come this far')

        } catch (error) {
            expect(error.response.status).toBe(400);
        }

        try {
            await axios.post(`${process.env.URL}api/customKeyFigures/`, {
                name: undefined,
                formula: 'cash / (bank + postal)',
                type:  'numeric'
            }, {
                headers: {'Authorization': `Bearer ${tokens.standard}`}
            });
            throw new Error('it should not come this far')

        } catch (error) {
            expect(error.response.status).toBe(400);
        }

        try {
            await axios.post(`${process.env.URL}api/customKeyFigures/`, {
                name: 'bad results',
                formula: 'cash / (bank + postal)',
                type:  undefined
            }, {
                headers: {'Authorization': `Bearer ${tokens.standard}`}
            });
            throw new Error('it should not come this far')

        } catch (error) {
            expect(error.response.status).toBe(400);
        }

        try {
            await axios.post(`${process.env.URL}api/customKeyFigures/`, {
                name: 'bad results',
                formula: 'cash / (bank + postal)',
                type:  "percentage"
            });
            throw new Error('it should not come this far')

        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });

    it('Testfall 23: Erstellen einer Kennzahl', async () => {
        let tokens = await getTokens();

        try {
            let res = await axios.post(`${process.env.URL}api/customKeyFigures/`, {
                name: 'testing',
                formula: 'cash / bank',
                type:  'percentage'
            }, {
                headers: {'Authorization': `Bearer ${tokens.admin}`}
            });
            expect(res.status).toBe(201);
            expect(res.data.message).toBe('custom key figure created successfully')

        } catch (error) {
            console.log(error)
            throw error;
        }

        try {
            let res = await axios.post(`${process.env.URL}api/customKeyFigures/`, {
                name: 'testing2',
                formula: 'cash / (bank + postal)',
                type:  'numeric'
            }, {
                headers: {'Authorization': `Bearer ${tokens.standard}`}
            });
            expect(res.status).toBe(201);
            expect(res.data.message).toBe('custom key figure created successfully')

        } catch (error) {
            console.log(error)
            throw error;
        }
    });



});