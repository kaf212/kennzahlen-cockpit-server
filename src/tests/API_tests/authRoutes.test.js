require('dotenv').config();

const axios = require('axios');
const getTokens = require('./supportFunctions').getTokens;

describe('Authentication Testing', () => {

    it('Testfall 1: Zugriff auf Website ohne Authentisierung', async () => {
        try {
            await axios.get(`${process.env.URL}api/companies`);
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${process.env.URL}api/auth/protected`);
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${process.env.URL}api/auth/admin`);
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });

    it('Testfall 2: Zugriff auf Website mit falsch formatiertem Token', async () => {
        let tokens = await getTokens();
        const badToken = tokens.admin

        try {
            await axios.get(`${process.env.URL}api/companies`, {
                headers: {Authorization: {badToken}}
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${process.env.URL}api/auth/protected`, {
                headers: {Authorization: {badToken}}
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${process.env.URL}api/auth/admin`, {
                headers: {Authorization: {badToken}}
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });

    it('Testfall 3: Zugriff auf Website mit nicht existentem Token', async () => {
        try {
            await axios.get(`${process.env.URL}api/companies`, {
                headers: {Authorization: 'Token'}
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${process.env.URL}api/auth/protected`, {
                headers: {Authorization: 'Token'}
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${process.env.URL}api/auth/admin`, {
                headers: {Authorization: 'Token'}
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });

    it('Testfall 4: Unautorisierter Zugriff auf Admin Seite (Standardnutzer Token)', async () => {
        let tokens = await getTokens();
        const token = tokens.standard;

        try {
            await axios.get(`${process.env.URL}api/auth/admin`, {
                headers: {Authorization: `Bearer ${token}`}
            });
        } catch (error) {
            expect(error.response.status).toBe(403);
        }

        try {
            await axios.get(`${process.env.URL}api/companies`, {
                headers: {Authorization: `Bearer ${token}`}
            });


        } catch (error) {
            console.log(error)
            expect(error.response.status).toBe(403);
        }
    });

    it('Testfall 5: Zugriff auf API mit richtigem Token', async () => {
        let tokens = await getTokens();

        try {
            let res = await axios.get(`${process.env.URL}api/auth/admin`, {
                headers: {Authorization: `Bearer ${tokens.admin}`}
            });
            expect(res.status).toBe(200);
        } catch (error) {
            console.log(error);
            throw error;
        }

        try {
            let res1 = await axios.get(`${process.env.URL}api/auth/protected`, {
                headers: {Authorization: `Bearer ${tokens.standard}`}
            });

            let res2 = await axios.get(`${process.env.URL}api/auth/protected`, {
                headers: {Authorization: `Bearer ${tokens.admin}`}
            });

            expect(res1.status).toBe(200);
            expect(res2.status).toBe(200);

        } catch (error) {
            console.log(error);
            throw error;
        }
    });

    it('Testfall 6: Bruteforce Login ', async () => {
        let accountLocked = false
        let limitReached = false
        for (let i = 0; i < 20; i++) {
            const password = "password" + i;

            try {
                const response = await axios.post(`${process.env.URL}api/auth/login`, {
                    role: "Standard",
                    password: password
                });

            } catch (error) {
                if (error.response.status === 401) {
                    console.log(`Attempt ${i + 1}`);
                } else if (error.response.status === 429) {
                    limitReached = true
                } else if (error.response.status === 403) {
                    accountLocked = true
                } else {
                    console.error(`${error}`);
                }
            }
        }
        expect(limitReached || accountLocked).toBeTruthy();

        accountLocked = false
        limitReached = false

        for (let i = 0; i < 11; i++) {
            const password = "password2" + i;

            try {
                const response = await axios.post(`${process.env.URL}api/auth/login`, {
                    role: "Admin",
                    password: password
                });


            } catch (error) {
                if (error.response) {
                    if (error.response.status === 429) {
                        limitReached = true
                    } else if (error.response.status === 403) {
                        accountLocked = true
                    } else {
                        console.error(`${error}`);
                    }
                }
            }
        }
        expect(limitReached || accountLocked).toBeTruthy();
    });

    it('Testfall 7: Login mit Angaben im falschen Format', async () => {
        // This will crash the server if not handled correctly
        try {
            const response = await axios.post(`${process.env.URL}api/auth/login`, {
                role: "Standard",
                password: 234521.02
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
        }

        try {
            const response = await axios.post(`${process.env.URL}api/auth/login`, {
                role: "Admin",
                password: 234521.02
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
        }

        try {
            const response = await axios.post(`${process.env.URL}api/auth/login`, {
                role: "Standard",
                password: null
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
        }

        try {
            const response = await axios.post(`${process.env.URL}api/auth/login`, {
                role: "Admin",
                password: null
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
        }

        try {
            const response = await axios.post(`${process.env.URL}api/auth/login`, {
                role: "Standard",
                password: undefined
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
        }

        try {
            const response = await axios.post(`${process.env.URL}api/auth/login`, {
                role: "Admin",
                password: undefined
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
        }

        try {
            const response = await axios.post(`${process.env.URL}api/auth/login`, {
                role: "Standard",
                password: ""
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            const response = await axios.post(`${process.env.URL}api/auth/login`, {
                role: "Admin",
                password: ""
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });

});