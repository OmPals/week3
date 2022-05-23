const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

let content = fs.readFileSync("./contracts/verifier.sol", { encoding: 'utf-8' });
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');

fs.writeFileSync("./contracts/verifier.sol", bumped);

let content2 = fs.readFileSync("./contracts/bonus_verifier.sol", { encoding: 'utf-8' });
let bumped2 = content2.replace(solidityRegex, 'pragma solidity ^0.8.0');

fs.writeFileSync("./contracts/bonus_verifier.sol", bumped2);