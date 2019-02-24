let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
chai.use(require('chai-things'));
chai.use(chaiHttp);
let _ = require('lodash' );

describe('Discomments', function (){

    describe('POST /discomments', function () {
        it('should return confirmation message and update database', function(done) {
            let discomment = {
                username: 'RM',
                discussionid: '5c609da3b8ed502f5c6a311c',
                content: 'Test for it',
                date:'',
                upvotes:0,
                downvotes:0
            };
            chai.request(server)
                .post('/discomments')
                .send(discomment)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Discomment Successfully Added!' );
                    let discomment = res.body.data;
                    expect(discomment).to.include({username: 'RM', content: 'Test for it'});
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/5c609da3b8ed502f5c6a311c/discomments')
                .end(function(err, res) {
                    let result = _.map(res.body, (discomment) => {
                        return { username: discomment.username,
                            content: discomment.content };
                    }  );
                    expect(result).to.include( { username: 'RM', content: 'Test for it'  } );
                    done();
                });

        });  // end-after
    });


    describe('PUT /discomments/:id/upvote', () => {
        describe ('when id is valid',function() {
            it('should return a confirmation message and update database', function (done) {
                chai.request(server)
                    .get('/5c609da3b8ed502f5c6a311c/discomments')
                    .end(function (err, res) {
                        const discommentId = res.body[0]._id;
                        chai.request(server)
                            .put('/discomments/' + discommentId + '/upvote')
                            .end(function (err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.have.property('message', 'Discomment Successfully Upvoted!');
                                done();
                            });
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/5c609da3b8ed502f5c6a311c/discomments')
                    .end(function(err, res) {
                        let result = _.map(res.body, (discomment) => {
                            return { upvotes: discomment.upvotes,
                                content: discomment.content};
                        }  );
                        expect(result).to.include( { upvotes: 1, content: 'Test for it'  } );
                        done();
                    })
            });  // end-after
        });
        describe('when id is invalid',function() {
            it('should return a 404 and a message for invalid discussion id', function (done) {
                chai.request(server)
                    .put('/discomments/10001/upvote')
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message', 'Discomment NOT Found!');
                        done();
                    });
            });
        });
    });



    describe('PUT /discomments/:id/downvote', () => {
        describe ('when id is valid',function() {
            it('should return a confirmation message and update database', function (done) {
                chai.request(server)
                    .get('/5c609da3b8ed502f5c6a311c/discomments')
                    .end(function (err, res) {
                        const discommentId = res.body[0]._id;
                        chai.request(server)
                            .put('/discomments/' + discommentId + '/downvote')
                            .end(function (err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.have.property('message', 'Discomment Successfully Downvoted!');
                                done();
                            });
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/5c609da3b8ed502f5c6a311c/discomments')
                    .end(function(err, res) {
                        let result = _.map(res.body, (discomment) => {
                            return { downvotes: discomment.downvotes,
                                content: discomment.content};
                        }  );
                        expect(result).to.include( { downvotes: 1, content: 'Test for it'  } );
                        done();
                    })
            });  // end-after
        });
        describe('when id is invalid',function() {
            it('should return a 404 and a message for invalid discussion id', function (done) {
                chai.request(server)
                    .put('/discomments/10001/downvote')
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message', 'Discomment NOT Found!');
                        done();
                    });
            });
        });
    });



    describe('DELETE /discomments/:id', () => {
        describe ('when id is valid',function(){
            it('should return a confirmation message and update database ', function(done) {
                chai.request(server)
                    .get('/5c609da3b8ed502f5c6a311c/discomments')
                    .end(function(err, res) {
                        const discommentId = res.body[0]._id;
                        chai.request(server)
                            .delete('/discomments/' + discommentId)
                            .end(function(err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.have.property('message','Discomment Successfully Deleted!' ) ;
                                done();
                            });
                    });

            });
            after(function  (done) {
                chai.request(server)
                    .get('/5c609da3b8ed502f5c6a311c/discomments')
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
                    .delete('/discomments/1100001')
                    .end(function(err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('message','Discomment NOT DELETED!' ) ;
                        done();
                    });
            });

        });

    });


    describe('GET /:discussionid/discomments',  () => {
        it('should return all the comments of this discussion in an array', function(done) {
            chai.request(server)
                .get('/5c609e20b8ed502f5c6a311d/discomments')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(3);
                    let result = _.map(res.body, (discomment) => {
                        return { username: discomment.username,
                            upvotes: discomment.upvotes }
                    });
                    expect(result).to.include( { username: 'V', upvotes: 3 });
                    expect(result).to.include( { username: 'Suga', upvotes: 1 });
                    expect(result).to.include( { username: 'RM', upvotes: 0 });
                    done();
                });

        });
    });



    describe('GET /discomment/:id',  () => {
        it('should return all the comments of this discussion in an array', function(done) {
            chai.request(server)
                .get('/discomment/5c61c001ed7b692d2c1f39c0')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (discomment) => {
                        return { username: discomment.username,
                            upvotes: discomment.upvotes }
                    });
                    expect(result).to.include( { username: 'Jin', upvotes: 2 });
                    //expect(result).to.include( { username: 'Suga', upvotes: 1 });
                    //expect(result).to.include( { username: 'RM', upvotes: 0 });
                    done();
                });

        });
        it('should return a 404 and a message for invalid expenditure id', function(done) {
            chai.request(server)
                .get('/discomment/10001')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message','Discomment NOT Found!' ) ;
                    done();
                });
        });
    });




    describe('GET /:discussionid/discommentsinorder',  () => {
        it('should return all the comments of this discussion in date order in an array', function(done) {
            chai.request(server)
                .get('/5c609e20b8ed502f5c6a311d/discommentsinorder')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(3);
                    let result = _.map(res.body, (discomment) => {
                        return { username: discomment.username,
                            upvotes: discomment.upvotes }
                    });
                    expect(result).to.include( { username: 'RM', upvotes: 0 },
                                               { username:'Suga', upvotes:1},
                                               { username:'V', upvotes:3});
                    //expect(result).to.include( { username: 'Suga', upvotes: 1 });
                    //expect(result).to.include( { username: 'RM', upvotes: 0 });
                    done();
                });

        });
    });




});
