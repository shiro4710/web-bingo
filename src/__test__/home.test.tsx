import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Home from "../pages/index";

describe("Rendering", () => {
  it("Home", () => {
    render(<Home />);
    expect(screen.getByText("Hello, next.js!")).toBeInTheDocument();
  });
});
