import request = require("request-promise");
var base_url = "http://localhost:3333/menu/";

describe("The rusbe server", () => {
  let server: any;
  const timeout: number = 3000;
  beforeAll(() => {
    server = require('../src/index');
  });

  afterAll(() => {
    //server.closeServer();
  });

  it("gets the daily menu", () => {
    return request.get(base_url + "dailymenu")
      .then(body => {
        const menu = JSON.parse(body)
        expect(menu["breakfast"]).not.toBe(undefined);
        expect(menu["lunch"]).not.toBe(undefined);
        expect(menu["dinner"]).not.toBe(undefined);
      })
      .catch(e =>
        expect(e).toEqual(null)
      );
  }, timeout);

  it("computes like vote from an registered user to a existing food", () => {
    const bodypost = { "json": { "id": "alpvj", "foodName": "Arroz", "isLike": "true" } }
    return request.post(base_url + "vote", bodypost)
      .then(body => {
        expect(body["msg"]).toEqual("Success")
      })
      .catch(e =>
        expect(e).toEqual(null)
      );
  }, timeout);

  it("computes dislike vote from an registered user to a existing food", () => {
    const bodypost = { "json": { "id": "alpvj", "foodName": "Arroz", "isLike": "false" } }
    return request.post(base_url + "vote", bodypost)
      .then(body => {
        expect(body["msg"]).toEqual("Success")
      })
      .catch(e =>
        expect(e).toEqual(null)
      );
  }, timeout);
});