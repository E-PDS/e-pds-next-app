// utils/parseObjectId.js
import { ObjectId } from "mongodb";

export function parseObjectId(id) {
  if (!id || !ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  return new ObjectId(id);
}
