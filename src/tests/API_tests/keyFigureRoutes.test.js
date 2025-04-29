require('dotenv').config();

const axios = require('axios');
const {isValidJson} = require("./supportFunctions");
const getTokens = require('./supportFunctions').getTokens;
let testing2ID;

jest.setTimeout(10000) // 10 seconds

describe('KeyFigure Routes Testing', () => {
    it('Testfall 20: Kennzahlen des Aktuellen Jahrs aufrufen', async () => {
        let tokens = await getTokens();

        try {
            let companiesRes = await axios.get(`${process.env.URL}api/companies`, {
                headers: {Authorization: `Bearer ${tokens.standard}`}
            });
            expect(isValidJson(companiesRes.data, ['name', '_id'], true)).toBeTruthy();
            let all_companies = companiesRes.data;
            for (i in all_companies) {
                let res2 = await axios.get(`${process.env.URL}api/KeyFigures/current/${all_companies[i]._id}`, {
                    headers: {Authorization: `Bearer ${tokens.standard}`}
                });
                if (res2.status !== 404){
                    expect(res2.status).toBe(200);
                    expect(isValidJson(res2.data, ['keyFigures', 'period'], false)).toBeTruthy();
                }
            }

        } catch (error) {
            if (error.response){
                expect(error.response.status).toBe(404);
            }else{
               console.log(error)
                throw error;
            }
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
                    expect(res2.status).toBe(200);
                    expect(isValidJson(res2.data, ['keyFigures', 'period'], false)).toBeTruthy();
                }
            }

        } catch (error) {
            if (error.response){
                expect(error.response.status).toBe(404);
            }else{
               console.log(error)
                throw error;
            }
        }
    });

    it('Testfall 21: Alle Kennzahlen der Unternehmen aufrufen', async () => {
            let tokens = await getTokens();

            try {
                let companiesRes = await axios.get(`${process.env.URL}api/companies`, {
                    headers: {Authorization: `Bearer ${tokens.standard}`}
                });
                expect(isValidJson(companiesRes.data, ['name', '_id'], true)).toBeTruthy();
                let all_companies = companiesRes.data;
                for (i in all_companies) {
                    let res2 = await axios.get(`${process.env.URL}api/KeyFigures/historic/${all_companies[i]._id}`, {
                        headers: {Authorization: `Bearer ${tokens.standard}`}
                    });
                    if (res2.status !== 404){
                        expect(res2.status).toBe(200);
                        expect(isValidJson(res2.data, ['cashRatio', 'roe', 'equityRatio'], false)).toBeTruthy();
                    }
                }

            } catch (error) {
                if (error.response){
                    expect(error.response.status).toBe(404);
                }else{
                    console.log(error)
                    throw error;
                }
            }

            try {
                let companiesRes = await axios.get(`${process.env.URL}api/companies`, {
                    headers: {Authorization: `Bearer ${tokens.admin}`}
                });
                expect(isValidJson(companiesRes.data, ['name', '_id'], true)).toBeTruthy();
                let all_companies = companiesRes.data;
                for (i in all_companies) {
                    let res2 = await axios.get(`${process.env.URL}api/KeyFigures/historic/${all_companies[i]._id}`, {
                        headers: {Authorization: `Bearer ${tokens.admin}`}
                    });
                    expect(res2.status).toBe(200);
                    expect(isValidJson(res2.data, ['cashRatio', 'roe', 'equityRatio'], false)).toBeTruthy();
                }
            } catch (error) {
                if (error.response){
                    expect(error.response.status).toBe(404);
                }else{
                    console.log(error)
                    throw error;
                }
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

    it('Testfall 23: Erstellen von Kennzahlen', async () => {
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

    it('Testfall 24: Aufruf aller Custom-Kennzahlen', async () => {
        let tokens = await getTokens();

        try {
            let res = await axios.get(`${process.env.URL}api/customKeyFigures/`, {
                headers: {'Authorization': `Bearer ${tokens.standard}`}
            });
            expect(res.status).toBe(200);
            expect(isValidJson(res.data, ['_id', 'name', 'formula', 'type'], true))

        } catch (error) {
            console.log(error)
            throw error;
        }

        try {
            let res = await axios.get(`${process.env.URL}api/customKeyFigures/`, {
                headers: {'Authorization': `Bearer ${tokens.admin}`}
            });
            expect(res.status).toBe(200);
            expect(isValidJson(res.data, ['_id', 'name', 'formula', 'type'], true))
        } catch (error) {
            console.log(error)
            throw error;
        }
    });
/*

 */
    it('Testfall 25: Aufruf spezifischer Kennzahlen', async () => {
        let tokens = await getTokens();
        let all_keyFigures;

        try {
            let res = await axios.get(`${process.env.URL}api/customKeyFigures`, {
                headers: {Authorization: `Bearer ${tokens.standard}`}
            });
            expect(isValidJson(res.data, ['name', '_id'], true)).toBeTruthy()
            all_keyFigures = res.data

            for (i in all_keyFigures){
                let res2 = await axios.get(`${process.env.URL}api/customKeyFigures/${all_keyFigures[i]._id}`, {
                    headers: {Authorization: `Bearer ${tokens.standard}`}
                });
                expect(res2.status).toBe(200);
                expect(isValidJson(res2.data, ['_id', 'name', 'formula', 'type'], false)).toBeTruthy()
            }
        } catch (error) {
            console.log(error)
            throw error;
        }

        try {
            let res = await axios.get(`${process.env.URL}api/customKeyFigures/`, {
                headers: {Authorization: `Bearer ${tokens.admin}`}
            });
            expect(isValidJson(res.data, ['name', '_id'], true)).toBeTruthy()
            all_keyFigures = res.data

            for (i in all_keyFigures){
                let res2 = await axios.get(`${process.env.URL}api/customKeyFigures/${all_keyFigures[i]._id}`, {
                    headers: {Authorization: `Bearer ${tokens.admin}`}
                });
                expect(res2.status).toBe(200);
                expect(isValidJson(res2.data, ['_id', 'name', 'formula', 'type'], false)).toBeTruthy()
            }
        } catch (error) {
            console.log(error)
            throw error;
        }
    });

    it('Testfall 26: Bearbeitung existierender Custom-Kennzahlen', async () => {
        let tokens = await getTokens();
        let all_keyFigures;

        try {
            let res = await axios.get(`${process.env.URL}api/customKeyFigures/`, {
                headers: {Authorization: `Bearer ${tokens.admin}`}
            });
            expect(isValidJson(res.data, ['name', '_id'], true)).toBeTruthy()
            all_keyFigures = res.data

            for (i in all_keyFigures){
                if (all_keyFigures[i].name === 'testing2'){
                    let res2 = await axios.patch(`${process.env.URL}api/customKeyFigures/${all_keyFigures[i]._id}`, {
                        name: 'testing2 changed',
                        formula: 'cash / (bank + postal + receivables)'
                    }, {
                        headers: {'Authorization': `Bearer ${tokens.admin}`}
                    });
                    expect(res2.status).toBe(201);
                    expect(res2.data.message).toBe('custom key figure updated successfully');
                }
            }
        } catch (error) {
            console.log(error)
            throw error;
        }

        try {
            let res = await axios.get(`${process.env.URL}api/customKeyFigures`, {
                headers: {Authorization: `Bearer ${tokens.standard}`}
            });
            expect(isValidJson(res.data, ['name', '_id'], true)).toBeTruthy()
            all_keyFigures = res.data

            for (i in all_keyFigures){
                if (all_keyFigures[i].name === 'testing'){
                    let res2 = await axios.patch(`${process.env.URL}api/customKeyFigures/${all_keyFigures[i]._id}`, {
                        name: 'testing changed',
                        type:  'percentage'
                    }, {
                        headers: {'Authorization': `Bearer ${tokens.standard}`}
                    });
                }

            }
            throw new Error('it should not come this far');

        } catch (error) {
            if (error.response !== undefined) {
                expect(error.response.status).toBe(403);
            } else {
                throw error
            }
        }
    });

    it('Testfall 27: Löschen von Kennzahlen (Standardnutzer)', async () => {
        let tokens = await getTokens();
        let all_keyFigures;

        try {
            let res = await axios.get(`${process.env.URL}api/customKeyFigures`, {
                headers: {Authorization: `Bearer ${tokens.standard}`}
            });
            expect(isValidJson(res.data, ['name', '_id'], true)).toBeTruthy()
            all_keyFigures = res.data

            for (i in all_keyFigures) {
                if (all_keyFigures[i].name === 'testing') {
                    let res2 = await axios.delete(`${process.env.URL}api/customKeyFigures/${all_keyFigures[i]._id}`, {
                        headers: {'Authorization': `Bearer ${tokens.standard}`}
                    });
                }
            }
            throw new Error('it should not come this far');

        } catch (error) {
            if(error.response !== undefined){
                expect(error.response.status).toBe(403);
            }else{
                throw error
            }

        }
    });


    it('Testfall 28: Löschen von Kennzahlen (Admin)', async () => {
        let tokens = await getTokens();
        let all_keyFigures;

        try {
            let res = await axios.get(`${process.env.URL}api/customKeyFigures/`, {
                headers: {Authorization: `Bearer ${tokens.admin}`}
            });
            expect(isValidJson(res.data, ['name', '_id'], true)).toBeTruthy()
            all_keyFigures = res.data

            for (i in all_keyFigures){
                if (all_keyFigures[i].name === 'testing'){
                    //saving to variable for future test
                    testingID = all_keyFigures[i]._id

                    let res2 = await axios.delete(`${process.env.URL}api/customKeyFigures/${all_keyFigures[i]._id}`, {
                        headers: {'Authorization': `Bearer ${tokens.admin}`}
                    });

                    res = await axios.get(`${process.env.URL}api/customKeyFigures/`, {
                        headers: {Authorization: `Bearer ${tokens.admin}`}
                    });

                    if (res.data[i].name !== 'testing changed'){
                        expect(res2.status).toBe(200);
                    }else{
                        throw new Error('delete did not do its job');
                    }
                }

                //cleanup of tests
                if (all_keyFigures[i].name === 'testing2 changed'){
                    //saving to variable for future test
                    testing2ID = all_keyFigures[i]._id

                    let res2 = await axios.delete(`${process.env.URL}api/customKeyFigures/${all_keyFigures[i]._id}`, {
                        headers: {'Authorization': `Bearer ${tokens.admin}`}
                    });

                    res = await axios.get(`${process.env.URL}api/customKeyFigures/`, {
                        headers: {Authorization: `Bearer ${tokens.admin}`}
                    });

                    if (res.data[i] === undefined || res.data[i].name !== 'testing2 changed'){
                        expect(res2.status).toBe(200);
                    }else{
                        throw new Error('delete did not do its job');
                    }
                }
            }
        } catch (error) {
            console.log(error)
            throw error;
        }
    });

    it('Testfall 29: Löschen von bereits gelöschten Kennzahlen', async () => {
        let tokens = await getTokens();

        try {
            await axios.delete(`${process.env.URL}api/customKeyFigures/${testing2ID}`, {
                headers: {'Authorization': `Bearer ${tokens.admin}`}
            });
            throw new Error('it should not come this far');

        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data.message).toBe('custom key figure not found');
        }
    });

});