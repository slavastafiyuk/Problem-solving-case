const fs = require('fs');
const readline = require('readline');

// Function to process the input CSV file
function processInput(inputFileName) {
  const productQuantities = new Map();
  const productBrands = new Map();
  const lineCount = countLines(inputFileName);
  let total_orders = 0

  console.log(1 < lineCount)
  if(1 < lineCount == true && lineCount<Math.pow(10, 4) == true){
    const rl = readline.createInterface({
      input: fs.createReadStream(inputFileName),
      output: process.stdout,
      terminal: false
    });
  
    rl.on('line', (line) => {
      const [id, area, productName, quantity, brand] = line.split(',');
      const parsedQuantity = parseInt(quantity);
      
      // Update product quantities
      if (productQuantities.has(productName)) {
        productQuantities.set(productName, productQuantities.get(productName) + parsedQuantity);
      } else {
        productQuantities.set(productName, parsedQuantity);
      }
      // Update product brands
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
      // Calculate average quantities
      const averageQuantities = Array.from(productQuantities.entries()).map(([product, quantity]) => {
        return [product, (quantity / total_orders).toFixed(3)];
      });
  
      // Calculate most popular brands
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
  
      // Create output files
      const outputFileName0 = `0_${inputFileName}`;
      const outputFileName1 = `1_${inputFileName}`;
  
      // Write output to files
      writeOutput(outputFileName0, averageQuantities);
      writeOutput(outputFileName1, popularBrands);
    });
  }else{
    if(1 < lineCount == true){
      console.log('Minimum amount of lines is 2')
    }else if(lineCount > Math.pow(10,4) == true){
      console.log('Maximum amount of lines is 10^4')
    }
  }
  
}
//Line counter
function countLines(stream) {
    const data = fs.readFileSync(inputFileName, 'utf8');
  const lines = data.split('\n');
  return lines.length;
}

// Function to write data to an output file
function writeOutput(outputFileName, data) {
  const header = 'Product,Value\n';
  fs.writeFileSync(outputFileName, header);
  for (const [product, value] of data) {
    fs.appendFileSync(outputFileName, `${product},${value}\n`);
  }
}

// Get the input file name from command line arguments
const inputFileName = process.argv[2];

if (!inputFileName) {
  console.error('Please provide the input file name as a command line argument.');
  process.exit(1);
}

processInput(inputFileName);