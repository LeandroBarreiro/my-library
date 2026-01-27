import { mysqlEnum, timestamp } from "drizzle-orm/mysql-core";
import { year } from "drizzle-orm/mysql-core";
import { primaryKey } from "drizzle-orm/mysql-core";
import { date } from "drizzle-orm/mysql-core";
import { text } from "drizzle-orm/mysql-core";
import { varchar } from "drizzle-orm/mysql-core";
import { mysqlTable } from "drizzle-orm/mysql-core";
import { uuidv7 } from "uuidv7";

export const userTable = mysqlTable("users", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 100 }).unique().notNull(),
  passwordHash: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const booksTable = mysqlTable("books", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  idGoogleBooks: varchar("id_google_books", { length: 50 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  description: text("description"), // text é melhor que varchar(500)
  publishedYear: year("published_year").notNull(),
  pageCount: varchar('')
  thumbnailUrl: varchar("thumbnail_url", { length: 255 }),
});

export const authorsTable = mysqlTable("authors", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar("name", { length: 255 }).notNull(),
});

export const bookAuthorsTable = mysqlTable(
  "book_authors",
  {
    bookId: varchar("book_id", { length: 50 })
      .notNull()
      .references(() => booksTable.id, { onDelete: "cascade" }),
    authorId: varchar("author_id", { length: 50 })
      .notNull()
      .references(() => authorsTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      name: "pk_book_authors",
      columns: [table.bookId, table.authorId],
    }),
  ]
);

export const userBooks = mysqlTable(
  "user_books",
  {
    bookId: varchar("book_id", { length: 50 })
      .notNull()
      .references(() => booksTable.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 50 })
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    bookStatus: mysqlEnum([
      "READ",
      "UNREAD",
      "READING",
      "WANT_TO_READ",
      "ABANDONED",
    ])
      .notNull()
      .default("UNREAD"),
    review: text("review"),
  },
  (table) => [
    primaryKey({
      name: "pk_user_books",
      columns: [table.userId, table.bookId],
    }),
  ]
);

export const loanBooks = mysqlTable("loan_books", {
  bookId: varchar("book_id", { length: 50 })
    .notNull()
    .references(() => booksTable.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 50 })
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  borrowerName: varchar("borrower_name", { length: 50 }).notNull(),
  loanStart: date("loan_started_at", { mode: "string" }).notNull(),
  loanEnd: date("loan_ended_at", { mode: "string" }).notNull(),
  returnBook: date("returned_at", { mode: "string" }).notNull(),
});

export const notesTable = mysqlTable("");

// ================ FUTURA LISTA DE DESEJOS ================

// export const wishList = mysqlTable("wish_list", {
//   bookId: varchar("book_id", { length: 50 })
//     .notNull()
//     .references(() => booksTable.id, { onDelete: "cascade" }),
//   idGoogleBooks: varchar("id_google_books", { length: 50 }).notNull(),
// });
