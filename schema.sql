CREATE TABLE user (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL
);
CREATE TABLE user_key (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    hashed_password TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id)
);
CREATE TABLE user_session (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    active_expires INTEGER NOT NULL,
    idle_expires INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);