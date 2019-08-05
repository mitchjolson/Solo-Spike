CREATE TYPE "orders_status" AS ENUM
(
  'created',
  'running',
  'done',
  'failure'
);

CREATE TABLE "games"
(
    "id" serial PRIMARY KEY,
    "bgg_id" int UNIQUE NOT NULL,
    "name" varchar(100),
    "description" varchar(10000),
    "publisher" varchar(50),
    "year_published" int,
    "min_players" int,
    "max_players" int,
    "playing_time" int,
    "rating" int
);

CREATE TABLE "users"
(
    "id" serial PRIMARY KEY,
    "username" varchar UNIQUE,
    "password" varchar
);

CREATE TABLE "events"
(
    "id" serial PRIMARY KEY,
    "creator_id" int,
    "title" varchar UNIQUE,
    "date" varchar
);

CREATE TABLE "users_games"
(
    "id" serial PRIMARY KEY,
    "user_id" int,
    "game_id" int
);

CREATE TABLE "events_games"
(
    "id" serial PRIMARY KEY,
    "event_id" int,
    "game_id" int,
    "user_id" int
);

CREATE TABLE "events_users"
(
    "id" serial PRIMARY KEY,
    "event_id" int,
    "user_id" int
);

CREATE TABLE "friends"
(
    "id" serial PRIMARY KEY,
    "user1" int,
    "user2" int,
    "status" varchar
);

ALTER TABLE "events" ADD FOREIGN KEY ("creator_id") REFERENCES "users" ("id");

ALTER TABLE "users_games" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "users_games" ADD FOREIGN KEY ("game_id") REFERENCES "games" ("id");

ALTER TABLE "events_games" ADD FOREIGN KEY ("event_id") REFERENCES "events" ("id");

ALTER TABLE "events_games" ADD FOREIGN KEY ("game_id") REFERENCES "games" ("id");

ALTER TABLE "events_games" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "events_users" ADD FOREIGN KEY ("event_id") REFERENCES "events" ("id");

ALTER TABLE "events_users" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "friends" ADD FOREIGN KEY ("user1") REFERENCES "users" ("id");

ALTER TABLE "friends" ADD FOREIGN KEY ("user2") REFERENCES "users" ("id");


CREATE TABLE "game_log"
(
    "id" serial primary key,
    "user_id" int references users,
    "game_id" int references games,
    "action" varchar,
    "entry_date" text not null
);

-- Trigger to log when a user adds a game
create trigger logaddgametrigger after
insert on
users_games
for
each
row
execute procedure logaddgamefunction
();

create or replace function logaddgamefunction
() returns trigger as $add_game_table$
begin
    insert into game_log
        (user_id, game_id, entry_date, action)
    VALUES
        (new.user_id, new.game_id, current_timestamp, 'add');
    return new;
end;
$add_game_table$ LANGUAGE plpgsql;

insert into users
    (username, password)
values
    ('sam', 'sam');
insert into games
    (bgg_id, name, description, publisher, year_published, min_players, max_players, playing_time, rating)
values
    (5678, 'deception', 'catch that murderer', 'no idea', 2018, 4, 10, 60, 8.0);

insert into users_games
    (user_id, game_id)
values
    (1, 1);
delete from users_games where id=1;

-- Trigger to log when a user removes a game
create trigger logremovegametrigger after
delete on users_games
for each
row
execute procedure logremovegamefunction
();

create or replace function logremovegamefunction
() returns trigger as $remove_game_table$
begin
    insert into game_log
        (user_id, game_id, entry_date, action)
    VALUES
        (old.user_id, old.game_id, current_timestamp, 'delete');
    return new;
end;
$remove_game_table$ LANGUAGE plpgsql;

select *
from pg_trigger;

delete from pg_trigger where tgname = 'logremovegametrigger';



