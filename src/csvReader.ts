import { TorneloPlayer, VegaPlayer } from "@/model";

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
    // Replace commas within quotes with underscores
    const sanitizedRow = row.replace(/"(.*?)"/g, (match) =>
      match.replace(/,/g, "_")
    );
    const columns = sanitizedRow
      .split(";")
      .map((col) => col.replace(/_/g, ","));

    players.push({
      id: columns[0]?.trim().replace(/"/g, "") || "",
      name: columns[1]?.trim().replace(/"/g, "") || "",
      rating: columns[2] ? parseInt(columns[2], 10) : null,
      country: columns[3]?.trim().replace(/"/g, "") || "",
      gender: columns[4]?.trim().replace(/"/g, "") || "",
      birthYear: columns[5] ? parseInt(columns[5], 10) : null,
    });
  }

  return players;
}
