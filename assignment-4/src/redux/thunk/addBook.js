import { addBook } from "../BookStore/actions";


const addBookThunk = (input) => {

    return async (dispatch, getState) => {
        try{
            const nextIdMaker = (state) => state.reduce((maxID, item) => Math.max(item.id, maxID), -1) + 1;
            const nextId = nextIdMaker(getState())
           
            const response = await fetch("http://localhost:9000/books", {
            method: "POST",
            body: JSON.stringify({...input, id: nextId}),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
        const book = await response.json();

        dispatch(addBook(book));
        }
        catch(err){
            console.log(err)
        }
    };
};

export default addBookThunk;