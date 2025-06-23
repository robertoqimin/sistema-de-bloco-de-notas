create database if not exists dbnotas;

use dbnotas;

create table if not exists users(
	id int primary key unique auto_increment not null,
    username varchar(100) not null,
    email varchar(100) not null unique,
    password varchar(100) not null
);

create table if not exists notes(
	id int primary key auto_increment not null,
    title varchar(100) not null,
    info varchar(100) not null,
    content varchar (10000),
    username_id int not null,
	foreign key (username_id) references users(id)
);
