"use client";

import { useState } from "react";

interface TorneloPlayer {
  flag: string;
  player: string;
  rating: number | null;
  gender: string;
  yob: number | null;
  u: number | null;
  skip: boolean;
  bye: boolean;
}

interface VegaPlayer {
  id: string;
  name: string;
  rating: number | null;
  country: string;
  gender: string;
  birthYear: number | null;
}

function parseTorneloCSV(csvContent: string): TorneloPlayer[] {
  const rows = csvContent.split("\n").filter((row) => row.trim() !== "");
  const players: TorneloPlayer[] = [];

  for (const row of rows) {
    const columns = row.split(",");
    players.push({
      flag: columns[1]?.trim().replace(/"/g, "") || "",
      player: columns[2]?.trim().replace(/"/g, "") || "",
      rating: columns[2] ? parseInt(columns[2], 10) : null,
      gender: columns[3]?.trim().replace(/"/g, "") || "",
      yob: columns[4] ? parseInt(columns[4], 10) : null,
      u: columns[5] ? parseInt(columns[5], 10) : null,
      skip: columns[6]?.trim().toLowerCase() === "true",
      bye: columns[7]?.trim().toLowerCase() === "true",
    });
  }

  return players;
}

function parseVegaCSV(csvContent: string): VegaPlayer[] {
  const rows = csvContent.split("\n").filter((row) => row.trim() !== "");
  const players: VegaPlayer[] = [];

  for (const row of rows) {
    const columns = row.split(",");
    players.push({
      id: columns[0]?.trim() || "",
      name: columns[1]?.trim() || "",
      rating: columns[2] ? parseInt(columns[2], 10) : null,
      country: columns[3]?.trim() || "",
      gender: columns[4]?.trim() || "",
      birthYear: columns[5] ? parseInt(columns[5], 10) : null,
    });
  }

  return players;
}

export default function Home() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [destinationFile, setDestinationFile] = useState<File | null>(null);
  const [playersWithMissingInfo, setPlayersWithMissingInfo] = useState<
    (TorneloPlayer & { missingInVega: boolean })[]
  >([]);
  const [filterMissing, setFilterMissing] = useState<boolean>(false);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = event.target.files?.[0] || null;
    setFile(file);
  };

  const handleCompare = async () => {
    if (!sourceFile || !destinationFile) {
      alert("Please select both source and destination files.");
      return;
    }

    const sourceText = await sourceFile.text();
    const destinationText = await destinationFile.text();

    const torneloPlayers = parseTorneloCSV(sourceText);
    const vegaPlayers = parseVegaCSV(destinationText);

    const playersWithMissing = torneloPlayers.map((torneloPlayer) => {
      const [lastName, firstName] = torneloPlayer.player
        .split(",")
        .map((name) => name.trim());

      const isInVega = vegaPlayers.some((vegaPlayer) => {
        const vegaNameParts = vegaPlayer.name
          .split(" ")
          .map((name) => name.trim());
        return (
          vegaNameParts.includes(firstName) || vegaNameParts.includes(lastName)
        );
      });

      return {
        ...torneloPlayer,
        missingInVega: !isInVega,
      };
    });

    setPlayersWithMissingInfo(playersWithMissing);
  };

  const filteredPlayers = filterMissing
    ? playersWithMissingInfo.filter((player) => player.missingInVega)
    : playersWithMissingInfo;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CSV File Comparator</h1>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Source File (Tornelo):</label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleFileChange(e, setSourceFile)}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Destination File (Vega):
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleFileChange(e, setDestinationFile)}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="flex items-center mb-4">
        <button
          onClick={handleCompare}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
        >
          Compare
        </button>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filterMissing}
            onChange={(e) => setFilterMissing(e.target.checked)}
            className="mr-2"
          />
          Show only missing players
        </label>
      </div>

      {filteredPlayers.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Players Comparison:</h2>
          <table className="table-auto border-collapse border border-gray-400 w-full text-black">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-2">Player</th>
                <th className="border border-gray-400 px-4 py-2">Rating</th>
                <th className="border border-gray-400 px-4 py-2">Gender</th>
                <th className="border border-gray-400 px-4 py-2">
                  Year of Birth
                </th>
                <th className="border border-gray-400 px-4 py-2">
                  Missing in Vega
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player, index) => (
                <tr
                  key={index}
                  className={
                    player.missingInVega ? "bg-red-100" : "bg-green-100"
                  }
                >
                  <td className="border border-gray-400 px-4 py-2">
                    {player.player}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {player.rating}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {player.gender}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {player.yob}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {player.missingInVega ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
