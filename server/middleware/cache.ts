import memjs from "memjs";
import logger from "./logger";

const memcached = memjs.Client.create("localhost:11211");
export function addUser(userid: string, socket: string): Promise<void> {
  return new Promise((resolve, reject) => {
    memcached.set(userid, socket, { expires: 3600 }, (err) => {
      if (err) {
        logger.error("Failed to store socket id", err);
        reject(err);
      } else resolve();
    });
  });
}
export function findUser(userid: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    memcached.get(userid, (err, data) => {
      if (err) {
        logger.error("Failed to retrieve socket id", err);
        reject(err);
      } else resolve(data ? data.toString() : null); // ✅ convert Buffer to string
    });
  });
}

export function removeUser(userid: string): Promise<void> {
  return new Promise((resolve, reject) => {
    memcached.delete(userid, (err) => {
      if (err) {
        logger.error("Failed to delete passcode", err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function addPasscode(email: string, code: number): Promise<void> {
  return new Promise((resolve, reject) => {
    memcached.set(
      `passcode:${email}`,
      code.toString(),
      { expires: 3600 },
      (err) => {
        if (err) {
          logger.error("Failed to store passcode", err);
          reject(err);
        } else resolve();
      }
    );
  });
}
export function removePasscode(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    memcached.delete(`passcode:${email}`, (err) => {
      if (err) {
        logger.error("Failed to delete passcode", err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
export function findPasscode(email: string): Promise<number | null> {
  return new Promise((resolve, reject) => {
    memcached.get(`passcode:${email}`, (err, data) => {
      if (err) {
        logger.error("Failed to retrieve passcode", err);
        reject(err);
      } else resolve(data ? parseInt(data.toString(), 10) : null);
    });
  });
}
