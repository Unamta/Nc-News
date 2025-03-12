const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json");
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data/index.js")

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data)
})

afterAll(() => {
  return db.end()
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });

  test("404: Responds with Not Found on a non-existent endpoint", () => {
    return request(app)
      .get("/app/not-an-endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
        expect(body.status).toEqual(404);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Should return an array of topics objects with a slug and a description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string")
          expect(typeof topic.description).toBe("string")
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(13);
      });
  });
  test("200: The returned array of articles are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        const copyOfArticles = articles.slice();
        copyOfArticles.sort((a, b) => {
          if (a > b) {
            return -1;
          }
          return 1;
        });
        expect(articles).toEqual(copyOfArticles);
      })
  });
  test("200: None of the articles should have a body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        articles.forEach((article) => {
          expect(article).not.toHaveProperty('body');
        })
      })
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article corresponding to the passed in id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        const { author, title, article_id, topic, created_at, votes, article_img_url } = body.article;
        expect(typeof author).toEqual('string');
        expect(typeof title).toEqual('string');
        expect(typeof article_id).toEqual('number');
        expect(typeof body.article.body).toEqual('string');
        expect(typeof topic).toEqual('string');
        expect(typeof created_at).toEqual('string');
        expect(typeof votes).toEqual('number');
        expect(typeof article_img_url).toEqual('string');
      });
  });

  test("404: Responds with a 404 when passed an id not in the database", () => {
    return request(app)
      .get("/api/articles/8888")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
      });
  });

  test("400: Responds with a 400 when passed a invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});


