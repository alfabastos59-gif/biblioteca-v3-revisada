export type AvailabilityBook = {
  id: string;
  totalCopies: number;
  availableCopies: number;
  status: string;
};

export type AvailabilityLoan = {
  bookId: string;
  status: string;
};

export function reconcileBookAvailability<T extends AvailabilityBook>(
  books: T[],
  loans: AvailabilityLoan[],
): T[] {
  const activeByBook = new Map<string, number>();
  loans.forEach((loan) => {
    if (loan.status !== "devolvido") {
      activeByBook.set(loan.bookId, (activeByBook.get(loan.bookId) || 0) + 1);
    }
  });

  return books.map((book) => {
    const availableCopies = Math.max(0, book.totalCopies - (activeByBook.get(book.id) || 0));
    const status = availableCopies > 0 ? "disponivel" : "reservado";
    if (book.availableCopies === availableCopies && book.status === status) return book;
    return { ...book, availableCopies, status } as T;
  });
}
