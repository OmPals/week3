//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected
const chai = require("chai");
const path = require("path");
const buildPoseidon = require("circomlibjs").buildPoseidon;
const ethers = require("hardhat").ethers;

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("MasterMindVariation test", function () {
    this.timeout(100000000);
    let poseidonJs;

    before(async () => {
        poseidonJs = await buildPoseidon();
    });

    it("Given the guess and solution, incorrect hits and blows should fail the circuit assertions", async () => {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();

        const test = {
            "guess": [3,1,5,2],
            "soln":  [2,1,3,4],
            "sum": 10,

            // Tries to win with wrong hits
            "hits": 4,
            "blows": 0,
        };
        const salt = ethers.BigNumber.from(ethers.utils.randomBytes(32));
        const posHashSol = ethers.BigNumber.from(
            poseidonJs.F.toObject(poseidonJs([salt, ...test.soln]))
        );

        const INPUT = {
            "pubGuessA": test.guess[0],
            "pubGuessB": test.guess[1],
            "pubGuessC": test.guess[2],
            "pubGuessD": test.guess[3],
            "pubNumHit": test.hits,
            "pubNumBlow": test.blows,
            "pubNumSum": test.sum,
            "pubSolnHash": posHashSol,
            "privSolnA": test.soln[0],
            "privSolnB": test.soln[1],
            "privSolnC": test.soln[2],
            "privSolnD": test.soln[3],
            "privSalt": salt
        }

        let isWrongInput = false;
        try{
            const witness = await circuit.calculateWitness(INPUT, true);
        }
        catch(ex) {
            isWrongInput = true;
        }

        assert(isWrongInput, true);
    });

    it("Given the guess and solution, correct hits and blows should pass the circuit assertions", async () => {
        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();

        const test = {
            "guess": [3,1,5,2],
            "soln":  [2,1,3,4],
            "sum": 10,
            "hits": 1,
            "blows": 2,
        };
        const salt = ethers.BigNumber.from(ethers.utils.randomBytes(32));
        const posHashSol = ethers.BigNumber.from(
            poseidonJs.F.toObject(poseidonJs([salt, ...test.soln]))
        );

        const INPUT = {
            "pubGuessA": test.guess[0],
            "pubGuessB": test.guess[1],
            "pubGuessC": test.guess[2],
            "pubGuessD": test.guess[3],
            "pubNumHit": test.hits,
            "pubNumBlow": test.blows,
            "pubNumSum": test.sum,
            "pubSolnHash": posHashSol,
            "privSolnA": test.soln[0],
            "privSolnB": test.soln[1],
            "privSolnC": test.soln[2],
            "privSolnD": test.soln[3],
            "privSalt": salt
        }

        let isRightInput = true;
        try{
            const witness = await circuit.calculateWitness(INPUT, true);
            assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
            assert(Fr.eq(Fr.e(witness[1]),Fr.e(posHashSol)));
        }
        catch {
            isRightInput = false;
        }

        assert(isRightInput, true);
    });
});
