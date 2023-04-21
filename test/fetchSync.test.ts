// @vitest-environment jsdom
import { assert, test, expect } from "vitest";
import fetchSync from "../src/fetchSync.ts";

test("works with XHR", () => {
  const response = fetchSync("https://example.org/");
  const text = response.text();
  assert(typeof text === "string");
});

test(".blob() works", () => {
  const response = fetchSync("https://example.org/");
  const blob = response.blob();
  assert(blob instanceof Blob);
});

test(".blob() MIME type essence is right", () => {
  const response = fetchSync("https://example.org/");
  const blob = response.blob();
  assert(blob.type === "text/html");
});

test(".json() works", () => {
  const response = fetchSync("https://jsonplaceholder.typicode.com/todos/1");
  const json = response.json();
  assert(json);
});

test("fails on file: URLs", () => {
  expect(() => fetchSync("file:///C:/Windows/explorer.exe")).toThrow();
});

test("fails on DNS issues", () => {
  expect(() => fetchSync("https://example/file.txt")).toThrow();
});

test("works with larger files", () => {
  // https://corpus.canterbury.ac.nz/descriptions/
  const response = fetchSync(
    "http://corpus.canterbury.ac.nz/resources/cantrbry.tar.gz"
  );
  const buffer = response.arrayBuffer();
  assert(buffer);
});
