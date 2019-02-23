var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const discussions = require("./routes/discussions");
const discomments = require("./routes/discomments");
const booklistdir = require("./routes/booklistdir");
const booklistcomments = require("./routes/booklistcomments");
const booklists = require("./routes/booklists");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


//discussions api routes
app.get('/:bookname/discussions', discussions.findBookDiscussionAll);
app.get('/discussions/:id', discussions.findOne);
app.get('/fuzzysearch/:content/discussions', discussions.fuzzysearchDiscussion);
app.get('/:bookname/discussionsinorder', discussions.findBookDisindateorder);
app.get('/fuzzydateorder/:content', discussions.findQueryindateorder);
app.get('/fuzzyvoteorder/:content', discussions.findQueryinvotesorder);

app.post('/discussions',discussions.addDiscussion);

app.put('/discussions/:id/edit', discussions.changeDiscussion);
app.put('/discussions/:id/vote', discussions.incrementUpvotes);

app.delete('/discussions/:id', discussions.deleteDiscussion);


//discomments api routes
app.get('/:discussionid/discomments', discomments.findDiscommentAll);
app.get('/discomment/:id', discomments.findOne);
app.get('/:discussionid/discommentsinorder', discomments.findDiscommentsindateorder);

app.post('/discomments',discomments.addDiscomment);

app.put('/discomments/:id/upvote', discomments.incrementUpvotes);
app.put('/discomments/:id/downvote', discomments.incrementDownvotes);



//user's booklist dir
app.get('/:username/booklistdir', booklistdir.findUserbooklistdirAll);
app.get('/booklilstdir/:id', booklistdir.findOne);

app.post('/booklistdir',booklistdir.addBooklist);

app.put('/booklistdir/:id/upvote', booklistdir.incrementUpvotes);
app.put('/booklistdir/:id/changeName', booklistdir.changeBooklistName);

app.delete('/booklistdir/:id', booklistdir.deleteBooklist);



//booklist's comment
app.get('/:booklistid/comment', booklistcomments.findBooklistCommentAll);

app.post('/booklistcomments',booklistcomments.addComment);

app.put('/booklistcomment/:id/upvote', booklistcomments.incrementUpvotes);



//Users' booklist individual book
app.get('/:booklistid/books', booklists.findUserBooklistAll);

app.post('/booklist',booklists.addBook);

app.delete('/books/:id', booklists.deleteBook);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
