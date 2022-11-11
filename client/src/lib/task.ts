import type { Work } from "./work";

export type Task = {
  name: string;
  estimate: number;
  work: Work[];
};