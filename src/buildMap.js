import { Bodies } from "matter-js"
import GoJiraURL from './assets/map/GoJira.png'
import questionURL from "./assets/map/question.png"
import pianoURL from "./assets/map/piano.png"
import speakerURL from "./assets/map/speaker.png"
import beeURL from "./assets/map/bee.png"
import headURL from "./assets/map/head.png"
import LIVELabURL from "./assets/map/LIVELab.png"
import GreenHouseURL from "./assets/map/Biology Greenhouse.png"
import cactus1URL from "./assets/map/cactus.png"
import cactus2URL from "./assets/map/cactus2.png"
import cactus3URL from "./assets/map/cactus3.png"
import bookURL from "./assets/map/book.png"
import mURL from "./assets/map/m.png"
import sURL from "./assets/map/s.png"
import sence1URL from "./assets/map/scene1.png"
import screen from "./assets/map/screen.png"
import firework from "./assets/map/firework.png"
import office from "./assets/map/office.png"
import Sheridan from "./assets/map/Sheridan.png"
import Richard from "./assets/map/Richard.png"
import donut from "./assets/map/donut.png"
import utag from "./assets/map/utag.png"
import connected from "./assets/map/connected.png"
import seamless from "./assets/map/seamless.png"
import transformative from "./assets/map/transformative.png"
import final from "./assets/map/final.png"
import congras from "./assets/map/congras.png"
import crowd from "./assets/map/crowd.png"
import ribbon from "./assets/map/ribbon-cut.png"
import bsb from "./assets/map/bsb.png"
import mills from "./assets/map/mills.png"
import control from "./assets/map/lobby/control.png"
import MMAURL from "./assets/map/MMA.png"

import first from "./assets/map/1st.png"
import second from "./assets/map/2nd.png"
import third from "./assets/map/3rd.png"
import fourth from "./assets/map/4th.png"
import fifth from "./assets/map/5th.png"

var buildMap = {}
buildMap.build = (composite, world) => {
    composite.add(world, [
        buildMap.createPlatform(1800, 580, 2100), //H 
        buildMap.createPlatform(4100, 580, 1400), //H Floor
        buildMap.createPlatform(2100, 580 - 80, 10, 650), //V player 80
        buildMap.createPlatform(4500, 580, 10, 730), //V
        // Lobby
        Bodies.rectangle(200, 515, 145 * 0.5, 145 * 0.5, {
            isStatic: true,
            isSensor: true,
            bodyType: "donut",
            render: {
                lineWidth: 1,
                sprite: {
                    texture: donut,
                    xOffset: 0,
                    yOffset: 0,
                    xScale: 0.5,
                    yScale: 0.5
                }
            }
        }),
        Bodies.rectangle(600, 450, 508 * 0.5, 211 * 0.5, {
            isStatic: true,
            render: {
                lineWidth: 1,
                sprite: {
                    texture: control,
                    xOffset: 0,
                    yOffset: 0,
                    xScale: 0.5,
                    yScale: 0.5
                }
            },
            collisionFilter: {
                category: 0x0002,
                mask: 0x0001
            }
        }),
        buildMap.createQuestion(700, 590, "What is UTS's full name?\n\nPlease only enter a sigle number:\n1. University Technology Services\n2. University of Technology Sydney\n3. Unix Time Stamp", "1"),
        Bodies.rectangle(900, 470, 314, 104, {
            isStatic: true,
            render: {
                lineWidth: 1,
                sprite: {
                    texture: first,
                    xOffset: 0,
                    yOffset: 0,
                    xScale: 1,
                    yScale: 1
                }
            },
            collisionFilter: {
                category: 0x0002,
                mask: 0x0001
            }
        }),
        // Questions
        buildMap.createQuestion(2344, 340, "What is UTAG's full name?\n1. University Technology Acrobatics Group\n2. University Technology Accountant Group\n3. University Technology Assistant Group", "3"),
        Bodies.rectangle(2310, 220, 314, 104, {
            isStatic: true,
            render: {
                lineWidth: 1,
                sprite: {
                    texture: second,
                    xOffset: 0,
                    yOffset: 0,
                    xScale: 1,
                    yScale: 1
                }
            },
            collisionFilter: {
                category: 0x0002,
                mask: 0x0001
            }
        }),
        buildMap.createQuestion(6500, 430, "What is the human hearing range?\n1. 0 to 20,000Hz\n2. 20 to 20,000Hz\n3. 200 to 200,000Hz", "2"),
        Bodies.rectangle(6500, 210, 314, 104, {
            isStatic: true,
            render: {
                lineWidth: 1,
                sprite: {
                    texture: third,
                    xOffset: 0,
                    yOffset: 0,
                    xScale: 1,
                    yScale: 1
                }
            },
            collisionFilter: {
                category: 0x0002,
                mask: 0x0001
            }
        }),
        buildMap.createQuestion(7200, 430, "What is the family of cactus?\n1. Dinosauria\n2. Caryophyllales\n3. Cactaceae", "3"),
        Bodies.rectangle(7200, 210, 314, 104, {
            isStatic: true,
            render: {
                lineWidth: 1,
                sprite: {
                    texture: fourth,
                    xOffset: 0,
                    yOffset: 0,
                    xScale: 1,
                    yScale: 1
                }
            },
            collisionFilter: {
                category: 0x0002,
                mask: 0x0001
            }
        }),
        buildMap.createQuestion(10160, 570, "What is the right order of UTS values\n1. Seamless Transformative Connected\n2. Connected Transformative Seamless\n3. Connected Seamless Transformative", "3"),
        Bodies.rectangle(10160, 460, 314, 104, {
            isStatic: true,
            render: {
                lineWidth: 1,
                sprite: {
                    texture: fifth,
                    xOffset: 0,
                    yOffset: 0,
                    xScale: 1,
                    yScale: 1
                }
            },
            collisionFilter: {
                category: 0x0002,
                mask: 0x0001
            }
        }),
        Bodies.rectangle(1850+451/2*0.5, 570-284/2*0.5, 451*0.5, 284*0.5, {
            isStatic:true,
            render:{
                sprite:{
                    texture:bsb,
                    xScale:0.5,
                    yScale:0.5
                }
            },
            collisionFilter: {
                category: 0x0002,
                mask: 0x0001
            }
        }),
        // Floor1 room1
        buildMap.createPlatform(2100, 580 - 70 - 80, 100, 10), //H
        buildMap.createPlatform(2300, 580 - 80, 100, 10), //H
        buildMap.createPlatform(2400, 580, 10, 240), //V
        buildMap.createPlatform(2300 - 30, 580 - 80 - 80 - 70, 100 + 30, 10), //H
        // F1R2
        buildMap.createPlatform(2600, 580, 10, 150), //V
        buildMap.createPlatform(2700, 580 - 80, 10, 150 + 10), //V
        buildMap.createPlatform(2550, 580 - 80, 50, 10), //H
        buildMap.createPlatform(2500, 580 - 80 - 80 - 70, 200, 10), //H
        // F1R3
        buildMap.createPlatform(2850, 580, 10, 80), //V
        buildMap.createPlatform(2850, 550, 80, 10), //H
        buildMap.createPlatform(3000, 580 - 80, 10, 150 + 10), //V
        buildMap.createPlatform(2800, 580 - 80 - 80 - 70, 200, 10), //H
        // F1R4
        buildMap.createPlatform(3300, 580, 10, 130), //V
        buildMap.createPlatform(3100, 580 - 130, 10, 100), //V
        buildMap.createPlatform(3100, 580 - 80 - 80 - 70, 200, 10), //H
        buildMap.createPlatform(3000, 580 - 80 - 80 - 70 + 80, 100, 10), //H
        buildMap.createBox(3200, 570),
        // F1R5
        buildMap.createBouncyPlatform(3450, 560, undefined, undefined, -0.05), //H
        buildMap.createPlatform(3300, 580 - 80 - 50), //H
        buildMap.createPlatform(3600 + 100, 580, 10, 130), //V
        buildMap.createPlatform(3530 + 100, 580 - 80 - 50), //H
        buildMap.createPlatform(3300, 580 - 80 - 80 - 70, 1000, 10), //H
        // F1R6
        buildMap.createPlatform(3900, 580, 10, 80), //V
        buildMap.createPlatform(4100, 580, 10, 80), //V
        buildMap.createPlatform(4100, 540, 80, 10), //V
        buildMap.createPlatform(4300, 580 - 80 - 20, 10, 140), //V
        // F1R7
        buildMap.createPlatform(4300, 580 - 80 - 70, 80, 10), //H
        buildMap.createPlatform(4430, 580 - 80 - 80 - 70, 80, 10), //H
        buildMap.createBox(4400, 570, 70, 70),
        // F2R1
        buildMap.createPlatform(4250, 340, 10, 80), // V
        buildMap.createPlatform(4100, 340, 10, 150), // V
        buildMap.createPlatform(2100, 100, 600, 10), // V Ceiling
        buildMap.createPlatform(2800, 100, 1600, 10), // V Ceiling
        buildMap.createPlatform(4430, 200, 70, 10), // H
        buildMap.createPlatform(4450, 150, 50, 10), // H
        // F2R2
        buildMap.createPlatform(3300, 340, 10, 170), // V
        buildMap.createPlatform(3600, 300, 100, 10), // H
        Bodies.rectangle(3800+718/2*0.4, 345-495/2*0.4, 718*0.4, 495*0.35, {
            isStatic:true,
            render:{
                sprite:{
                    texture:ribbon,
                    xScale:0.4,
                    yScale:0.4
                }
            },
            collisionFilter: {
                category: 0x0002,
                mask: 0x0001
            }
        }),
        Bodies.rectangle(3650, 215, 145 * 0.5, 145 * 0.5, {
            isStatic: true,
            isSensor: true,
            bodyType: "donut",
            render: {
                lineWidth: 1,
                sprite: {
                    texture: donut,
                    xOffset: 0,
                    yOffset: 0,
                    xScale: 0.5,
                    yScale: 0.5
                }
            }
        }),
        Bodies.rectangle(3350+361/2*0.4, 345-196/2*0.4, 361*0.4, 196*0.4, {
            isStatic:true,
            render:{
                sprite:{
                    texture:crowd,
                    xScale:0.4,
                    yScale:0.4
                }
            },
            collisionFilter: {
                category: 0x0002,
                mask: 0x0001
            }
        }),
        // buildMap.createPlatform(3800, 345, 718*0.4, 495*0.4,{url:ribbon,}), // H
        // F2R3
        buildMap.createPlatform(2650, 180, 650, 10), // H
        buildMap.createPlatform(2600, 200, 50, 10), // H
        buildMap.createPlatform(2500, 275, 50, 10), // H
        buildMap.createPlatform(2650, 200, 10, 100), // V
        buildMap.createPlatform(2500, 350, 10, 250), // V
        // F3R1
        buildMap.createPlatform(2100, -140, 800, 10), // H Ceiling
        buildMap.createPlatform(3000, -140, 1500, 10), // H Ceiling
        buildMap.createPlatform(2300, 90, 10, 120), // V
        buildMap.createPlatform(2450, 90, 10, 60), // V
        buildMap.createPlatform(2600, 90, 10, 60), // V
        buildMap.createPlatform(2800, 90, 10, 140), // V
        buildMap.createPlatform(2220, 50, 80, 10), // H
        buildMap.createPlatform(2300, 30, 100, 10), // H
        buildMap.createPlatform(2450, -40, 350, 10), // H
        // F3R2
        buildMap.createPlatform(2900, -40, 1380, 10), // H
        buildMap.createPlatform(3200, 0, 10, 40), // V
        buildMap.createPlatform(3500, 0, 10, 40), // V
        buildMap.createPlatform(3800, 0, 10, 40), // V
        buildMap.createPlatform(4100, 0, 10, 40), // V
        buildMap.createPlatform(3350, 90, 10, 60), // V
        buildMap.createPlatform(3650, 90, 10, 60), // V
        buildMap.createPlatform(3950, 90, 10, 60), // V
        buildMap.createPlatform(4350, 10, 150, 10), // H
        //Exit
        buildMap.createPlatform(2900, -50, 10, 100), // V
        buildMap.createPlatform(2910, -80, 30, 10), // H
        // GoJiar
        Bodies.rectangle((4550 + 400 / 2), 580 - 580 / 2, 350, 580, {
            isStatic: true,
            render: {
                lineWidth: 1,
                sprite: {
                    texture: GoJiraURL,
                    xOffset: 0,
                    yOffset: 0,
                }
            },
            bodyType: "spring",
            fspring: -0.1
        }),
        buildMap.createPlatform(4500, -30, 500, 10), // H
        buildMap.createPlatform(5000, 500, 10, 540), // H
        buildMap.createPlatform(5000, 70, 100, 10), // H
        buildMap.createPlatform(5100, 170, 100, 10), // H
        buildMap.createPlatform(5200, 270, 100, 10), // H
        buildMap.createPlatform(5300, 370, 100, 10), // H
        buildMap.createPlatform(5200, 470, 100, 10), // H
        // buildMap.createPlatform(5100,570,100,10),
        buildMap.createPlatform(5500, 580, 1000), // H Floor
        //Bee
        buildMap.createPlatform(5800, 580 - 100, 10, 300 - 100), // V
        buildMap.createPlatform(6500, 280 + 50, 10, 50), // V
        buildMap.createPlatform(6500, 580, 10, 150), // V
        buildMap.createPlatform(5800, 280, 710, 10), // H
        buildMap.createPlatform(5950, 570, 50, 50), // H
        buildMap.createPlatform(5900, 520, 50, 10), // H
        buildMap.createPlatform(6100, 520, 50, 10, { url: beeURL, xScale: 0.5, yScale: 0.5 }), // H
        buildMap.createPlatform(5950, 520, 50, 75, { url: headURL, xScale: 1, yScale: 1 }), // H
        buildMap.createPlatform(5810, 350, 50, 75, { url: speakerURL, xScale: 1, yScale: 1 }), // H
        buildMap.createPlatform(5910, 350, 50, 75, { url: speakerURL, xScale: 1, yScale: 1 }), // H
        buildMap.createPlatform(6010, 350, 50, 75, { url: speakerURL, xScale: 1, yScale: 1 }), // H
        buildMap.createPlatform(6110, 350, 50, 75, { url: speakerURL, xScale: 1, yScale: 1 }), // H
        buildMap.createPlatform(6210, 350, 50, 75, { url: speakerURL, xScale: 1, yScale: 1 }), // H
        buildMap.createPlatform(6310, 350, 50, 75, { url: speakerURL, xScale: 1, yScale: 1 }), // H
        buildMap.createPlatform(6410, 350, 50, 75, { url: speakerURL, xScale: 1, yScale: 1 }), // H
        buildMap.createPlatform(6380, 570, 120, 115, { url: pianoURL, xScale: 1, yScale: 1 }), // H
        buildMap.createPlatform(5800, 265, 292, 48, { url: LIVELabURL, xScale: 1, yScale: 1 }), // H
        buildMap.createPlatform(6300, 525, 50, 10), // H
        // Green House
        buildMap.createPlatform(6600, 280 + 50, 10, 50), // V
        buildMap.createPlatform(6600, 580, 10, 150), // V
        buildMap.createPlatform(7300, 280 + 50, 10, 50), // V
        buildMap.createPlatform(7300, 580, 10, 150), // V
        buildMap.createPlatform(6500, 440, 100, 10), // H
        buildMap.createPlatform(6600, 580, 1800, 10), // H Floor
        buildMap.createPlatform(6600, 280, 710, 10), // H Ceiling
        buildMap.createPlatform(6600, 265, 417, 47, { url:GreenHouseURL, xScale:1, yScale:1}), 

        buildMap.createBouncyPlatform(6650, 570, 184, 102, -0.05, { url: cactus1URL, xScale: 1, yScale: 1 }),
        buildMap.createBouncyPlatform(6900, 570, 106, 82, -0.05, { url: cactus2URL, xScale: 1, yScale: 1 }),
        buildMap.createBouncyPlatform(7100, 570, 115, 80, -0.05, { url: cactus3URL, xScale: 1, yScale: 1 }),

        Bodies.rectangle(7400+451/2*0.5, 570-284/2*0.5, 451*0.5, 284*0.5, {
            isStatic:true,
            render:{
                sprite:{
                    texture:mills,
                    xScale:0.5,
                    yScale:0.5
                }
            },
            collisionFilter: {
                category: 0x0002,
                mask: 0x0001
            }
        }),

        buildMap.createPlatform(7200, 440, 100, 10), // H
        buildMap.createPlatform(7600, 300, 10, 10, { url: bookURL, xScale: 1, yScale: 1 }), // H
        // buildMap.createPlatform(7950, 200, 558, 57, { url: MMAURL, xScale: 1, yScale: 1 }), // H
        buildMap.createPlatform(8000, 350, 10, 10, { url: sURL, xScale: 1, yScale: 1 }), // H
        buildMap.createPlatform(8200, 350, 10, 10, { url: mURL, xScale: 1, yScale: 1 }), // H

        //Kate
        buildMap.createPlatform(8550, 580, 1300, 10), // H Floor
        buildMap.createPlatform(8600, 570, 900 * 0.4, 237 * 0.4, { url: sence1URL, xScale: 0.4, yScale: 0.4 }, {
            category: 0x0002,
            mask: 0x0001
        }),

        buildMap.createPlatform(9100, 500, 640 / 2, 282 / 2, { url: screen, xScale: 0.5, yScale: 0.5 }, {
            category: 0x0002,
            mask: 0x0001
        }),

        buildMap.createPlatform(9500, 570, 593 * 0.4, 334 * 0.4, { url: firework, xScale: 0.4, yScale: 0.4 }, {
            category: 0x0002,
            mask: 0x0001
        }),

        // Richard
        buildMap.createPlatform(10000, 580, 1300, 10), // H Floor
        buildMap.createPlatform(10500, 580 - 100, 10, 300 - 100), // V
        // buildMap.createPlatform(11000,280+50,10,50), // V
        buildMap.createPlatform(11000, 580, 10, 220), // V
        buildMap.createPlatform(10500, 280, 510, 10), // H
        buildMap.createPlatform(10360, 380, 250 * 0.6, 102 * 0.6, { url: office, xScale: 0.6, yScale: 0.6 }),
        buildMap.createPlatform(10500, 270, 424 * 0.6, 127 * 0.6, { url: Sheridan, xScale: 0.6, yScale: 0.6 }),
        buildMap.createPlatform(10700, 570, 463 * 0.4, 328 * 0.4, { url: Richard, xScale: 0.4, yScale: 0.4 }, {
            category: 0x0002,
            mask: 0x0001
        }),

        // Desk
        buildMap.createPlatform(10900, 550, 70, 10),
        buildMap.createPlatform(10910, 570, 10, 20),
        buildMap.createPlatform(10950, 570, 10, 20),
        Bodies.rectangle(10935, 465, 145 * 0.5, 145 * 0.5, {
            isStatic: true,
            bodyType: "donut",
            isSensor: true,
            render: {
                lineWidth: 1,
                sprite: {
                    texture: donut,
                    xOffset: 0,
                    yOffset: 0,
                    xScale: 0.5,
                    yScale: 0.5
                }
            }
        }),
        Bodies.circle(11500, 550, 125, {
            isStatic: true,
            render: {
                lineWidth: 1,
                sprite: {
                    texture: connected,
                    xOffset: 0,
                    yOffset: 0,
                    xScale: 1,
                    yScale: 1
                }
            }
        }),
        Bodies.circle(11500 + 500, 550, 125, {
            isStatic: true,
            render: {
                lineWidth: 1,
                sprite: {
                    texture: seamless,
                    xOffset: 0,
                    yOffset: 0,
                    xScale: 1,
                    yScale: 1
                }
            }
        }),
        Bodies.circle(11500 + 2 * 500, 550, 125, {
            isStatic: true,
            render: {
                lineWidth: 1,
                sprite: {
                    texture: transformative,
                    xOffset: 0,
                    yOffset: 0,
                    xScale: 1,
                    yScale: 1
                }
            }
        }),
        Bodies.circle(11500 + 3 * 500, 550, 125, {
            isStatic: true,
            render: {
                lineWidth: 1,
                sprite: {
                    texture: utag,
                    xOffset: 0,
                    yOffset: 0,
                    xScale: 1,
                    yScale: 1
                }
            }
        }),
        buildMap.createPlatform(13200, 580, 1000, 10), // H Floor
        buildMap.createPlatform(14200, 580, 10, 1000), // V Floor

        Bodies.rectangle(13300 + 393 / 2 * 0.5, 570 - 117 / 2 * 0.5, 393 * 0.5, 117 * 0.5, {
            isStatic: true,
            isSensor: true,
            bodyType: "checkpoint",
            isFinal: true,
            render: {
                lineWidth: 1,
                sprite: {
                    texture: final,
                    xOffset: 0,
                    yOffset: 0,
                    xScale: 0.5,
                    yScale: 0.5
                }
            }
        }),

        Bodies.rectangle(13500 + 926 / 2 * 0.4, 570 - 734 / 2 * 0.4, 926 * 0.4, 734 * 0.4, {
            isStatic: true,
            isSensor: true,
            render: {
                lineWidth: 1,
                sprite: {
                    texture: congras,
                    xOffset: 0,
                    yOffset: 0,
                    xScale: 0.4,
                    yScale: 0.4
                }
            }
        }),

    ])
}

buildMap.createPlatform = (x, y, width = 80, height = 10, sprite, collisionFilter) => {
    x += width / 2
    y -= height / 2
    if (sprite != undefined) {
        if (collisionFilter != undefined) {
            return Bodies.rectangle(x, y, width, height, {
                isStatic: true,
                render: {
                    lineWidth: 1,
                    sprite: {
                        texture: sprite.url,
                        xOffset: 0,
                        yOffset: 0,
                        xScale: sprite.xScale,
                        yScale: sprite.yScale
                    }
                },
                collisionFilter: collisionFilter
            })
        }
        return Bodies.rectangle(x, y, width, height, {
            isStatic: true,
            render: {
                lineWidth: 1,
                sprite: {
                    texture: sprite.url,
                    xOffset: 0,
                    yOffset: 0,
                    xScale: sprite.xScale,
                    yScale: sprite.yScale
                }
            },
        })

    }
    return Bodies.rectangle(x, y, width, height, { isStatic: true })
}

buildMap.createBouncyPlatform = (x, y, width = 80, height = 10, fspring = 0, sprite) => {
    x += width / 2
    y -= height / 2
    if (sprite != undefined) {
        return Bodies.rectangle(x, y, width, height, {
            isStatic: true,
            bodyType: "spring", fspring: fspring,
            render: {
                lineWidth: 1,
                fillStyle: "orange",
                sprite: {
                    texture: sprite.url,
                    xOffset: 0,
                    yOffset: 0,
                    xScale: sprite.xScale,
                    yScale: sprite.yScale
                }
            },
        })

    }
    return Bodies.rectangle(x, y, width, height, {
        isStatic: true, bodyType: "spring", fspring: fspring,
        render: {
            fillStyle: "orange"
        }
    })
}

buildMap.createBox = (x, y, width = 50, height = 50) => {
    x += width / 2
    y -= height / 2
    return Bodies.rectangle(x, y, width, height, {
        render:{
            fillStyle:"gray"
        },
        isStatic:true
    })
}

buildMap.createQuestion = (x, y, q, a) => {
    var question = Bodies.rectangle(x+106*0.5, y-50, 106*0.5, 100, {
        isSensor: true,
        isStatic: true,
        bodyType: "question",
        question: q,
        answer: a,
        answered: false,
        render: {
            sprite: {
                texture: questionURL,
                xOffset: 0,
                yOffset: -0.4,
                xScale: 0.5,
                yScale: 0.5
            }
        }
    })
    return question
}

export default buildMap