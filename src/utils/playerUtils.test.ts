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
        vegaPlayer: { name: "John,Doe" },
      },
      {
        player: "Smith, Jane",
        rating: 1600,
        gender: "F",
        yob: 1992,
        vegaPlayer: null,
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
        vegaPlayer: null,
      },
    ]);
  });

  it("should compare names case-insensitively", () => {
    const torneloPlayers = [
      { player: "Doe, John", rating: 1500, gender: "M", yob: 1990 },
      { player: "Smith, Jane", rating: 1600, gender: "F", yob: 1992 },
    ];

    const vegaPlayers = [{ name: "john,doe" }, { name: "JANE,SMITH" }];

    const result = checkMissingPlayers(torneloPlayers, vegaPlayers);

    expect(result).toEqual([
      {
        player: "Doe, John",
        rating: 1500,
        gender: "M",
        yob: 1990,
        vegaPlayer: { name: "john,doe" },
      },
      {
        player: "Smith, Jane",
        rating: 1600,
        gender: "F",
        yob: 1992,
        vegaPlayer: { name: "JANE,SMITH" },
      },
    ]);
  });
});
