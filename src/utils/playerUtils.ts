import { findClosestMatch } from "../csvReader";

export function checkMissingPlayers(
  torneloPlayers,
  vegaPlayers,
  useFuzzyMatch = false,
  fuzzyMatchThreshold = 80
) {
  return torneloPlayers.map((torneloPlayer) => {
    const [lastName, firstName] = torneloPlayer.player
      .split(",")
      .map((name) => name.trim().toLowerCase());

    const exactMatch = vegaPlayers.find((vegaPlayer) => {
      const [vegaFirstName, vegaLastName] = vegaPlayer.name
        .split(",")
        .map((name) => name.trim().toLowerCase());

      const nameMatch =
        (vegaFirstName === firstName && vegaLastName === lastName) ||
        (vegaFirstName === lastName && vegaLastName === firstName);

      return nameMatch;
    });

    const fuzzyMatch =
      useFuzzyMatch && !exactMatch
        ? findClosestMatch(
            torneloPlayer.player,
            vegaPlayers,
            fuzzyMatchThreshold
          )
        : null;

    return {
      ...torneloPlayer,
      vegaPlayer: exactMatch || fuzzyMatch,
    };
  });
}
