import { boolean, double, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const libraryBooks = mysqlTable("library_books", {
  id: varchar("id", { length: 128 }).primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  cover: text("cover").notNull(),
  category: varchar("category", { length: 160 }).notNull(),
  rating: double("rating").notNull().default(0),
  reviewsCount: int("reviewsCount").notNull().default(0),
  status: mysqlEnum("status", ["disponivel", "reservado", "em_andamento"]).notNull().default("disponivel"),
  pages: int("pages").notNull().default(0),
  year: int("year").notNull().default(0),
  publisher: varchar("publisher", { length: 255 }).notNull().default("Biblioteca Maria Quitéria"),
  location: varchar("location", { length: 255 }).notNull().default("Acervo geral"),
  synopsis: text("synopsis").notNull(),
  isbn: varchar("isbn", { length: 64 }).notNull().default(""),
  totalCopies: int("totalCopies").notNull().default(1),
  availableCopies: int("availableCopies").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const libraryLoans = mysqlTable("library_loans", {
  id: varchar("id", { length: 128 }).primaryKey(),
  studentName: text("studentName").notNull(),
  studentEmail: varchar("studentEmail", { length: 320 }).notNull(),
  studentAvatar: text("studentAvatar"),
  studentClass: varchar("studentClass", { length: 120 }).notNull(),
  studentCode: varchar("studentCode", { length: 120 }),
  bookId: varchar("bookId", { length: 128 }).notNull(),
  bookTitle: text("bookTitle").notNull(),
  bookAuthor: text("bookAuthor").notNull(),
  bookCover: text("bookCover").notNull(),
  loanDate: varchar("loanDate", { length: 32 }).notNull(),
  returnDate: varchar("returnDate", { length: 32 }).notNull(),
  actualReturnDate: varchar("actualReturnDate", { length: 32 }),
  status: mysqlEnum("status", ["devolvido", "em_andamento", "atrasado"]).notNull().default("em_andamento"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type LibraryBook = typeof libraryBooks.$inferSelect;
export type LibraryLoan = typeof libraryLoans.$inferSelect;
export type InsertLibraryBook = typeof libraryBooks.$inferInsert;
export type InsertLibraryLoan = typeof libraryLoans.$inferInsert;
