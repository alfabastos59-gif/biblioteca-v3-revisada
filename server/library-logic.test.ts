import { describe, expect, it } from "vitest";
import { reconcileBookAvailability } from "../shared/library-logic";

describe("reconcileBookAvailability", () => {
  it("counts only active loans and marks a fully borrowed book as reserved", () => {
    const result = reconcileBookAvailability(
      [
        { id: "book-1", totalCopies: 2, availableCopies: 2, status: "disponivel" },
        { id: "book-2", totalCopies: 1, availableCopies: 0, status: "reservado" },
      ],
      [
        { bookId: "book-1", status: "em_andamento" },
        { bookId: "book-1", status: "atrasado" },
        { bookId: "book-2", status: "devolvido" },
      ],
    );

    expect(result).toEqual([
      { id: "book-1", totalCopies: 2, availableCopies: 0, status: "reservado" },
      { id: "book-2", totalCopies: 1, availableCopies: 1, status: "disponivel" },
    ]);
  });

  it("never produces negative availability", () => {
    const [book] = reconcileBookAvailability(
      [{ id: "book-1", totalCopies: 1, availableCopies: 1, status: "disponivel" }],
      [
        { bookId: "book-1", status: "em_andamento" },
        { bookId: "book-1", status: "em_andamento" },
      ],
    );
    expect(book).toMatchObject({ availableCopies: 0, status: "reservado" });
  });
});
