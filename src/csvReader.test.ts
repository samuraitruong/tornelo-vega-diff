import { parseTorneloCSV, parseVegaCSV } from "./csvReader";

describe("CSV Parsing Functions", () => {
  it("should correctly parse Tornelo CSV content", () => {
    const csvContent = `#,Flag,Player,Rating,Gender,YOB,U,Skip,Bye\n1,"USA","Kirk, Ian",2000,"M",1990,1,false,false`;
    const result = parseTorneloCSV(csvContent);

    expect(result).toEqual([
      {
        flag: "USA",
        player: "Kirk, Ian",
        rating: 2000,
        gender: "M",
        yob: 1990,
        u: 1,
        skip: false,
        bye: false,
      },
    ]);
  });

  it("should correctly parse Vega CSV content", () => {
    const csvContent = `ID;Name;Rating;Country;Gender;BirthYear\n1;"Ian,Kirk";2000;USA;M;1990`;
    const result = parseVegaCSV(csvContent);

    expect(result).toEqual([
      {
        id: "1",
        name: "Ian,Kirk",
        rating: 2000,
        country: "USA",
        gender: "M",
        birthYear: 1990,
      },
    ]);
  });
});
