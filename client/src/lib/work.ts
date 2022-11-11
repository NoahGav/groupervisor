import type { Task } from "./task";

export type Work = {
  uid: string;
  start: number;
  end?: number;
};

export class WorkHelper {
  public static getAllWork(tasks: Record<string, Task>, uid: string): Work[] {
    const allWork = [];

    Object.entries(tasks).forEach(([id, task]) => {
      task.work.forEach(work => {
        if (work.uid === uid) allWork.push(work);
      });
    });

    return allWork;
  }

  public static getWorkForTask(tasks: Record<string, Task>, uid: string, taskId: string): Work[] {
    const allWork = [];

    Object.entries(tasks).forEach(([id, task]) => {
      if (id === taskId) {
        task.work.forEach(work => {
          if (work.uid === uid) allWork.push(work);
        });
      }
    });

    return allWork;
  }

  public static workDoneToday(tasks: Record<string, Task>, uid: string) {
    return this.getAllWork(tasks, uid).filter(work => this.isToday(work.start));
  }

  public static timeDoneToday(tasks: Record<string, Task>, uid: string, time: number) {
    const workToday = this.workDoneToday(tasks, uid);
    let total = 0;

    workToday.forEach(work => {
      if (work.end) total += work.end - work.start;
      else total += time - work.start;
    });

    return total;
  }

  public static timePerTaskOnDay(tasks: Record<string, Task>, uid: string, time: number, day: Date) {
    const times = {} as Record<string, number>;

    Object.entries(tasks).forEach(([tid, task]) => {
      let total = 0;

      task.work.forEach(work => {
        if (work.uid !== uid) return;
        if (!this.isSameDay(day.getTime(), work.start)) return;

        if (!work.end) total += time - work.start;
        else total += work.end - work.start;
      });

      if (total !== 0) times[tid] = total;
    });

    return times;
  }

  public static isWorking(tasks: Record<string, Task>, uid: string) {
    return this.workDoneToday(tasks, uid).some(work => !work.end);
  }

  public static currentTask(tasks: Record<string, Task>, uid: string): string {
    let currentTask = "";

    Object.entries(tasks).forEach(([tid, task]) => {
      task.work.forEach(work => {
        if (work.uid !== uid) return;
        if (!this.isToday(work.start)) return;
        if (work.end) return;

        currentTask = tid;
      });
    });

    return currentTask;
  }

  public static isToday(time: number) {
    const today = new Date();
    const date = new Date(time);

    return date.getDate() == today.getDate() &&
      date.getMonth() == today.getMonth() &&
      date.getFullYear() == today.getFullYear();
  }

  public static isSameDay(a: number, b: number) {
    const day1 = new Date(a);
    const day2 = new Date(b);

    return day2.getDate() == day1.getDate() &&
      day2.getMonth() == day1.getMonth() &&
      day2.getFullYear() == day1.getFullYear();
  }
}