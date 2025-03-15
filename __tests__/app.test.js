const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

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
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
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
      });
  });

  test("200: None of the articles should have a body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });

  describe("Sorting tests", () => {
    test("200: Responds with an array of articles sorted by votes in descending order when passed sort_by=votes as a query", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeSorted({
            key: "votes",
            descending: true,
          });
        });
    });
    test("200: Responds with an array of articles sorted by votes in ascending order when passed sort_by=votes and order=asc as queries", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeSorted({
            key: "votes",
            descending: false,
          });
        });
    });
    test("400: Responds with Bad Request when passed in a value not in the greenlist", () => {
      return request(app)
        .get("/api/articles?sort_by=not_a_column")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Bad Request");
        });
    });
  });

  describe("Filter tests", () => {
    test("200: Responds with an array of articles with the topic specified in the query", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toHaveLength(1);
          articles.forEach((article) => {
            expect(article.topic).toEqual("cats");
          });
        });
    });
    test("200: Responds with an array of articles with the topic specified in the query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article.topic).toEqual("mitch");
          });
        });
    });
    test("200: Responds with an array of articles with the topic specified in the query", () => {
      return request(app)
        .get("/api/articles?topic=not_a_topic")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toHaveLength(0);
        });
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article corresponding to the passed in id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        const {
          author,
          title,
          article_id,
          topic,
          created_at,
          votes,
          article_img_url,
        } = body.article;
        expect(typeof author).toEqual("string");
        expect(typeof title).toEqual("string");
        expect(typeof article_id).toEqual("number");
        expect(typeof body.article.body).toEqual("string");
        expect(typeof topic).toEqual("string");
        expect(typeof created_at).toEqual("string");
        expect(typeof votes).toEqual("number");
        expect(typeof article_img_url).toEqual("string");
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

  test("200: Response should have a comment_count property", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.comment_count).toEqual(2);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with a 201 and the posted comment", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: "icellusedkars",
        body: "this is my comment",
      })
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        const { article_id, comment_id, votes, created_at, author } = comment;
        const commentBody = comment.body;
        expect(article_id).toEqual(3);
        expect(comment_id).toEqual(19);
        expect(votes).toEqual(0);
        expect(author).toEqual("icellusedkars");
        expect(commentBody).toEqual("this is my comment");
        expect(typeof created_at).toEqual("string");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds will all comments for an article", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toHaveLength(2);
      });
  });

  test("200: The array of comments should have comment_id, votes, created_at, author, body and article_id properties", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments[1]).toEqual({
          comment_id: 10,
          votes: 0,
          created_at: "2020-06-20T07:24:00.000Z",
          author: "icellusedkars",
          body: "git push origin master",
          article_id: 3,
        });
      });
  });

  test("200: The array of comments should be ordered with the most recent comments first", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });

  test("404: Responds with a 404 when the passed in id doesn't exist in the database", () => {
    return request(app)
      .get("/api/articles/8888/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
      });
  });

  test("400: Responds with a 400 when passed an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the updated article when the patch is successful", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({
        inc_votes: 5,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toEqual(5);
      });
  });
  test("404: Responds with Not Found when the article_id doesn't exist in the database", () => {
    return request(app)
      .patch("/api/articles/8888")
      .send({
        inc_votes: 1,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
      });
  });
  test("400: Responds with Bad Request when the body doesn't have an inc_votes property", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({
        wrong_property: 3,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with no content when deleting a comment in the database", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("404: Responds with not found when deleting a comment not in the database", () => {
    return request(app)
      .delete("/api/comments/8888")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
      });
  });
  test("200: Each user in the array has a username, name, and avatar_url property", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});
