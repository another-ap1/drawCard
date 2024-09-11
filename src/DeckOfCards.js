import React, {useState, useEffect} from "react";
import Card from "./Card";
import axios from "axios";

const DeckOfCards = () => {
    const URL = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);

    useEffect(function getDeckFromAPI(){
        async function getDeck(){
            const res = await axios.get(URL)
            setDeck(res.data)
            
        }
        getDeck();
    },[])
    
    async function drawCard(){
        try{
            const drawRes = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);

            if(drawRes.data.remaining === 0) throw new Error("Deck empty");
            const card = drawRes.data.cards[0];
            setDrawn(c => [
                ...c,
                {
                    id:card.code,
                    name:card.suit+' '+card.value,
                    image:card.image,
                },
            ]);
        } catch(err){
            alert(err);
        }
        
    }
    async function startShuffling(){
        setIsShuffling(true);
        try{
            await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`);
            setDrawn([]);
        }catch(err){
            alert(err);
        }finally {
            setIsShuffling(false);
        }
    }

    function drawButton(){
        if(!deck) return null;

        return(
            <button
            onClick={drawCard}
            disabled={isShuffling}>
                Draw a card!
            </button>
        );
    }
    function shuffleButton(){
        if(!deck) return null;
        return(
            <button
            onClick={startShuffling}
            disabled={isShuffling}>
                Shuffle the Deck
            </button>
        )
    }

    return (
        <div>
            {drawButton()}
            {shuffleButton()}

            <div>
                {drawn.map(c => (
                    <Card key={c.id} name={c.name} image={c.image}/>
                ))}
            </div>
        </div>
    )
}

export default DeckOfCards;