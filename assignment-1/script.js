// Selection of DOM Element 

const deleteBtns = document.querySelectorAll('.lws-delete')
const resetBtn = document.getElementById("resetBtn");
const addAnotherMatchBtn = document.getElementById("addMatchBtn");
const allMatchesContainer = document.getElementById('all-matches-container')

// Actions identifiers
const INCREMENT = "score/increment";
const DECREMENT = "score/decrement";
const RESET = "score/reset";
const DELETEMATCH = "score/matchdelete"
const ADDANOTHERMATCH = "score/addanothermatch";

// Action Creators 
const increment = (payload) =>{
    return {
        type: INCREMENT,
        payload
    }
}
const decrement = (payload) =>{
    return {
        type: DECREMENT,
        payload
    }
}

const reset = ()=>{
    return {
        type: RESET
    }
}

const deletematch = (payload) => {
    return {
        type: DELETEMATCH,
        payload
    }
}

const addMatch = ()=>{
    return {
        type: ADDANOTHERMATCH
    }
}

// Initial State 
const initialState = [
    {
        id: 1,
        score : 0
    },
]

const idGenerator = (arr)=>{
    const maxId = arr.reduce((maxId, match)=>Math.max(maxId, match.id),-1);
    return maxId + 1
}

// Reducer Function 
const scoreReducer = (state = initialState, action) => {
    switch (action.type) {
        case INCREMENT:
           let incrementState =  state.map(item=>{
                if(item.id===action.payload.id){
                    return {
                        ...item, score : item.score + Number(action.payload.value)
                    }
                }else{
                    return item
                }
            })
            return incrementState
            
        case DECREMENT:
            let decState =  state.map(item=>{
                    if(item.id===action.payload.id){
                        const itemScore = item.score - Number(action.payload.value)
                        return {
                            ...item, score : itemScore>=0 ? itemScore : 0
                        }
                    }else{
                        return item
                    }
                })
                return decState;

        case RESET:
           let resetedState = state.map(item=>{
                return {
                    ...item, score: 0
                }
            })
            return resetedState;
        case DELETEMATCH:
            const undeletedmatches = state.filter(item=>item.id !=action.payload)
            return undeletedmatches

        case ADDANOTHERMATCH:
            const newId = idGenerator(state)
            return [
                ...state,
                {
                    id: newId,
                    score:0
                }
            ];
    
        default:
            return state;
    }
}

// Create Store 
const store = Redux.createStore(scoreReducer)


// Button Click Event Listener 

addAnotherMatchBtn.addEventListener('click', ()=>{
    store.dispatch(addMatch())
})

resetBtn.addEventListener('click', ()=>{
    store.dispatch(resetHandler())
})

const incrementHandler = (id, formElm) =>{
    const value = Number(formElm.querySelector('.lws-increment').value)
    store.dispatch(increment({id, value}))
    formElm.querySelector('.lws-increment').innerHTML=""
}

const decrementHandler = (id, formElm)=>{
    const value = Number(formElm.querySelector('.lws-decrement').value)
    store.dispatch(decrement({id, value}))
    formElm.querySelector('.lws-decrement').innerHTML=""

}
const resetHandler = () => {
    store.dispatch(reset())
}

const deletematchHandler = (id) =>{
    store.dispatch(deletematch(id))
}

// Render Function 
const matchHtml = (match) => {
    return  `
    <div class="match">
    <div class="wrapper">
        <button class="lws-delete" onclick = "deletematchHandler(${match.id})">
            <img src="./image/delete.svg" alt="" />
        </button>
        <h3 class="lws-matchName">Match ${match.id}</h3>
    </div>
    <div class="inc-dec">
        <form class="incrementForm" onsubmit = "event.preventDefault(); incrementHandler(${match.id}, this)">
            <h4>Increment</h4>
            <input
                type="number"
                name="increment"
                class="lws-increment"
            />
        </form>
        <form class="decrementForm" onsubmit = "event.preventDefault(); decrementHandler(${match.id}, this)">
            <h4>Decrement</h4>
            <input
                type="number"
                name="decrement"
                class="lws-decrement"
            />
        </form>
    </div>
    <div class="numbers">
        <h2 class="lws-singleResult">${match.score}</h2>
    </div>
    </div>
    `
}


const render = ()=>{
    const state = store.getState();
    let elm = ``
    state.map(match=> elm += matchHtml(match))
    return allMatchesContainer.innerHTML = elm;
}

// update UI initially
render();

store.subscribe(render);
