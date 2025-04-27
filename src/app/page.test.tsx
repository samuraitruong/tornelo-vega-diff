import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./page";

describe("Home Component", () => {
  it("renders the component correctly", () => {
    render(<Home />);
    expect(screen.getByText("CSV File Comparator")).toBeInTheDocument();
    expect(screen.getByText("Source File (Tornelo):")).toBeInTheDocument();
    expect(screen.getByText("Destination File (Vega):")).toBeInTheDocument();
  });

  it("shows an alert if files are not selected when comparing", () => {
    render(<Home />);
    const compareButton = screen.getByText(/compare/i);
    window.alert = jest.fn();

    fireEvent.click(compareButton);

    expect(window.alert).toHaveBeenCalledWith(
      "Please select both source and destination files."
    );
  });

  it("toggles fuzzy matching option", () => {
    render(<Home />);
    const fuzzyCheckbox = screen.getByLabelText(/enable fuzzy matching/i);

    expect(fuzzyCheckbox).toHaveProperty('checked', false);

    fireEvent.click(fuzzyCheckbox);

    expect(fuzzyCheckbox).toHaveProperty('checked', true);
  });

  it("filters missing players when checkbox is toggled", () => {
    render(<Home />);
    const filterCheckbox = screen.getByLabelText(/show only missing players/i);

    expect(filterCheckbox).toHaveProperty('checked', false);

    fireEvent.click(filterCheckbox);

    expect(filterCheckbox).toHaveProperty('checked', true);
  });
});
