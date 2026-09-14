import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getLibrarySnapshot, replaceLibrarySnapshot } from "./db";
import { reconcileBookAvailability } from "../shared/library-logic";

const bookInput = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  cover: z.string(),
  category: z.string(),
  rating: z.number(),
  reviewsCount: z.number().int(),
  status: z.enum(["disponivel", "reservado", "em_andamento"]),
  pages: z.number().int(),
  year: z.number().int(),
  publisher: z.string(),
  location: z.string(),
  synopsis: z.string(),
  isbn: z.string(),
  totalCopies: z.number().int(),
  availableCopies: z.number().int(),
  featured: z.boolean().optional(),
});

const loanInput = z.object({
  id: z.string(),
  studentName: z.string(),
  studentEmail: z.string(),
  studentAvatar: z.string().optional(),
  studentClass: z.string(),
  studentCode: z.string().optional(),
  bookId: z.string(),
  bookTitle: z.string(),
  bookAuthor: z.string(),
  bookCover: z.string(),
  loanDate: z.string(),
  returnDate: z.string(),
  actualReturnDate: z.string().optional(),
  status: z.enum(["devolvido", "em_andamento", "atrasado"]),
  notes: z.string().optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  library: router({
    snapshot: publicProcedure.query(() => getLibrarySnapshot()),
    sync: publicProcedure
      .input(z.object({ books: z.array(bookInput), loans: z.array(loanInput) }))
      .mutation(async ({ input }) => {
        const normalizedBooks = reconcileBookAvailability(input.books, input.loans);
        await replaceLibrarySnapshot(
          normalizedBooks.map((book) => ({ ...book, featured: book.featured ?? false })),
          input.loans,
        );
        return { success: true, books: input.books.length, loans: input.loans.length } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
