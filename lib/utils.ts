import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function formatDate(date: Date | string): string {
//   const d = new Date(date)
//   return d.toLocaleDateString("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   })
// }

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const formatServiceTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  const hour = Number.parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
  return value.toString();
}

export const getDayName = (dayOfWeek: number) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayOfWeek];
};

export const getCategoryColor = (category: string) => {
  const colors = {
    Worship: "bg-[#F5F6F5] text-[#1a1a1a]",
    Study: "bg-[#F5F6F5] text-[#1a1a1a]",
    Youth: "bg-[#F5F6F5] text-[#1a1a1a]",
    Music: "bg-[#F5F6F5] text-[#1a1a1a]",
  };
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export function formatDate(date: Date): string {
  // Format: "Jan 15, 2023"
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString(undefined, options);
}

export function formatDate2(date: Date | string): string {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return d.toLocaleDateString("en-US", options);
}

export function cn2(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

const adjectives = [
  "Adventurous",
  "Brave",
  "Clever",
  "Dazzling",
  "Elegant",
  "Fierce",
  "Gentle",
  "Happy",
  "Intelligent",
  "Jolly",
  "Kind",
  "Lively",
  "Magnificent",
  "Noble",
  "Optimistic",
  "Peaceful",
  "Quirky",
  "Radiant",
  "Sincere",
  "Thoughtful",
  "Unique",
  "Vibrant",
  "Wise",
  "Zestful",
];

const nouns = [
  "Aardvark",
  "Butterfly",
  "Cheetah",
  "Dolphin",
  "Elephant",
  "Flamingo",
  "Giraffe",
  "Hedgehog",
  "Iguana",
  "Jaguar",
  "Koala",
  "Lemur",
  "Meerkat",
  "Narwhal",
  "Octopus",
  "Penguin",
  "Quokka",
  "Raccoon",
  "Sloth",
  "Tiger",
  "Unicorn",
  "Vulture",
  "Walrus",
  "Xenops",
  "Yak",
  "Zebra",
];

export function generateUniqueName(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective} ${noun}`;
}
