let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
chai.use(require('chai-things'));
chai.use(chaiHttp);
let _ = require('lodash' );


describe('Booklistdirs', function (){

    describe('POST /booklistdir', function () {
        it('should return confirmation message and update database', function(done) {
            let booklistdir = {
                username: 'RM1',
                email: '1884094745@qq/com',
                booklistname: 'Save Me' ,
                date:'',
                upvotes:0
            };
            chai.request(server)
                .post('/booklistdir')
                .send(booklistdir)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Booklistdir Successfully Added!' );
                    let booklistcomment = res.body.data;
                    expect(booklistcomment).to.include({ booklistname: 'Save Me', username: 'RM1'});
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/RM1/booklistdir')
                .end(function(err, res) {
                    let result = _.map(res.body, (booklistdir) => {
                        return { booklistname: booklistdir.booklistname,
                            username: booklistdir.username };
                    }  );
                    expect(result).to.include( { booklistname: 'Save Me', username: 'RM1'  } );
                    done();
                });
            //chai.request(server)
            //.delete('/expenditures/fuzzydelete/2018-12')
            //.end(function(err, res) {
            //done();
            //});
        });  // end-after
    });



    describe('PUT /booklistdir/:id/upvote', () => {
        describe ('when id is valid',function() {
            it('should return a confirmation message and update database', function (done) {
                chai.request(server)
                    .get('/RM1/booklistdir')
                    .end(function (err, res) {
                        const booklistdirId = res.body[0]._id;
                        chai.request(server)
                            .put('/booklistdir/' + booklistdirId + '/upvote')
                            .end(function (err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.have.property('message', 'Booklistdir Successfully Upvoted!');
                                done();
                            });
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/RM1/booklistdir')
                    .end(function(err, res) {
                        let result = _.map(res.body, (booklistdir) => {
                            return { upvotes: booklistdir.upvotes,
                                username: booklistdir.username};
                        }  );
                        expect(result).to.include( { upvotes: 1, username: 'RM1'  } );
                        done();
                    })
            });  // end-after
        });
        describe('when id is invalid',function() {
            it('should return a 404 and a message for invalid discussion id', function (done) {
                chai.request(server)
                    .put('/booklistdir/10001/upvote')
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message', 'Booklistdir NOT Found!');
                        done();
                    });
            });
        });
    });



    describe('PUT /booklistdir/:id/changeName', () => {
        describe ('when id is valid',function() {
            it('should return a confirmation message and update database', function (done) {
                let booklistdir = {

                    booklistname: 'Save Me pt.2'

                };
                chai.request(server)
                    .get('/RM1/booklistdir')
                    .end(function (err, res) {
                        const booklistdirId = res.body[0]._id;
                        chai.request(server)
                            .put('/booklistdir/' + booklistdirId + '/changeName')
                            .send(booklistdir)
                            .end(function (err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.have.property('Message', 'Booklistdir Successfully Changed!');
                                done();
                            });
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/RM1/booklistdir')
                    .end(function(err, res) {
                        let result = _.map(res.body, (booklistdir) => {
                            return { upvotes: booklistdir.upvotes,
                                booklistname: booklistdir.booklistname};
                        }  );
                        expect(result).to.include( { upvotes: 1, booklistname: 'Save Me pt.2'  } );
                        done();
                    })
            });  // end-after
        });
        describe('when id is invalid',function() {
            it('should return a 404 and a message for invalid discussion id', function (done) {
                chai.request(server)
                    .put('/booklistdir/10001/changeName')
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('Message', 'Sorry! Cannot find the booklistdir by this id!');
                        done();
                    });
            });
        });
    });




    describe('DELETE /booklistdir/:id', () => {
        describe ('when id is valid',function(){
            it('should return a confirmation message and update database ', function(done) {
                chai.request(server)
                    .get('/RM1/booklistdir')
                    .end(function(err, res) {
                        const booklistdirId = res.body[0]._id;
                        chai.request(server)
                            .delete('/booklistdir/' + booklistdirId)
                            .end(function(err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.have.property('message','Booklistdir Successfully Deleted!' ) ;
                                done();
                            });
                    });

            });
            after(function  (done) {
                chai.request(server)
                    .get('/RM1/booklistdir')
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
                    .delete('/booklistdir/1100001')
                    .end(function(err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('message','Booklistdir NOT DELETED!' ) ;
                        done();
                    });
            });

        });

    });



    describe('GET /:username/booklistdir',  () => {
        it('should return all the comments of this discussion in an array', function(done) {
            chai.request(server)
                .get('/Suga/booklistdir')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    let result = _.map(res.body, (booklistdir) => {
                        return { username: booklistdir.username,
                            upvotes: booklistdir.upvotes }
                    });
                    expect(result).to.include( { username: 'Suga', upvotes: 2 });
                    expect(result).to.include( { username: 'Suga', upvotes: 0 });
                    //expect(result).to.include( { username: 'RM', upvotes: 0 });
                    done();
                });

        });
    });




    describe('GET /booklilstdir/:id',  () => {
        it('should return related records in an array', function(done) {
            chai.request(server)
                .get('/booklilstdir/5c670fc58ae46b2eec56db1e')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (booklilstdir) => {
                        return { username: booklilstdir.username,
                            upvotes: booklilstdir.upvotes }
                    });
                    expect(result).to.include( { username: 'Suga', upvotes: 2 });
                    //expect(result).to.include( { username: 'Suga', upvotes: 1 });
                    //expect(result).to.include( { username: 'RM', upvotes: 0 });
                    done();
                });

        });
        it('should return a 404 and a message for invalid expenditure id', function(done) {
            chai.request(server)
                .get('/booklilstdir/10001')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message','Booklistdir NOT Found!' ) ;
                    done();
                });
        });
    });

});
