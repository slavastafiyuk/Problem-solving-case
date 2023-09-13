const fs = require('fs');
const { processInput, countLines, writeOutput, doesFileOrDirectoryExist } = require('./app');
const { expect } = require('chai');
const { describe, it} = require('mocha');
describe('countLines', () => {
    it('should return the number of lines in a file', () => {
        const testFileContent = 'Line 1\nLine 2\nLine 3';
        fs.writeFileSync('testfile.csv', testFileContent);
        const result = countLines('testfile.csv');
        expect(result).to.equal(3);
        fs.unlinkSync('testfile.csv');
    });
    it('should return 0 for an empty file', () => {
        fs.writeFileSync('emptyfile.csv', '');
        const result = countLines('emptyfile.csv');
        expect(result).to.equal(0);
        fs.unlinkSync('emptyfile.csv');
    });
    it('should return 0 for a non-existent file', () => {
        const result = countLines('nonexistentfile.csv');
        expect(result).to.equal(0);
    });
});
describe('processInput', () => {
    it('should handle a non-existent input file', () => {
      const result = processInput('nonexistentfile.csv');
      expect(result).to.equal(0);
    });
    it('should handle if there is less than 1 lines', () =>{
        fs.writeFileSync('testfile.csv', '');
        const result = processInput('testfile.csv')
        expect(result).to.equal('Minimum amount of lines is 1')
        fs.unlinkSync('testfile.csv');
    })
    it('should handle if there is more or equals than 10^4 lines', () =>{
        const testFileContent = Array.from({ length: 10001 }, (_, index) => `Line ${index + 1}`).join('\n');
        fs.writeFileSync('testfile.csv', testFileContent);
        const result = processInput('testfile.csv')
        expect(result).to.equal('Maximum amount of lines is 10^4')
        fs.unlinkSync('testfile.csv');
    })
  });

