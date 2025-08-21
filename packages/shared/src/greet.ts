import dayjs from "dayjs";

export function greet(name: string): string {
  return `Hello, ${name}! It is ${dayjs().format()}`;
}
