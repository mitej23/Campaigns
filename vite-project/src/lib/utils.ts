import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const getDateString = (date: string) => {
  const tDate = new Date(date);
  return `${tDate.getDate()}/${tDate.getMonth() + 1}/${tDate.getFullYear()} @ ${
    tDate.getHours() > 9 ? tDate.getHours() % 12 : "0" + tDate.getHours()
  }:${tDate.getMinutes() > 9 ? tDate.getMinutes() : "0" + tDate.getMinutes()} ${
    tDate.getHours() > 11 ? "pm" : "am"
  }`;
};

