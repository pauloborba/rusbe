import request = require("request-promise");
import { generateLogin } from './groups.repository.spec'
var base_url = "http://localhost:3333/groups/";

describe("The rusbe server", () => {
  let server: any;
  beforeAll(() => {
    server = require("../src/index")
  });
  it("creates groups with existing users", () => {
    const users = ["gil97", "totonio", "Rob"]
    const bodypost = { "json": { "members": users, "name": "EngRU" } }
    return request.post(base_url + "creategroup", bodypost)
      .then(body => {
        expect(body["group"]["name"]).not.toBe(undefined)
      })
      .catch(e =>
        expect(e).toEqual(null)
      );
  })
  it("doesn't creates groups with non-existing users", () => {
    const users = ["gil97", "totonio", "Roberto", "Toninho Rodrigues"]
    const bodypost = { "json": { "members": users, "name": "EngRU" } }
    return request.post(base_url + "creategroup", bodypost)
      .then(body => {
        expect(body["missingMembers"]).toEqual(["Roberto", "Toninho Rodrigues"])
      })
      .catch(e =>
        expect(e).toEqual(null)
      );
  })
  it("return no groups and no times for non-existing users", () => {
    return request.get(base_url + "usergroups?id=joaoDaSilva")
      .then(body => {
        body = JSON.parse(body)
        expect(body.groups).toEqual([])
        expect(body.times).toEqual([])
      })
      .catch(e =>
        expect(e).toEqual(null)
      );
  })
  it("return a list of groups for existing users", async () => {
    let user = generateLogin()
    await request.post('http://localhost:3333/newuser', { "json": { "id": user, "password": "123", "name": user } })
    const users = [user, "gil97", "totonio", "Rob"]
    let bodypost = { "json": { "members": users, "name": "EngRU" } }
    await request.post(base_url + "creategroup", bodypost)
    bodypost = { "json": { "members": users, "name": "AlmoCInho" } }
    await request.post(base_url + "creategroup", bodypost)
    bodypost = { "json": { "members": users, "name": "RUcomFome" } }
    await request.post(base_url + "creategroup", bodypost)
    return request.get(base_url + "usergroups?id=" + user)
      .then(body => {
        body = JSON.parse(body)
        expect(body["groups"].map(gr => gr["name"])).toEqual(["EngRU", "AlmoCInho", "RUcomFome"])
      })
      .catch(e =>
        expect(e).toEqual(null)
      );
  })
})
