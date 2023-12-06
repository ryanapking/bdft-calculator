import { customAlphabet } from "nanoid";
const alphabet = '1234567890abcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 16);

export function getId() {
  return nanoid();
}