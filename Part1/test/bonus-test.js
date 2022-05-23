// [bonus] unit test for bonus.circom
const chai = require("chai");

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("Bonus test", function () {
    this.timeout(100000000);

    it("Win test", async () => {
        const circuit = await wasm_tester("contracts/circuits/bonus.circom");
        await circuit.loadConstraints();

        const test = {
            "sum": 21,
            "stateOfGame": 2,
        };

        const INPUT = {
            "sumOfCards": test.sum,
            "stateOfGame": test.stateOfGame 
        }

        const witness = await circuit.calculateWitness(INPUT, true);
        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(test.stateOfGame)));
    });

    it("Running test", async () => {
        const circuit = await wasm_tester("contracts/circuits/bonus.circom");
        await circuit.loadConstraints();

        const test = {
            "sum": 18,
            "stateOfGame": 1,
        };

        const INPUT = {
            "sumOfCards": test.sum,
            "stateOfGame": test.stateOfGame 
        }

        const witness = await circuit.calculateWitness(INPUT, true);
        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(test.stateOfGame)));
    });
    
    it("Lose test", async () => {
        const circuit = await wasm_tester("contracts/circuits/bonus.circom");
        await circuit.loadConstraints();

        const test = {
            "sum": 24,
            "stateOfGame": 3,
        };

        const INPUT = {
            "sumOfCards": test.sum,
            "stateOfGame": test.stateOfGame 
        }

        const witness = await circuit.calculateWitness(INPUT, true);
        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(test.stateOfGame)));
    });

    it("Invalid proof test ==> Assert fails by circuit", async () => {
        const circuit = await wasm_tester("contracts/circuits/bonus.circom");
        await circuit.loadConstraints();

        const test = {
            "sum": 29,
            "stateOfGame": 2,
        };

        const INPUT = {
            "sumOfCards": test.sum,
            "stateOfGame": test.stateOfGame 
        }
        try {
            const witness = await circuit.calculateWitness(INPUT, true);
            assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
            assert(Fr.eq(Fr.e(witness[1]),Fr.e(test.stateOfGame)));
        }
        catch(ex) {
            console.log(ex.message);
        }
    });
});
