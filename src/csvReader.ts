import { TorneloPlayer, VegaPlayer } from "@/model";
import Fuse from "fuse.js";

export function parseTorneloCSV(csvContent: string): TorneloPlayer[] {
  const rows = csvContent.split("\n").filter((row) => row.trim() !== "");
  const players: TorneloPlayer[] = [];

  // Skip the header row
  for (const row of rows.slice(1)) {
    // Replace commas within quotes with underscores
    const sanitizedRow = row.replace(/"(.*?)"/g, (match) =>
      match.replace(/,/g, "_")
    );
    const columns = sanitizedRow
      .split(",")
      .map((col) => col.replace(/_/g, ","));

    players.push({
      flag: columns[1]?.trim().replace(/"/g, "") || "",
      player: columns[2]?.trim().replace(/"/g, "") || "",
      rating: columns[3] ? parseInt(columns[3], 10) : null,
      gender: columns[4]?.trim().replace(/"/g, "") || "",
      yob: columns[5] ? parseInt(columns[5], 10) : null,
      u: columns[6] ? parseInt(columns[6], 10) : null,
      skip: columns[7]?.trim().toLowerCase() === "true",
      bye: columns[8]?.trim().toLowerCase() === "true",
    });
  }

  return players;
}

export function parseVegaCSV(csvContent: string): VegaPlayer[] {
  const rows = csvContent.split("\n").filter((row) => row.trim() !== "");
  const players: VegaPlayer[] = [];

  // Skip the header row
  for (const row of rows.slice(1)) {
    const columns = row.split(";").map((col) => col.trim().replace(/"/g, ""));

    players.push({
      id: columns[0] || "",
      name: columns[1] || "",
      rating: columns[2] ? parseInt(columns[2], 10) : null,
      country: columns[3] || "",
      gender: columns[4] || "",
      birthYear: columns[5] ? parseInt(columns[5], 10) : null,
    });
  }

  return players;
}

export function findClosestMatch(
  name: string,
  players: VegaPlayer[],
  threshold: number
): VegaPlayer | null {
  // Invert the threshold to align with user expectations (higher = stricter)
  const adjustedThreshold = 1 - threshold / 100;
  const fuse = new Fuse(players, {
    keys: ["name"],
    threshold: adjustedThreshold,
  });
  const result = fuse.search(name);
  return result.length > 0 ? result[0].item : null;
}
