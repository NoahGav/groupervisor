import { getYjsValue, syncedStore, Y } from "@syncedstore/core";
import { svelteSyncedStore } from "@syncedstore/svelte";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import type { Task, User } from ".";

const _store = syncedStore({
  users: {} as Record<string, User>,
  tasks: {} as Record<string, Task>,
  misc: {} as {
    refreshToken: string;
    minTime: number;
  }
});

const store = svelteSyncedStore(_store);
const doc: any = getYjsValue(_store);

// TODO - Change ip to linode ip.
new WebsocketProvider(
  "ws://localhost:3000",
  "room",
  doc
);

new IndexeddbPersistence("doc", doc);

export default store;