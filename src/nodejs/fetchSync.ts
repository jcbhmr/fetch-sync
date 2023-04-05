import RequestSync from "../RequestSync.ts";
import ResponseSync from "../ResponseSync.ts";
import { spawnSync } from "node:child_process";
import { reviver, replacer } from "./serde.ts";
import fetchSyncSubprocessPath from "./fetchSync-subprocess.ts?url";

function fetchSync(input: RequestInfo, init: RequestInit = {}): ResponseSync {
  let requestSync: RequestSync;
  if (input instanceof RequestSync) {
    requestSync = input;
  } else {
    requestSync = new RequestSync(input, init);
  }

  if (requestSync.signal.aborted) {
    throw requestSync.signal.reason;
  }

  const requestSyncJSON = JSON.stringify(requestSync, replacer);
  const { stdout: responseSyncJSON } = spawnSync(
    process.execPath,
    [fetchSyncSubprocessPath],
    { input: requestSyncJSON }
  );
  const responseSync = JSON.parse(responseSyncJSON, reviver);

  return responseSync;
}

export default fetchSync;
