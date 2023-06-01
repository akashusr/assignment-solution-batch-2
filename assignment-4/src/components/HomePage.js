import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fetchBooks from "../redux/thunk/fetchBooks";
import Header from "./Header";
import InputForm from "./InputForm";
import SingleBook from "./SingleBook";


export default function HomePage() {
    const [isUpdate, setIsUpdate] = useState(false);
    const [filterFeatured, setFilterFeatured] = useState(false)
    const dispatch = useDispatch()
    const books = useSelector(state => state)

    const [searchText, onSearch] = useState("")

    // Load books
    useEffect(() => {
        dispatch(fetchBooks)
    }, [dispatch])


    // feature filter 
    const featureFilterHandler = (item)=>{
        if (filterFeatured) {
            return item.featured
        } else {
            return true
        }
    }

    // search filter 
    const searchFilterHandler = (item)=>{
        if(searchText){
            return item.name.toLowerCase().includes(searchText?.toLowerCase())
            }else{
                return true
            }
    }
    return (
        <>
            <Header onSearch={onSearch} />
            <main className="py-12 2xl:px-6">
                <div className="container grid xl:grid-cols-[auto_350px] 2xl:grid-cols-[auto_400px] gap-4 2xl:gap-8">
                    <div className="order-2 xl:-order-1">
                        <div className="flex items-center justify-between mb-12">
                            <h4 className="mt-2 text-xl font-bold">Book List</h4>

                            <div className="flex items-center space-x-4">
                                <button onClick={() => setFilterFeatured(false)} className="filter-btn active-filter" id="lws-filterAll">All</button>
                                <button onClick={() => setFilterFeatured(true)} className="filter-btn" id="lws-filterFeatured">Featured</button>
                            </div>
                        </div>
                        <div className="lws-bookContainer">
                            {books.length >= 1 ?
                                books
                                    .filter(searchFilterHandler)
                                    .filter(featureFilterHandler)
                                    .map(item => <SingleBook setIsUpdate={setIsUpdate} key={item.id} book={item} />) :
                                "No Book Found"
                            }

                        </div>
                    </div>
                    <InputForm isUpdate={isUpdate} setIsUpdate={setIsUpdate} />
                </div>
            </main>
        </>
    )
};