import { checkMissingPlayers } from "./playerUtils";

describe("checkMissingPlayers", () => {
  it("should mark players as missing if they are not in Vega players list", () => {
    const torneloPlayers = [
      { player: "Doe, John", rating: 1500, gender: "M", yob: 1990 },
      { player: "Smith, Jane", rating: 1600, gender: "F", yob: 1992 },
    ];

    const vegaPlayers = [{ name: "John,Doe" }];

    const result = checkMissingPlayers(torneloPlayers, vegaPlayers);

    expect(result).toEqual([
      {
        player: "Doe, John",
        rating: 1500,
        gender: "M",
        yob: 1990,
        missingInVega: false,
      },
      {
        player: "Smith, Jane",
        rating: 1600,
        gender: "F",
        yob: 1992,
        missingInVega: true,
      },
    ]);
  });

  it("should handle empty Tornelo players list", () => {
    const torneloPlayers = [];
    const vegaPlayers = [{ name: "John;Doe" }];

    const result = checkMissingPlayers(torneloPlayers, vegaPlayers);

    expect(result).toEqual([]);
  });

  it("should handle empty Vega players list", () => {
    const torneloPlayers = [
      { player: "Doe, John", rating: 1500, gender: "M", yob: 1990 },
    ];
    const vegaPlayers = [];

    const result = checkMissingPlayers(torneloPlayers, vegaPlayers);

    expect(result).toEqual([
      {
        player: "Doe, John",
        rating: 1500,
        gender: "M",
        yob: 1990,
        missingInVega: true,
      },
    ]);
  });
});
