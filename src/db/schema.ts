import { timestamp } from "drizzle-orm/mysql-core";
import { year } from "drizzle-orm/mysql-core";
import { primaryKey } from "drizzle-orm/mysql-core";
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
  idGoogleBooks: varchar("id_google_books", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  description: text("description"), // text é melhor que varchar(500)
  publishedYear: year("published_year").notNull(),
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
  (table) => ({
    pk: primaryKey({ columns: [table.bookId, table.authorId] }),
  })
);
