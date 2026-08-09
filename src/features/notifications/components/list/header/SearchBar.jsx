import "./SearchBar.css";

import { Search } from "lucide-react";

export default function SearchBar({

    keyword = "",

    onChange,

    placeholder = "Tìm tiêu đề hoặc mã thông báo..."

}){

    return(

        <div className="search-bar">

            <Search
                size={18}
                className="search-icon"
            />

            <input

                type="text"

                value={keyword}

                placeholder={placeholder}

                onChange={(e)=>onChange?.(e.target.value)}

            />

        </div>

    );

}