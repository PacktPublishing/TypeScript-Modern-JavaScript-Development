///<reference path="./references.test.d.ts" />

import chai = require('chai');
import View = require('../source/ts/view');

var expect = chai.expect;

describe('Base View Unit Tests:', () => {

    before(function(){
      
    });

    describe('Template', () => {

        it('should load by url', (done) => {
            expect(2+4).to.equals(6);
            done();
        });

        it('should not be 7', (done) => {
            expect(2+4).to.not.equals(7);
            done();
        });
    });
});
