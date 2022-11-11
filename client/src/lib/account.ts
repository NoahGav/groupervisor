import { v4 as uuid } from "uuid";

class Account {
  private _uid: string | null;

  /** Gets the uid of the current user's account. */
  public get uid(): string {
    // Check for cached uid.
    if (this._uid) return this._uid;

    const uid = localStorage.getItem("uid");

    // Generate a uuid if the account doesn't exist.
    if (!uid) {
      const newUid = uuid();
      localStorage.setItem("uid", newUid);
      this._uid = uid;
      return newUid;
    }

    this._uid = uid;
    return uid;
  }
}

export const account = new Account();