import supertest from "supertest"

export const getUserAccessToken = async (app, email, password): Promise<string> => {
  const res = await supertest(app.getHttpServer())
    .post("/auth/login")
    .send({ email, password })
    .expect(201)
  return getTokenFromCookie(res)
}

export const getTokenFromCookie = (response) => {
  return response.header?.["set-cookie"].find((cookie) => cookie.startsWith("access-token="))
}
