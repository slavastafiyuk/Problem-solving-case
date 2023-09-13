const fs = require('fs');
const readline = require('readline');

function processInput(inputFileName) {
  
  if (!doesFileOrDirectoryExist(inputFileName)) {
    return 0;
  } 

  const productQuantities = new Map();
  const productBrands = new Map();
  const lineCount = countLines(inputFileName);
  let total_orders = 0

  console.log(1 < lineCount)
  if (1 < lineCount == true && lineCount < Math.pow(10, 4) == true) {
    const rl = readline.createInterface({
      input: fs.createReadStream(inputFileName),
      output: process.stdout,
      terminal: false
    });

    rl.on('line', (line) => {
      const [id, area, productName, quantity, brand] = line.split(',');
      const parsedQuantity = parseInt(quantity);
      if (productQuantities.has(productName)) {
        productQuantities.set(productName, productQuantities.get(productName) + parsedQuantity);
      } else {
        productQuantities.set(productName, parsedQuantity);
      }
      if (!productBrands.has(productName)) {
        productBrands.set(productName, new Map());
      }
      if (productBrands.get(productName).has(brand)) {
        productBrands.get(productName).set(brand, productBrands.get(productName).get(brand) + 1);
      } else {
        productBrands.get(productName).set(brand, 1);
      }
      total_orders++
    });
    rl.on('close', () => {
      const averageQuantities = Array.from(productQuantities.entries()).map(([product, quantity]) => {
        return [product, (quantity / total_orders).toFixed(3)];
      });
      const popularBrands = Array.from(productBrands.entries()).map(([product, brandsMap]) => {
        let maxBrand = '';
        let maxCount = 0;
        for (const [brand, count] of brandsMap.entries()) {
          if (count > maxCount) {
            maxBrand = brand;
            maxCount = count;
          }
        }
        return [product, maxBrand];
      });
      const outputFileName0 = `0_${inputFileName}`;
      const outputFileName1 = `1_${inputFileName}`;
      writeOutput(outputFileName0, averageQuantities);
      writeOutput(outputFileName1, popularBrands);
    });
  } else {
    if (1 >= lineCount == true) {
      return 'Minimum amount of lines is 2'
    } else if (lineCount > Math.pow(10, 4) == true) {
      return 'Maximum amount of lines is 10^4'
    }
  }

}
function countLines(file) {
  if (!doesFileOrDirectoryExist(file)) {
    return 0;
  } else {
    const data = fs.readFileSync(file, 'utf8');
    if (!data.trim()) {
      return 0;
    }
    const lines = data.split('\n');
    return lines.length;
  }
}
function doesFileOrDirectoryExist(path) {
  return fs.existsSync(path);
}
function writeOutput(outputFileName, data) {
  const header = 'Product,Value\n';
  fs.writeFileSync(outputFileName, header);
  for (const [product, value] of data) {
    fs.appendFileSync(outputFileName, `${product},${value}\n`);
  }
}
const inputFileName = process.argv[2];
processInput(inputFileName);

module.exports = {
  processInput,
  countLines,
  doesFileOrDirectoryExist,
};