create table users(
  id_user serial not null,
  UserName varchar(100) not null,
  FirstName varchar(100) not null,
  LastName varchar(100),
  Age date not null,
  primary key(id_user)
);