require('dotenv').config();

const axios = require('axios');
const URL = "http://80.209.226.37:5000/"

async function getTokens() {

    const adminResponse = await axios.post(`${URL}api/auth/login`, {
        role: "Admin",
        password: process.env.ADMIN_PASSWORD
    });

    const standardResponse = await axios.post(`${URL}api/auth/login`, {
        role: "Standard",
        password: process.env.USER_PASSWORD
    });

    return {
        admin: adminResponse.data.token,
        standard: standardResponse.data.token
    };
}

describe('Authentication Testing', () => {

    it('Testfall 1: Zugriff auf Website ohne Authentisierung', async () => {
        try {
            await axios.get(`${URL}api/companies`);
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${URL}api/import.html`);
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${URL}api/custom_figure.html`);
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${URL}api/protected`);
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${URL}api/admin`);
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });

    it('Testfall 2: Zugriff auf Website mit falsch formatiertem Token', async () => {
        let tokens = await getTokens();
        const badToken = tokens.admin

        try {
            await axios.get(`${URL}api/companies`, {
                headers: {Authorization: {badToken}}
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${URL}api/import.html`, {
                headers: {Authorization: {badToken}}
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${URL}api/custom_figure.html`, {
                headers: {Authorization: {badToken}}
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${URL}api/protected`, {
                headers: {Authorization: {badToken}}
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${URL}api/admin`, {
                headers: {Authorization: {badToken}}
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });

    it('Testfall 3: Zugriff auf Website mit nicht existentem Token', async () => {
        try {
            await axios.get(`${URL}api/companies`, {
                headers: {Authorization: 'Token'}
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${URL}api/import.html`, {
                headers: {Authorization: 'Token'}
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${URL}api/custom_figure.html`, {
                headers: {Authorization: 'Token'}
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${URL}api/protected`, {
                headers: {Authorization: 'Token'}
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            await axios.get(`${URL}api/admin`, {
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
        await axios.get(`${URL}api/admin`, {
          headers: {Authorization: `Bearer ${token}`}
        });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    it('Testfall 5: Bruteforce Login ', async () => {
      let accountLocked = false
      let limitReached = false
      for (let i = 0; i < 20; i++) {
        const password = "password" + i;

        try {
          const response = await axios.post(`${URL}api/auth/login`, {
            role: "Standard",
            password: password
          });

        } catch (error) {
         if (error.response.status === 401) {
              console.log(`Attempt ${i+1}`);
            } else if (error.response.status === 429) {
              limitReached = true
            } else if (error.response.status === 403) {
              accountLocked = true
            } else {
              console.error(`${error}`);
            }
        }
      }
      expect(limitReached || accountLocked).toBe(true);

      accountLocked = false
      limitReached = false

      for (let i = 0; i < 11; i++) {
        const password = "password2" + i;

        try {
          const response = await axios.post(`${URL}api/auth/login`, {
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
      expect(limitReached || accountLocked).toBe(true);
    });

    it('Testfall 6: Login mit Angaben im falschen Format', async () => {
        // This will crash the server if not handled correctly
        try {
            const response = await axios.post(`${URL}api/auth/login`, {
                role: "Standard",
                password: 234521.02
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            const response = await axios.post(`${URL}api/auth/login`, {
                role: "Admin",
                password: 234521.02
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            const response = await axios.post(`${URL}api/auth/login`, {
                role: "Standard",
                password: null
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            const response = await axios.post(`${URL}api/auth/login`, {
                role: "Admin",
                password: null
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            const response = await axios.post(`${URL}api/auth/login`, {
                role: "Standard",
                password: undefined
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            const response = await axios.post(`${URL}api/auth/login`, {
                role: "Admin",
                password: undefined
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            const response = await axios.post(`${URL}api/auth/login`, {
                role: "Standard",
                password: ""
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        try {
            const response = await axios.post(`${URL}api/auth/login`, {
                role: "Admin",
                password: ""
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });

});