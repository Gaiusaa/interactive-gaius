// Variables
let objects = { // HTML Elements
    box: document.getElementById("box"),
    textBox: document.getElementById("messageContent"),
    choiceBox: document.getElementById("choiceBox"),
    blackout: document.getElementById("blackout"),
    blackoutText: document.getElementById("blackoutText"),
    continueButton: document.getElementById("continue"),
    yesButton: document.getElementById("yes"),
    noButton: document.getElementById("no"),
    infoDiv: document.getElementById("info")
};

let typeTime = 2000 // Amount of time the typewriter effect takes per line
let health = 35; // Mental health, determines outcomes of special events. 1 - 100
let canPrompt = true; // Determines whether or not the user can go forward with the dialogue
let canChoose = false; // Determines whether or not the user can make a choice
let currentDialogue = "bedroom"; // Which dialogue is currently in play
let currentLine = 0; // Which line the dialogue is on
let dayComplete = false; // Determiner for loop which controls the logic for the day
let waiting = false; // Holds functions in check while waiting
let eventToBeChosen;
let specialEvent = "friend"; // The current special event of the day
let specialTextTime = 5000; // How long text regarding the special event is displayed
let currentDay = "monday"; // Tracks the current day
let currentApartment = "apartment1" // Which apartment graphic should be used later in the story

let backgrounds = { // Directories to each background graphic
    "bedroom": "../Design/Background/Bedroom.png",
    "apartment1": "../Design/Background/Apartment_Trash.png",
    "apartment2": "../Design/Background/Apartment_Clean.png",
    "work": "../Design/Background/Work.png",
    "outside": "../Design/Background/Outside.png",
};
let curtainTimes = { // Time each action of the curtain function uses
    "close": 50,
    "idle": 3000,
    "open": 50
};
let routes = { // Routes for where the user can go while being in x location
    "bedroom": ["apartment1", "bedroom"],
    "apartment": ["work", "apartment2"],
    "work": ["outside", "work"],
    "outside": ["apartment2"],
};
let requirements = { // Determines the minimum mental state the user needs to complete events
    "takeout": 35,
    "party": 50,
    "appointment": 50,
    "church": 55,
    "shopping": 60,
    "standup": 80,
    "friend": 85,
    "health": 90,
};
let events = { // Functions for all events in the story
    // Regular events
    "bed": function(check) {
        if (check === true) { // User performs action
            curtains("apartment1");
            currentDialogue = "apartment";
            currentLine = 0;

        } else { // User does not perform action
            let value = specialEvent;
            switch(value) {
                case "takeout":
                    specialEvent = "party";
                    break;
                case "party":
                    specialEvent = "appointment";
                     break;
                case "appointment":
                    specialEvent = "church";
                    break;
                case "church":
                    specialEvent = "shopping";
                    break;
                case "shopping":
                    specialEvent = "standup";
                    break;
                case "standup":
                    specialEvent = "friend";
                    break;
                case "friend":
                    specialEvent = "health";
                    break;
                default:
                    events["health"]();
            }

            health -= 15;
            curtains("bedroom");
            currentDialogue = "bedroom";
            currentLine = 0;
        }
    },
    "clean": function(check) {
        if (check === true) {
            health -= 5;
            curtains("apartment1");
            currentDialogue = "apartment";
            currentLine = 3;
        } else {
            health += 5;
            curtains("apartment2");
            currentApartment = "apartment2"
            currentDialogue = "apartment";
            currentLine = 3;
        }
    },
    "work": function(check) {
        if (check === true) {
            health += 5;
            curtains("work");
            currentDialogue = "work";
            currentLine = 0;
        } else {
            health -= 5;
            curtains("apartment2");
            currentDialogue = specialEvent; // Special dialogue/function must be triggered here
            currentLine = 0;
        }
    },
    "outside": function(check) {
        if (check === true) {
            curtains("outside");
            currentDialogue = "outside";
            currentLine = 0;
        } else {
            curtains("apartment2");
            currentDialogue = specialEvent; // Special dialogue/function must be triggered here
            currentLine = 0;
        } 
    },
    "help": function(check) {
        if (check === true) {
            health -= 5;
            currentDialogue = "outside2";
            currentLine = 0;
        } else {
            health -= 5;
            currentDialogue = "outside";
            currentLine = 11;
        } 
    },

    // Special events
    "takeout": function(check) {
        canPrompt = false;
        objects.blackout.style.opacity = 100
        currentDialogue = "bedroom";
        currentLine = 0;
        specialEvent = "party";
        currentDay = "tuesday";
        
        if (check === true) {
            objects.blackoutText.innerHTML = "You decided to have takeout";

            if (health >= requirements["takeout"]) { // User meets mental requirement
                health += 5;
                eventFunction("Your mental health and confidence is high enough and you successfully ordered takeout", "Although difficult, you found this experience to be beneficial and good practice")
            } else { // User does not meet mental requirement
                health -= 5;
                eventFunction("Unfortunately, you did not have it in you to go through with this", "You spent the rest of the night in your room, feeling bad")
            }
        } else {
            health -= 5;
            eventFunction("You decided to not have takeout", "Although you feel safe, there is a feeling of sadness and regret that you did not try")
        }
    },
    "party": function(check) {
        canPrompt = false;
        objects.blackout.style.opacity = 100
        currentDialogue = "bedroom";
        currentLine = 0;
        specialEvent = "appointment"
        currentDay = "wednesday";

        if (check === true) {
            objects.blackoutText.innerHTML = "You decided to go to the party"

            if (health >= requirements["party"]) {
                health += 5;
                eventFunction("Your mental health and confidence is high enough and you enjoyed yourself", "There were many moments where you almost panicked and lost hope, but you held your head up high");
            } else {
                health -= 5;
                eventFunction("Unfortunately, you did not have it in you to go through with this", "You left the party in a hurry, barely being able to sense what was going on around you");
            }
        } else {
            health += 5;
            eventFunction("You decided to not to go to the party", "At first, there was some regret, but then you thought about it and came to the conclusion that this was too soon for you")    
        }
    },
    "appointment": function(check) {
        canPrompt = false;
        objects.blackout.style.opacity = 100
        currentDialogue = "bedroom";
        currentLine = 0; 
        specialEvent = "church"
        currentDay = "thursday";

        if (check === true) {
            objects.blackoutText.innerHTML = "You decided to go to the doctor"

            if (health >= requirements["appointment"]) {
                health += 5;
                eventFunction("Your mental health and confidence is high enough and you went through with the appointment", "The waiting time was difficult and eerie, but you managed and learned that there was nothing wrong with you");
            } else {
                health -= 5;
                eventFunction("Unfortunately, you did not have it in you to go through with this", "Before you could even sit down, you got shivers down your spine and pretended like you got a text message and had to leave in a hurry");
            }
        } else {
            health -= 5;
            eventFunction("You decided to not to see the doctor", "You sent a message apologising and asking for a new appointment. You feel bad for not giving it a try");
        }
    },
    "church": function(check) {
        canPrompt = false;
        objects.blackout.style.opacity = 100
        currentDialogue = "bedroom";
        currentLine = 0;
        specialEvent = "shopping"
        currentDay = "friday";

        if (check === true) {
            objects.blackoutText.innerHTML = "You decided to go to the church"

            if (health >= requirements["church"]) {
                health += 5;
                eventFunction("Your mental health and confidence is high enough and you quietly enjoyed your time", "You spoke to a few people, even though it was difficult. You returned home with a slight smile on your face");
            } else {
                health -= 5;
                eventFunction("Unfortunately, you did not have it in you to go through with this", "People sat around you, making conversation with each other. It was too much for you to handle and you quickly got up and left");
            }
        } else {
            health -= 5;
            eventFunction("You decided to not to to church", "You sat on your couch and watched TV, eventually stumbling upon a live stream of the church. It made you feel sad that you did not go");
        }
    },
    "shopping": function(check) {
        canPrompt = false;
        objects.blackout.style.opacity = 100
        currentDialogue = "bedroom";
        currentLine = 0;
        specialEvent = "standup"
        currentDay = "saturday";

        if (check === true) {
            objects.blackoutText.innerHTML = "You decided to go to the church"

            if (health >= requirements["church"]) {
                health += 5;
                eventFunction("Your mental health and confidence is high enough and you quietly enjoyed your time", "You spoke to a few people, even though it was difficult. You returned home with a slight smile on your face");
            } else {
                health -= 5;
                eventFunction("Unfortunately, you did not have it in you to go through with this", "People sat around you, making conversation with each other. It was too much for you to handle and you quickly got up and left");
            }
        } else {
            health -= 5;
            eventFunction("You decided to not to to church", "You sat on your couch and watched TV, eventually stumbling upon a live stream of the church. It made you feel sad that you did not go");
        }
    },
    "standup": function(check) {
        canPrompt = false;
        objects.blackout.style.opacity = 100
        currentDialogue = "bedroom";
        currentLine = 0;
        specialEvent = "friend"
        currentDay = "sunday";

        if (check === true) {
            objects.blackoutText.innerHTML = "You decided to go to the club and try standup"

            if (health >= requirements["standup"]) {
                health += 5;
                eventFunction("Your mental health and confidence is high enough and you had fun cracking some jokes", "At first, you felt very akward, but eventually you started seeing the room from a different perspective");
            } else {
                health -= 5;
                eventFunction("Unfortunately, you did not have it in you to go through with this", "You could not keep your compoesure on the stage and left before you could finish your joke");
            }
        } else {
            health -= 5;
            eventFunction("You decided to not try standup", "You stayed home and scrolled through social media on your phone. You saw a lot of funny posts and laughed, reminding you of what you missed out on");
        }
    },
    "friend": function(check) {
        canPrompt = false;
        objects.blackout.style.opacity = 100
        currentDialogue = "bedroom";
        currentLine = 0;
        specialEvent = "health"
        currentDay = "monday";

        if (check === true) {
            objects.blackoutText.innerHTML = "You decided to go to the cafe and tried starting a conversation"

            if (health >= requirements["standup"]) {
                health += 5;
                eventFunction("Your mental health and confidence is high enough and you had talked with the person", "Striking up the conversation was challenging, but you pushed through and had fun. Eventually exchanging contacts", true);
            } else {
                health -= 5;
                eventFunction("Unfortunately, you did not have it in you to go through with this", "They noticed you were anxious and tried to calm you down, but you could not take it and left quickly", true);
            }
        } else {
            health -= 5;
            eventFunction("You decided to not strike up a conversation at the cafe", "Instead, you binge-watched a new show you recently found online", true);
        }
    },
    "health": function() {
        console.log("Health function");
        canPrompt = false;
        objects.blackout.style.opacity = 100
        currentDialogue = "bedroom";
        currentLine = 0;
        specialEvent = "takeout"

        objects.blackoutText.innerHTML = "You are standing in front of the mirror in your bathroom, reflecting on the past week"

        if (health >= requirements["health"]) {
            eventFunction("You consider the past week to have been a great experience for you, coming out of your shelf", "You leave the bathroom with a smile on your face, you feel more confident than ever and ready for the future", true);
        } else {
            eventFunction("Staring into the mirror, you think of everything that has happened with a bitter taste in your mouth", "You try to convince yourself that this has been a good week, with a lot of progress. But you cannot shake off the feeling of more anxiety washing over you", true);
        }
    },
};
let dialogue = { // Dialogue for each event
    "bedroom": [
        "...",
        "Yet another day, eh?",
        `Yet another ${currentDay}...`,
        "Same old stuff, I reckon",
        "Got things to do today... But at the same time...",
    ],
    "apartment": [
        "Ah...",
        "Right, I said I'd clean later... Naturally",
        "It's starting to pile up a bit, perhaps I should do something about that",
        "Well, now that's sorted... I do have a shift today",
        "It's been a while since I called in sick, I don't think they'd mind much if I'm gone today"
    ],
    "work": [
        "Ugh, work is so boring today, nothing but mindlessly scrolling through dozens of pages for information",
        "Suppose I'm done now, actually",
        "But at the same time... What's the point in leaving? There's not much for me at home either",
        "What to do...",
    ],
    "outside": [
        "Well, that wasn't exactly fulfilling, but not a waste of time either, how peculiar",
        "At least the night is pretty, I suppose a little stroll makes it all worth it sometimes",
        "[Stranger] Excuse me",
        "Huh?",
        "[Stranger] I seem to be a little lost... Could you please show me the directions to this building on my phone?",
        "...",
        "Uhh",
        "[Stranger] Are you alright...?",
        "I... um",
        "Y-uhm",
        "[Stranger] It's okay... I can just ask someone else if you don't know",
        "N-no... It's fine, it's that way I think",
        "[Stranger] Ah, alright then. Thank you!",
        "Yeah... No problem",
        "...",
        "Well, that was a complete failure of a conversation",
        "But at least I spoke to someone...",
    ],
    "outside2": [
        "S-sorry... I don't really know",
        "[Stranger] Oh... That's alright",
        "[Stranger] You know what they say",
        "What do you mean?",
        "[Stranger] 'Success is not about how many times you fall, but how many times you rise after each fall. Keep pushing forward, for perseverance is the key to unlocking your greatest achievements'",
        "Oh... Right",
        "[Stranger] Yup, thank you for trying, though. I'll see if there are anyone else who can help me",
        "Well, that was a complete failure of a conversation",
        "I can do better than that... Can't I?",
        "Anyway, it is getting late",
        "I should be heading home now"
    ],
    "takeout": [
        "Man, I'm starting to work up an appetite",
        "I haven't really eaten anything today, so I guess that makes sense",
        "There's nothing to eat here, though... Nothing good, at least",
        "Should... Should I try to order something?",
        "It is risky, but I have to eat something sooner or later...",
    ],
    "party": [
        "...",
        "There is a party next door, apparently",
        "I have never been one for those kinds of things... But maybe I should try?",
        "There will be a lot of people, though...",
        "Crowds, loud music, no empty places",
        "But then again, maybe I can meet people",
        "It can't be that bad, right?",
    ],
    "appointment": [
        "Oh...",
        "I forgot that I have a doctor's appointment today",
        "It has been some time since last time I went there...",
        "I don't like going there. Sitting in a chair where everyone can stare at me, waiting to be called in",
        "But... I guess it can be good too",
    ],
    "church": [
        "This is strange",
        "When I got home, there was a letter on my doorstep",
        "It was an invitation to church",
        "I don't know anyone that would want me to go to church... Then again, I don't know anyone",
        "I don't even believe that there is a god, why would he make this my life?",
        "Although, it is a little tempting... I guess it could be better than sitting here the rest of the day"
    ],
    "shopping": [
        "I got a raise earlier today, surprisingly",
        "The boss told me to spend it on something nice for myself",
        "Speaking of shopping, it just got me to remind myself",
        "I am in need of some new shirts and pants, shoppin is like an annual ritual",
        "Of course, a ritual I would rather not partake in...",
        "It has been a while since last time, I guess it could be nice to get something new",
    ],
    "standup": [
        "There is a new club that opened up a couple of blocks nearby...",
        "I always watch videos of it... Sometimes I even laugh",
        "I have always found it rather peculiar, how people can do these things",
        "Just walk up... Say words into the mircophone and have people cheer you on, with no worries at all",
        "It baffles me, really",
        "There's nothing else for me to do today, now that I think about it",
        "Should I really... Give it a try?",
    ],
    "friend": [
        "I must say... This week has been rather interesting",
        "With some goods and bads too",
        "I wish that there was someone who I could share this stuff with...",
        "Well... There is actually someone, maybe",
        "A person who works at the cafe next door, they always smile at me for some reason and talks to all the customers",
        "If I... Went there... Then maybe...",
        "No, I can't do that... Or can I?",
    ],
};

// Functions
function typewriter(line) { // Writes the dialogue
    canPrompt = false;

    setTimeout(function() {
        canPrompt = true;
    }, typeTime);

    let words = line.split('');
    let newLine = [];
    let totalTime = 0;

    for (let word = 0; word < words.length; word += 1) {
        setTimeout(function() {
            newLine.push(words[word]);
            objects.textBox.innerHTML = newLine.join('');
        }, totalTime, line, word);
        totalTime += typeTime / words.length;
    }
}

function curtains(newBackground) { // Switches from scene x to scene y 
    if (backgrounds[newBackground]) {
        canPrompt = false;

        setTimeout(function() {
            canPrompt = true;
        }, 6000);

        for (let trans = 0; trans <= 100; trans += 1) {
            setTimeout(function() {
                objects.blackout.style.opacity = trans / 100;
            }, curtainTimes["close"] * (trans / 5));
        }
        setTimeout(function() {
            objects.box.style.backgroundImage = `url("${backgrounds[newBackground]}")`;

            for (let trans = 100; trans >= 0; trans -= 1) {
                setTimeout(function() {
                    objects. blackout.style.opacity = trans / 100;
                }, curtainTimes["open"] * ((100 - trans) / 5));
            }
        }, curtainTimes["idle"]);
    }
}

function makeChoice(text, event) { // Lets the user make a choice
    canPrompt = false;
    canChoose = true;

    objects.choiceBox.style.opacity = 100;
    objects.yesButton.style.opacity = 100;
    objects.noButton.style.opacity = 100;

    objects.choiceBox.innerHTML = text
}

function eventFunction(...lines) { // Handles the visual in soecial events
    setTimeout(function(){
        objects.blackoutText.innerHTML = lines[0]
        setTimeout(function() {
            objects.blackoutText.innerHTML = lines[1]
            setTimeout(function() {
                if (specialEvent === "health") {
                    console.log("The end");
                    events["health"]();
                } else {
                    curtains("bedroom");
                }           
                objects.blackoutText.innerHTML = ""
            }, specialTextTime);
        }, specialTextTime);
    }, specialTextTime);
}

function day(event) { // Starts the story
    typewriter(dialogue[currentDialogue][currentLine])
    currentLine += 1
}

day();

objects.yesButton.addEventListener("click", function() { // User says makes the decision 'yes'
    if (canChoose === true) {
        events[eventToBeChosen](true)
        canChoose = false;
        objects.choiceBox.style.opacity = 0;
        objects.yesButton.style.opacity = 0;
        objects.noButton.style.opacity = 0;
    }
});

objects.noButton.addEventListener("click", function() { // User makes the decision 'no'
    if (canChoose === true) {
        events[eventToBeChosen](false)
        canChoose = false;
        objects.choiceBox.style.opacity = 0;
        objects.yesButton.style.opacity = 0;
        objects.noButton.style.opacity = 0;
    }
});

objects.continueButton.addEventListener("click", function() { // User continues the dialogue, is presented with a choice or goes to the special events
    if (canPrompt === true && canChoose === false) {
        if (dialogue[currentDialogue][currentLine]) {
            typewriter(dialogue[currentDialogue][currentLine])

            if (currentDialogue === "apartment" && currentLine === 2) {
                makeChoice("The room is getting messy, would you like to leave it to tomorrow?");
                eventToBeChosen = "clean";
            } else if (currentDialogue === "outside" && currentLine === 10) {
                makeChoice("You were startled by the stranger, will you pretend like you can't help them to get out of the conversation?")
                eventToBeChosen = "help";
            } else {
                if (dialogue[currentDialogue][currentLine + 1]) {
                    currentLine += 1;
                } else {
                    //currentLine = 0;
    
                    let value = currentDialogue;
                    switch(value) {
                        case "bedroom":
                            makeChoice("Do you wish to get out of bed and play the day?");
                            eventToBeChosen = "bed";
                            break;
                        case "apartment":
                            makeChoice("Do you wish to leave the apartment and go to work?");
                            eventToBeChosen = "work";
                            break;
                        case "work":
                            makeChoice("Do you wish to stay late rather than going home?");
                            eventToBeChosen = "outside";
                            break;
                        case "outside" || "outside2":
                            curtains(currentApartment);
                            currentDialogue = specialEvent;
                            currentLine = 0;
                            break;
                        case "takeout":
                            makeChoice("Will you try to order takeout?");
                            eventToBeChosen = "takeout";
                            break;
                        case "party":
                            makeChoice("Will you try to attend the party?");
                            eventToBeChosen = "party"
                            break;
                        case "appointment":
                             makeChoice("Will you try to go through with the appointment");
                            eventToBeChosen = "appointment"
                            break;
                        case "church":
                             makeChoice("Will you try to go to church");
                            eventToBeChosen = "church"
                            break;
                        case "shopping":
                            makeChoice("Will you try to go shopping?");
                            eventToBeChosen = "shopping"
                            break;
                        case "standup":
                            makeChoice("Will you try to do standup comedy?");
                            eventToBeChosen = "standup"
                            break;
                        case "friend":
                            makeChoice("Will you try to make a friend?");
                            eventToBeChosen = "friend"
                            break;
                        default: // Safety net for special events, unable to make proper logic
                            curtains(currentApartment);
                            currentDialogue = specialEvent;
                            currentLine = 0;
                    }
                    currentLine = 0;
                }
            }
        }
    }
});