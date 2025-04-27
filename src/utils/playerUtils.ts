export function checkMissingPlayers(torneloPlayers, vegaPlayers) {
  return torneloPlayers.map((torneloPlayer) => {
    const [lastName, firstName] = torneloPlayer.player
      .split(",")
      .map((name) => name.trim());

    const isInVega = vegaPlayers.some((vegaPlayer) => {
      const [vegaFirstName, vegaLastName] = vegaPlayer.name
        .split(",")
        .map((name) => name.trim());

      const nameMatch =
        (vegaFirstName === firstName && vegaLastName === lastName) ||
        (vegaFirstName === lastName && vegaLastName === firstName);
      console.log(torneloPlayer, vegaPlayer);
      //   const yearOfBirthMatch =
      //     torneloPlayer.yob &&
      //     vegaPlayer.yob &&
      //     torneloPlayer.yob === vegaPlayer.yob;
      if (
        torneloPlayer.player.includes("Nguyen") &&
        vegaPlayer.name.includes("Nguyen")
      ) {
        console.log(
          `Comparing Tornelo: ${firstName} ${lastName} with Vega: ${vegaFirstName} ${vegaLastName} result: ${nameMatch}`
        );
      }
      return nameMatch;
    });

    return {
      ...torneloPlayer,
      missingInVega: !isInVega,
    };
  });
}
