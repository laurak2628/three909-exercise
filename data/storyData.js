const pronounOptions = {
she: {
    subject: "she",
    object: "her",
    possessive: "her",
    reflexive: "herself",
    be: "was",
    have: "has"
},
he: {
    subject: "he",
    object: "him",
    possessive: "his",
    reflexive: "himself",
    be: "was",
    have: "has"
},
they: {
    subject: "they",
    object: "them",
    possessive: "their",
    reflexive: "themselves",
    be: "were",
    have: "have"
}};

const storyOpenings = {
    romance: {
        "coffee shop": (c) => [
            `${c.name} had visited the little coffee shop every morning for months. 
            It was a comfortable part of ${c.selectedPronouns.possessive} routine, a place where the smell of fresh coffee and the quiet morning chatter made the world feel a little less overwhelming. 
            But today, a handwritten note had been left beside ${c.selectedPronouns.possessive} usual cup. It contained just one sentence: "I've been wanting to meet you for a while."`,

            `Across the room, a stranger glanced in ${c.selectedPronouns.possessive} direction.
            Whoever had left the note was clearly nearby, but approaching a complete stranger was not exactly part of the morning plan. 
            Before ${c.name} could decide what to do, the stranger stood up and started walking toward ${c.name}'s table.`
        ],
    },

    mystery: {
        "abandoned carnival": (c) => [
            `${c.name} had heard the stories about the abandoned carnival for years. 
            Locals claimed the rides sometimes moved on their own, even though the power had been disconnected decades ago. 
            Most people laughed off the rumours, but tonight, a faint light flickered behind the rusted entrance gates.`,

            `Against ${c.selectedPronouns.possessive} better judgment, ${c.name} stepped closer.
            Beyond the gates, the old carousel had begun turning slowly, accompanied by music that sounded like it was coming from nowhere. 
            Then something appeared on the ticket booth window, written from the inside. One word. One name. ${c.name}`
        ],
    },

    dystopian: {
        "underground city": (c) => [
            `${c.name} had spent ${c.selectedPronouns.possessive} entire life beneath the surface. 
            In the underground city, every resource was measured, every citizen had an assigned role, and questioning the system was considered dangerous. 
            People were taught that the world above was unlivable. Nobody was supposed to wonder what lay beyond the sealed gates.`,

            `During an ordinary shift, ${c.name} discovered a maintenance panel that had been deliberately hidden. 
            Behind it sat a message from someone claiming to live on the surface.
            The message ended with a warning: "They know what you've found. Do not report this to the authorities."`
        ],
    },

    fantasy:{
        "enchanted forest": (c) => [
        `${c.name} had always been warned to stay away from the Enchanted Forest. 
        The villagers spoke of trees that whispered, creatures that appeared only beneath the moonlight and magic that could change a person's fate forever. 
        But when a strange green light began glowing beyond the village gates, ${c.selectedPronouns.possessive} curiosity became impossible to ignore.`,

        `Carrying nothing but a small lantern, ${c.name} stepped beneath the ancient branches. 
        The forest seemed to come alive around ${c.selectedPronouns.object}, and a faint voice called out from somewhere in the darkness. 
        Before ${c.name} could turn back, glowing symbols appeared across the trees. They formed a message that made ${c.selectedPronouns.subject} freeze: "The last Spellkeeper has returned."`
        ],
    }
};

const storyTitles = {
    romance: {
        "coffee shop": [
            "The Space Between Sips", 
            "One More Cup with You",
            "A Table for Two"
        ],
    },

    mystery: {
        "abandoned carnival": [
            "The Carnival After Dark",
            "The Last Ride",
            "Secrets Behind the Gates"
        ],
    },

    dystopian: {
        "underground city": [
            "Beneath the Last Sky",
            "The World Below",
            "Beyond the Sealed Gates"
        ],
    },
    
    fantasy:{
        "enchanted forest": [
            "The Forest of Forgotten Magic", 
            "Where the Stars Take Root",
            "The Last Spellkeeper"
        ]
    }
};

module.exports = {
    pronounOptions,
    storyOpenings,
    storyTitles
};