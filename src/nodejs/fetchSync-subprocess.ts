#!/usr/bin/env node
import "./fetch-polyfill.ts";
import RequestSync from "../RequestSync.ts";
import ResponseSync from "../ResponseSync.ts";
import { reviver, replacer } from "./serde.ts";
import collectInput from "get-stdin";

const requestSync = JSON.parse(await collectInput(), reviver);
const request = new Request(requestSync.url, {
  method: requestSync.method,
  headers: requestSync.headers,
  body: requestSync.body,
});
const response = await fetch();
const responseBody = await response.arrayBuffer();
const responseSync = new ResponseSync(responseBody, {
  status: response.status,
  statusText: response.statusText,
  headers: response.headers,
});
console.info(JSON.stringify(responseSync, replacer));
