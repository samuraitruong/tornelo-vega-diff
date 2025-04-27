"use client";

import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { parseTorneloCSV, parseVegaCSV } from "../csvReader";
import { TorneloPlayer } from "@/model";
import { checkMissingPlayers } from "../utils/playerUtils";

export default function Home() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [destinationFile, setDestinationFile] = useState<File | null>(null);
  const [playersWithMissingInfo, setPlayersWithMissingInfo] = useState<
    (TorneloPlayer & { missingInVega: boolean })[]
  >([]);
  const [filterMissing, setFilterMissing] = useState<boolean>(false);
  const [useFuzzyMatch, setUseFuzzyMatch] = useState<boolean>(false);
  const [fuzzyMatchThreshold, setFuzzyMatchThreshold] = useState<number>(80);

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

    const playersWithMissing = checkMissingPlayers(
      torneloPlayers,
      vegaPlayers,
      useFuzzyMatch,
      fuzzyMatchThreshold
    );

    setPlayersWithMissingInfo(playersWithMissing);
  };

  const filteredPlayers = filterMissing
    ? playersWithMissingInfo.filter((player) => player.missingInVega)
    : playersWithMissingInfo;

  const unmatchedCount = filteredPlayers.filter(
    (player) => player.missingInVega
  ).length;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CSV File Comparator</h1>

      <div className="border border-gray-300 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="w-1/2 pr-2">
            <label className="block mb-2 font-medium">
              Source File (Tornelo):
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleFileChange(e, setSourceFile)}
              className="border p-2 w-full rounded"
            />
          </div>
          <div className="w-1/2 pl-2">
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
        </div>

        <div className="flex items-center">
          <button
            onClick={handleCompare}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center mr-4"
          >
            <FaUpload className="h-5 w-5 mr-2" /> Compare
          </button>
          <label className="flex items-center mr-4">
            <input
              type="checkbox"
              checked={filterMissing}
              onChange={(e) => setFilterMissing(e.target.checked)}
              className="mr-2"
            />
            Show only missing players
          </label>
          <label className="flex items-center mr-4">
            <input
              type="checkbox"
              checked={useFuzzyMatch}
              onChange={(e) => setUseFuzzyMatch(e.target.checked)}
              className="mr-2"
            />
            Enable Fuzzy Matching
          </label>
          {useFuzzyMatch && (
            <div className="flex items-center ml-4">
              <label className="mr-2">Fuzzy Match Threshold:</label>
              <input
                type="range"
                min="0"
                max="100"
                value={fuzzyMatchThreshold}
                onChange={(e) => setFuzzyMatchThreshold(Number(e.target.value))}
                className="mr-2"
              />
              <span>{fuzzyMatchThreshold}%</span>
            </div>
          )}
        </div>
      </div>

      {filteredPlayers.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Players Comparison:</h2>
          <p className="mb-2">Total unmatched players: {unmatchedCount}</p>
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
                  <td className="border border-gray-400 px-4 py-2 text-center">
                    {player.missingInVega ? (
                      <span role="img" aria-label="missing">
                        ❌
                      </span>
                    ) : (
                      <span role="img" aria-label="present">
                        ✅
                      </span>
                    )}
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
