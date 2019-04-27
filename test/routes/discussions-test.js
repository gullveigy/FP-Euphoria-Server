let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
chai.use(require('chai-things'));
chai.use(chaiHttp);
let _ = require('lodash' );

describe('Discussions', function (){

    describe('POST /discussions', function () {
        it('should return confirmation message and update database', function(done) {
            let discussion = {
                username: 'RM',
                email: '18817192034@qq.com',
                bookname: 'Just Test',
                title: 'JUST TEST',
                content: 'Test for it',
                file: 'image/jpeg;base64,/9j/4AAQSkZ',
                date:'',
                upvotes:0,
                collect: 0

            };
            chai.request(server)
                .post('/discussions')
                .send(discussion)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Discussion Successfully Added!' );
                    let discussion = res.body.data;
                    expect(discussion).to.include({ bookname: 'Just Test', content: 'Test for it'});
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/Just Test/discussions')
                .end(function(err, res) {
                    let result = _.map(res.body, (discussion) => {
                        return { username: discussion.username,
                            content: discussion.content };
                    }  );
                    expect(result).to.include( { username: 'RM', content: 'Test for it'  } );
                    done();
                });

        });  // end-after
    });



    describe('PUT /discussions/:id/vote', () => {
        describe ('when id is valid',function() {
            it('should return a confirmation message and update database', function (done) {
                chai.request(server)
                    .get('/Just Test/discussions')
                    .end(function (err, res) {
                        const discussionId = res.body[0]._id;
                        chai.request(server)
                            .put('/discussions/' + discussionId + '/vote')
                            .end(function (err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.have.property('message', 'Discussion Successfully Upvoted!');
                                done();
                            });
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/Just Test/discussions')
                    .end(function(err, res) {
                        let result = _.map(res.body, (discussion) => {
                            return { upvotes: discussion.upvotes,
                                content: discussion.content};
                        }  );
                        expect(result).to.include( { upvotes: 1, content: 'Test for it'  } );
                        done();
                    })
            });  // end-after
        });
        describe('when id is invalid',function() {
            it('should return a 404 and a message for invalid discussion id', function (done) {
                chai.request(server)
                    .put('/discussions/10001/vote')
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message', 'Discussion NOT Found!');
                        done();
                    });
            });
        });
    });



    describe('PUT /discussions/:id/edit', () => {
        describe ('when id is valid',function() {
            it('should return a confirmation message and update database', function (done) {
                let discussion = {

                    content: 'Test for it!!!'

                };
                chai.request(server)
                    .get('/Just Test/discussions')
                    .end(function (err, res) {
                        const discussionId = res.body[0]._id;
                        chai.request(server)
                            .put('/discussions/' + discussionId + '/edit')
                            .send(discussion)
                            .end(function (err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.have.property('Message', 'Discussion Successfully Changed!');
                                done();
                            });
                    });
            });
            after(function  (done) {
                chai.request(server)
                    .get('/Just Test/discussions')
                    .end(function(err, res) {
                        let result = _.map(res.body, (discussion) => {
                            return { upvotes: discussion.upvotes,
                                content: discussion.content};
                        }  );
                        expect(result).to.include( { upvotes: 1, content: 'Test for it!!!'  } );
                        done();
                    })
            });  // end-after
        });
        describe('when id is invalid',function() {
            it('should return a 404 and a message for invalid discussion id', function (done) {
                chai.request(server)
                    .put('/discussions/10001/edit')
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('Message', 'Sorry! Cannot find the discussion by this id!');
                        done();
                    });
            });
        });
    });


    describe('DELETE /discussions/:id', () => {
        describe ('when id is valid',function(){
            it('should return a confirmation message and update database ', function(done) {
                chai.request(server)
                    .get('/Just Test/discussions')
                    .end(function(err, res) {
                        const discussionId = res.body[0]._id;
                        chai.request(server)
                            .delete('/discussions/' + discussionId)
                            .end(function(err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.have.property('message','Discussion Successfully Deleted!' ) ;
                                done();
                            });
                    });

            });
            after(function  (done) {
                chai.request(server)
                    .get('/Just Test/discussions')
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
                    .delete('/discussions/1100001')
                    .end(function(err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('message','Discussion NOT DELETED!' ) ;
                        done();
                    });
            });

        });

    });




    describe('GET /:bookname/discussions',  () => {
        it('should return all the discussions of this book in an array', function(done) {
            chai.request(server)
                .get('/IDOL/discussions')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (discussion) => {
                        return { username: discussion.username,
                            upvotes: discussion.upvotes }
                    });
                    //expect(result).to.include( { username: 'V', upvotes: 3 });
                    //expect(result).to.include( { username: 'Suga', upvotes: 1 });
                    expect(result).to.include( { username: 'Test1', upvotes: 5 });
                    done();
                });

        });
    });


    describe('GET /discussions/:id',  () => {
        it('should return the discussion with this id in an array', function(done) {
            chai.request(server)
                .get('/discussions/5cb8805ef6446b2fc49322f1')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (discussion) => {
                        return { username: discussion.username,
                            upvotes: discussion.upvotes }
                    });
                    expect(result).to.include( { username: 'Test1', upvotes: 5 });
                    //expect(result).to.include( { username: 'Suga', upvotes: 1 });
                    //expect(result).to.include( { username: 'RM', upvotes: 0 });
                    done();
                });

        });
        it('should return a 404 and a message for invalid id', function(done) {
            chai.request(server)
                .get('/discussions/10001')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message','Discussion NOT Found!' ) ;
                    done();
                });
        });
    });



    describe('GET /fuzzysearch/:bookname/discussions',  () => {
        it('should return relevant records matching the fuzzy description in an array', function(done) {
            chai.request(server)
                .get('/fuzzysearch/DO/discussions')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (discussion) => {
                        return { username: discussion.username,
                            upvotes: discussion.upvotes }
                    });
                    expect(result).to.include(
                        { username: 'Test1', upvotes: 5 }
                    );
                    //expect(result).to.include( { description: "Acide Hyaluronique", amount: 6.95  } );
                    //expect(result).to.include( { description: "Facteurs Naturels", amount: 5.95  } );
                    //expect(result).to.include( { description: "lancome foundation", amount: 36  } );
                    done();
                });

        });
        it('should return a message for no relevant records', function(done) {
            chai.request(server)
                .get('/fuzzysearch/123j/discussions')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    //expect(res.body.length).to.equal(0);
                    expect(res.body).to.have.property('Message','Sorry! Cannot find this discussion by this message!' ) ;
                    done();
                });
        });

    });


    describe('GET /:bookname/discussionsinorder',  () => {
        it('should return all the discussions of one book in date order in an array', function(done) {
            chai.request(server)
                .get('/Young Forever/discussionsinorder')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (discussion) => {
                        return { username: discussion.username,
                            upvotes: discussion.upvotes }
                    });
                    expect(result).to.include(
                        { username:'Agust D', upvotes:1 }
                        );
                    //expect(result).to.include( { username: 'Suga', upvotes: 1 });
                    //expect(result).to.include( { username: 'RM', upvotes: 0 });
                    done();
                });

        });
    });


    describe('GET /fuzzydateorder/:content',  () => {
        it('should return all the releted discussions in date order by fuzzy search in an array', function(done) {
            chai.request(server)
                .get('/fuzzydateorder/(artist)')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (discussion) => {
                        return { username: discussion.username,
                            upvotes: discussion.upvotes }
                    });
                    expect(result).to.include(
                        { username:'Test1', upvotes:5 });
                    //expect(result).to.include( { username: 'Suga', upvotes: 1 });
                    //expect(result).to.include( { username: 'RM', upvotes: 0 });
                    done();
                });

        });
    });



    describe('GET /fuzzyvoteorder/:content',  () => {
        it('should return all the releted discussions in vote order by fuzzy search in an array', function(done) {
            chai.request(server)
                .get('/fuzzydateorder/you are')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    let result = _.map(res.body, (discussion) => {
                        return { username: discussion.username,
                            upvotes: discussion.upvotes }
                    });
                    expect(result).to.include(
                        { username:'Agust D', upvotes:1 },
                        { username:'Agust D', upvotes:0 });
                    //expect(result).to.include( { username: 'Suga', upvotes: 1 });
                    //expect(result).to.include( { username: 'RM', upvotes: 0 });
                    done();
                });

        });
    });


});
