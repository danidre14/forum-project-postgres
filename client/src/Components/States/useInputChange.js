import { useState } from "react";

function useInputChange(states) {
    const [input, setInput] = useState(states);

    const handleInputChange = (e) => setInput({
        ...input,
        [e.currentTarget.name]: e.currentTarget.value
    });

    return [input, handleInputChange, setInput];
}

export default useInputChange;