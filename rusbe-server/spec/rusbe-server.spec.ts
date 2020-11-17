import request = require('request-promise');

const baseUrl = "http://localhost:3333/"

describe("The Rusbe server", () => {
    let server: any;

    beforeAll(() => {
        server = require('../src/index');
    });

    afterAll(() => {
        server.closeServer();
    });

    it("retrieves suggestions from a user successfully", () => {
        const options = {json: true};

        return request.get(baseUrl + "suggestions", options).then(body => {
            expect(body.suggestions).toBeDefined();
        }).catch(e => {
            expect(e).toEqual(null);
        })
    })

});