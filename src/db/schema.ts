import { mysqlEnum, timestamp } from "drizzle-orm/mysql-core";
import { year } from "drizzle-orm/mysql-core";
import { primaryKey } from "drizzle-orm/mysql-core";
import { uniqueIndex } from "drizzle-orm/mysql-core";
import { boolean } from "drizzle-orm/mysql-core";
import { index } from "drizzle-orm/mysql-core";
import { date } from "drizzle-orm/mysql-core";
import { text } from "drizzle-orm/mysql-core";
import { varchar } from "drizzle-orm/mysql-core";
import { mysqlTable } from "drizzle-orm/mysql-core";
import { uuidv7 } from "uuidv7";

export const userTable = mysqlTable("users", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv7()).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const booksTable = mysqlTable("books", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv7()).notNull(),
  idGoogleBooks: varchar("id_google_books", { length: 50 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  description: text("description"), // text é melhor que varchar(500)
  publishedYear: year("published_year"),
  thumbnailUrl: varchar("thumbnail_url", { length: 255 }),
});

export const authorsTable = mysqlTable("authors", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv7()).notNull(),
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
    id: varchar("id", { length: 50 })
      .primaryKey()
      .$defaultFn(() => uuidv7())
      .notNull(),

    bookId: varchar("book_id", { length: 50 })
      .notNull()
      .references(() => booksTable.id, { onDelete: "cascade" }),

    userId: varchar("user_id", { length: 50 })
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),

    bookStatus: mysqlEnum("book_status", ["READ", "UNREAD", "READING", "ABANDONED"])
      .notNull()
      .default("UNREAD"),

    review: text("review"),

    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date().toISOString()),
  },
  (t) => [
    // garante 1 registro por (user, book)
    uniqueIndex("uq_user_books_user_book").on(t.userId, t.bookId),
  ]
);

export const borrowers = mysqlTable("borrowers", {
  id: varchar("id", {length: 50}).primaryKey().$defaultFn(() => uuidv7()).notNull(),
  name: varchar("name", {length: 255}).notNull(),
  phone: varchar("phone", {length: 20}).notNull(),
  userId: varchar("user_id", { length: 50 })
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
}, (table) => [
  uniqueIndex("uq_borrower_user_phone").on(table.userId, table.phone),
  index("idx_borrower_user").on(table.userId)
])

export const loanBooks = mysqlTable(
  "loan_books",
  {
    id: varchar("id", { length: 50 })
      .primaryKey()
      .$defaultFn(() => uuidv7())
      .notNull(),
    userBookId: varchar("user_book_id", { length: 50 })
      .notNull()
      .references(() => userBooks.id, { onDelete: "cascade" }),
      userId: varchar("user_id", { length: 50 })
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    borrowerId: varchar("borrower_id", { length: 50 })
      .notNull()
      .references(() => borrowers.id, { onDelete: "cascade" }),
    loanStart: date("loan_started_at", { mode: "string" }).notNull(),
    dueAt: date("due_at", { mode: "string" }).notNull(),
    returnedAt: date("returned_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date().toISOString()),
    isActive: boolean("is_active").default(true).notNull()  
  },
  (t) => [
   uniqueIndex("uq_loan_active_user_book").on(t.userBookId, t.isActive),

    index("idx_loan_user_active").on(t.userId, t.isActive),
    index("idx_loan_borrower_active").on(t.borrowerId, t.isActive),

    index("idx_loan_userbook").on(t.userBookId),
  ]
);





// export const notesTable = mysqlTable("");

// ================ FUTURA LISTA DE DESEJOS ================

// export const wishList = mysqlTable("wish_list", {
//   bookId: varchar("book_id", { length: 50 })
//     .notNull()
//     .references(() => booksTable.id, { onDelete: "cascade" }),
//   idGoogleBooks: varchar("id_google_books", { length: 50 }).notNull(),
// });
