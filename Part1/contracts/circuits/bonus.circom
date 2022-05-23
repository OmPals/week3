// [bonus] implement an example game from part d
pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

template Blackjack() {
    signal input sumOfCards;
    signal input stateOfGame; //running = 1, win = 2, lose = 3

    signal output stateOfGameOut;

    component lt21;
    component eq21;
    component gt21;
    var blackjack = 21;

    lt21 = LessThan(4);
    lt21.in[0] <== sumOfCards;
    lt21.in[1] <== blackjack;

    eq21 = IsEqual();
    eq21.in[0] <== sumOfCards;
    eq21.in[1] <== blackjack;

    gt21 = GreaterThan(4);
    gt21.in[0] <== sumOfCards;
    gt21.in[1] <== blackjack;

    var stateOfGameCalc = 1*lt21.out + 2*eq21.out + 3*gt21.out;
    
    stateOfGameCalc === stateOfGame;
    stateOfGameOut <== stateOfGame;
}

component main = Blackjack();
