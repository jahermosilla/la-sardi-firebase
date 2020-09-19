# Structure

{
    users: {
        userId: {
            state: 'PLAYING | WAITING | IDLE'
        },
        
        ...
    },

    games: {
        gameId: {
            owner: 'UserId',
            
            properties: {
                private: true | false,
                token: 'TOKEN FOR JOINING'
            },

            state: {
                deck: [Card1, Card2, ...],

                turn: userId1,

                cardsPlayed: [Card1, Card2],

                direction: 'Clockwise | Counterclockwise',

                acc: 6
            },

            players: {
                userId: {
                    hand: [Card1, Card2, ...]
                },

                ...
            }


            
        },

        ...
    }

}