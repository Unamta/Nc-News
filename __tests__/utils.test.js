const {
  convertTimestampToDate,
  formatTopics,
  formatUsers,
  formatArticles,
  formatComments,
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe('formatTopics', () => {
  test('When passed an empty array, should return an empty array', () => {
    // Arrange
    const input = [];
    const expected = [];
    // Act
    const result = formatTopics(input);
    // Assert
    expect(result).toEqual(expected);
  });

  test('When passed an array with one object, should return an array of arrays with the elements of the inner array being the fields of the object', () => {
    // Arrange
    const input = [{
      description: "types are love, types are life",
      slug: "Why typescript is better than javascript",
      img_url: "",
    }];
    const expected = [["Why typescript is better than javascript","types are love, types are life", ""]];
    // Act
    const result = formatTopics(input);
    // Assert
    expect(result);
  });

  test("does not mutate the input", () => {
    const input = [
      {
        description: "Functional programming",
        slug: "fp",
        img_url: "image.png",
      },
    ];

    const copyOfInput = [
      {
        description: "Functional programming",
        slug: "fp",
        img_url: "image.png",
      },
    ];

    formatTopics(input);
    expect(input).toEqual(copyOfInput);
  });
});

describe("formatUsers", () => {
  test("returns an empty array when passed an empty array", () => {
    const input = [];
    const expected = [];
    const result = formatUsers(input);
    expect(result).toEqual(expected);
  });

  test("returns an array of arrays when passed an array with one object", () => {
    const input = [
      {
        username: "johndoe",
        name: "John Doe",
        avatar_url: "https://example.com/avatar.jpg",
      },
    ];
    const expected = [["johndoe", "John Doe", "https://example.com/avatar.jpg"]];
    const result = formatUsers(input);
    expect(result).toEqual(expected);
  });

  test("does not mutate the input", () => {
    const input = [
      {
        username: "janedoe",
        name: "Jane Doe",
        avatar_url: "https://example.com/avatar2.jpg",
      },
    ];
    const copyOfInput = [
      {
        username: "janedoe",
        name: "Jane Doe",
        avatar_url: "https://example.com/avatar2.jpg",
      },
    ]; 
    formatUsers(input);
    expect(input).toEqual(copyOfInput);
  });
});

describe("formatArticles", () => {
  test("returns an empty array when passed an empty array", () => {
    const input = [];
    const expected = [];
    const result = formatArticles(input);
    expect(result).toEqual(expected);
  });
});



