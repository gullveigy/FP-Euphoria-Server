let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
chai.use(require('chai-things'));
chai.use(chaiHttp);
let _ = require('lodash' );

describe('Booklistcomments', function (){
    describe('POST /booklistcomments', function () {
        it('should return confirmation message and update database', function(done) {
            let booklistcomment = {
                username: 'RM',
                booklistid: '5c67106f8ae46b2eec56db21',
                booklistname: 'Young Forever pt.2' ,
                comment: 'This is a great option which I will look afterwards.',
                date:'',
                upvotes:0
            };
            chai.request(server)
                .post('/booklistcomments')
                .send(booklistcomment)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Booklistcomment Successfully Added!' );
                    let booklistcomment = res.body.data;
                    expect(booklistcomment).to.include({booklistname: 'Young Forever pt.2', comment: 'This is a great option which I will look afterwards.'});
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/5c67106f8ae46b2eec56db21/comment')
                .end(function(err, res) {
                    let result = _.map(res.body, (booklistcomment) => {
                        return { booklistname: booklistcomment.booklistname,
                            comment: booklistcomment.comment };
                    }  );
                    expect(result).to.include( { booklistname: 'Young Forever pt.2', comment: 'This is a great option which I will look afterwards.'  } );
                    done();
                });
            //chai.request(server)
            //.delete('/expenditures/fuzzydelete/2018-12')
            //.end(function(err, res) {
            //done();
            //});
        });  // end-after
    });




    describe('PUT /booklistcomment/:id/upvote', () => {
        describe ('when id is valid',function() {
            it('should return a confirmation message and update database', function (done) {
                chai.request(server)
                    .get('/5c67106f8ae46b2eec56db21/comment')
                    .end(function (err, res) {
                        const commentId = res.body[0]._id;
                        chai.request(server)
                            .put('/booklistcomment/' + commentId + '/upvote')
                            .end(function (err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.have.property('message', 'Booklistcomment Successfully Upvoted!');
                                done();
                            });
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/5c67106f8ae46b2eec56db21/comment')
                    .end(function(err, res) {
                        let result = _.map(res.body, (booklistcomment) => {
                            return { upvotes: booklistcomment.upvotes,
                                comment: booklistcomment.comment };
                        }  );
                        expect(result).to.include( { upvotes: 1, comment: 'This is a great option which I will look afterwards.'  } );
                        done();
                    })
            });  // end-after
        });
        describe('when id is invalid',function() {
            it('should return a 404 and a message for invalid booklist id', function (done) {
                chai.request(server)
                    .put('/booklistcomment/100001/upvote')
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message', 'Booklistcomment NOT Found!');
                        done();
                    });
            });
        });
    });



    describe('DELETE /expenditures/:id', () => {
        describe ('when id is valid',function(){
            it('should return a confirmation message and update database ', function(done) {
                chai.request(server)
                    .get('/5c67106f8ae46b2eec56db21/comment')
                    .end(function(err, res) {
                        const commentId = res.body[0]._id;
                        chai.request(server)
                            .delete('/booklistcomment/' + commentId)
                            .end(function(err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.have.property('message','Booklistcomment Successfully Deleted!' ) ;
                                done();
                            });
                    });

            });
            after(function  (done) {
                chai.request(server)
                    .get('/5c67106f8ae46b2eec56db21/comment')
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
                    .delete('/booklistcomment/1100001')
                    .end(function(err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('message','Booklistcomment NOT DELETED!' ) ;
                        done();
                    });
            });

        });

    });


    describe('GET /:booklistid/comment',  () => {
        it('should return all the comments of this booklist in an array', function(done) {
            chai.request(server)
                .get('/5c6710228ae46b2eec56db1f/comment')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (booklistcomment) => {
                        return { booklistname: booklistcomment.booklistname,
                            comment: booklistcomment.comment }
                    });
                    expect(result).to.include( { booklistname: 'loveyourself answer', comment: 'At first sight, I could recognize you As if we were calling for each other The DNA in my blood vessels tell me That it\u2019s you I was looking all over for.'  });
                    done();
                });

        });
    });


});





