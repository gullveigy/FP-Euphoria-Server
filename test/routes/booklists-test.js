let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
chai.use(require('chai-things'));
chai.use(chaiHttp);
let _ = require('lodash' );

describe('Booklists', function (){

    describe('POST /booklist', function () {
        it('should return confirmation message and update database', function(done) {
            let booklist = {
                username: 'RM1',
                booklistid: '5c6710638ae46b2eec56db20',
                bookname: 'Baespae' ,
                author: 'PGDogg',
                date:''
            };
            chai.request(server)
                .post('/booklist')
                .send(booklist)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Booklist Successfully Added!' );
                    let booklist = res.body.data;
                    expect(booklist).to.include({bookname: 'Baespae', author: 'PGDogg'});
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/5c6710638ae46b2eec56db20/books')
                .end(function(err, res) {
                    let result = _.map(res.body, (booklist) => {
                        return { bookname: booklist.bookname,
                            author: booklist.author };
                    }  );
                    expect(result).to.include( { bookname: 'Baespae', author: 'PGDogg'  } );
                    done();
                });
        });  // end-after
    });


    describe('DELETE /books/:id', () => {
        describe ('when id is valid',function(){
            it('should return a confirmation message and update database ', function(done) {
                chai.request(server)
                    .get('/5c6710638ae46b2eec56db20/books')
                    .end(function(err, res) {
                        const bookId = res.body[0]._id;
                        chai.request(server)
                            .delete('/books/' + bookId)
                            .end(function(err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.have.property('message','Book Successfully Deleted!' ) ;
                                done();
                            });
                    });

            });
            after(function  (done) {
                chai.request(server)
                    .get('/5c6710638ae46b2eec56db20/books')
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body.length).to.equal(0);
                        done();
                    });
            });  // end after
        });
        describe('when id is invalid',function(){
            it('should return a 404 and a message for invalid expenditure id', function(done) {
                chai.request(server)
                    .delete('/books/10001')
                    .end(function(err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('message','Book NOT DELETED!' ) ;
                        done();
                    });
            });

        });

    });


    describe('GET /:booklistid/books',  () => {
        it('should return all the books of this booklist in an array', function(done) {
            chai.request(server)
                .get('/5c6710228ae46b2eec56db1f/books')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    let result = _.map(res.body, (booklist) => {
                        return { bookname: booklist.bookname,
                            author: booklist.author }
                    });
                    expect(result).to.include( { bookname: 'Just Dance', author: 'JHope'  });
                    expect(result).to.include( { bookname: 'Fake Love', author: 'BTS'  });
                    done();
                });

        });
    });

});
