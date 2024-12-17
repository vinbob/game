var endgamebonus = 20; //percentage of the one with the highest score, added to every players score at the beginning of the endgame
var scenariobonus = 0; //added to every players score after every scenario (now just hard coded the same as endgamebonus)
var totallives = 2;

var scenarios = {
    0: "2030",
    1: "2050",
    2: "2100"
}

var disasters = {
    1:{
        name: "River flooding in the Netherlands",
        color: "blue",
        risks: [3,4,5] //risk per scenario
    },
    2:{
        name: "Tropical disease outbreak in the Netherlands",
        color: "orange",
        risks: [4,3,2] //risk per scenario
    },
    3:{
        name: "Drought in the Netherlands",
        color: "beige",
        risks: [2,4,7] //risk per scenario
    },
    4:{
        name:"Climate fear in the Netherlands",
        color: "purple",
        risks: [2,3,6] //risk per scenario
    },
    5:{
        name:"Heatwaves in the Netherlands",
        color: "pink",
        risks: [2,4,7] //risk per scenario
    }
}

var measures = {
    "Planting more trees in cities.":{
        category: "Landbouw/Groen",
        cost1:8, // % of total wealth
        cost_increase:50, // % increase per scenario
        effects:[
            [5, "=", 1] //[disaster number, operation, operate by]
        ],
        bonusrole: [1,2,3,4,5,6]
    },
    "Social media campaign with information about climate change.":{
        category: "Media",
        cost1:10, // % of total wealth
        cost_increase:10, // % increase per scenario
        effects:[//[disaster number, operator, operant]
            [4, "=", 1] 
        ],
        bonusrole: [1,2,3,4,5,6]
    },
    "Genetically modify farm crops.":{
        category: "Landbouw/Groen",
        cost1:20, // % of total wealth
        cost_increase:20, // % increase per scenario
        effects:[//[disaster number, operator, operant]
            [3, "=", 1] 
        ],
        bonusrole: [1,2,3,4,5,6]
    },
    "Improve urban sewage systems.":{
        category: "Bouw",
        cost1:25, // % of total wealth
        cost_increase:25, // % increase per scenario
        effects:[//[disaster number, operator, operant]
            [2, "=", 0] 
        ],
        bonusrole: [1,2,3,4,5,6]
    },
    "More money for people who buy solar panels.":{
        category: "Economie",
        cost1:45, // % of total wealth
        cost_increase:10, // % increase per scenario
        effects:[//[disaster number, operator, operant]
            [1, "/", 2],
            [2, "/", 2],
            [3, "/", 2],
            [4, "/", 2],
            [5, "/", 2] 
        ],
        bonusrole: [1,2,3,4,5,6]
    },
    "Strenghten political bonds between the Netherlands and Germany":{
        category: "Economie/bestuur",
        cost1:10, // % of total wealth
        cost_increase:100, // % increase per scenario
        effects:[//[disaster number, operator, operant]
            [1, "=", 1] 
        ],
        bonusrole: [1,2,3,4,5,6]
    }
}