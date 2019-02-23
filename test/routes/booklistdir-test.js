let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
chai.use(require('chai-things'));
chai.use(chaiHttp);
let _ = require('lodash' );


describe('Booklistcomments', function (){

    describe('POST /booklistdir', function () {
        it('should return confirmation message and update database', function(done) {
            let booklistdir = {
                username: 'RM1',
                booklistname: '5c67106f8ae46b2eec56db21',
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

});
