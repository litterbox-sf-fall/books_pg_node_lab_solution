"use strict"

var DB = require('./mydb_lib.js');

var db = new DB("library_example_app", 5432, "localhost");

function Book(title, author, id) {
  this.id = 0;
  this.title = title;
  this.author = author;
}

function Library() {
}

Library.prototype.add = function(title, author, buzzer) {
	var newBook = new Book(title, author);
	db.query("INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *", 
		[newBook.title, newBook.author], function(err, resultSet){
  		if (err) console.log("INSERT FAILED :-(", err);
  		// return the new book
  		console.log("add result:" + JSON.stringify(resultSet.rows[0]));
  		newBook = resultSet.rows[0].id;
  		if(buzzer !== undefined) buzzer(newBook);
	});
};

Library.prototype.destroy = function(id, buzzer) {
	db.query("DELETE FROM books WHERE id = $1;", [id], function(err, resultSet){
    if (err) console.log("DELETE FAILED on"+ id, err);
  	// console.log("By id result:" + JSON.stringify(resultSet.rows[0]));
    if(buzzer !== undefined) buzzer();
	});
};

Library.prototype.update = function(id, title, author, buzzer) {
	db.query("UPDATE books SET title = $1, author = $2 WHERE id = $3", [title,author,id], function(err, resultSet){
    if (err) console.log("DELETE FAILED on"+ id, err);
  	// console.log("By id result:" + JSON.stringify(resultSet.rows[0]));
    if(buzzer !== undefined) buzzer();
	});
};


Library.prototype.findById = function(id, buzzer) {
	var leBook = {}
	db.query("SELECT * FROM books WHERE id = $1;", [id], function(err, resultSet){
    if (err) console.log("SELECT FAILED on"+ id, err);
  	// console.log("By id result:" + JSON.stringify(resultSet.rows[0]));
  	var newBook = new Book(resultSet.rows[0].title, resultSet.rows[0].author);
  	newBook.id = id;
    if(buzzer !== undefined) buzzer(newBook);
	});
};

Library.prototype.all = function(buzzer) {
	var allBooks = [];
	db.query("SELECT * FROM books;", function(err, resultSet){
    if (err) console.log("SELECT FAILED :-(", err);
    resultSet.rows.forEach(function(row){
    	var newBook = new Book(row.title, row.author);
    	newBook.id = row.id;
    	allBooks.push(newBook);
    });
    // console.log("Buzzing:" + allBooks);
    if(buzzer !== undefined) buzzer(allBooks);
	});
};

module.exports = Library;
