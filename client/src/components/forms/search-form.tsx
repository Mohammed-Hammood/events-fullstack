
import React, { useState } from "react";
import { InputElement } from "components";
import { useNavigate } from "react-router-dom";

interface Props {
    query: string
    setQuery: (value: string) => void;
    setIsVisible: (value: boolean) => void;
}
export default function SearchForm(props: Props): JSX.Element {
    const { setIsVisible } = props;
    const [inputValue, setInputValue] = useState<string>('');
    const navigate = useNavigate();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (inputValue.trim().length > 0) {
            setIsVisible(false);
            navigate(`/?q=${inputValue}`)
        }
    }
    return (
        <form onSubmit={(e) => handleSubmit(e)} className='container'>
            <div className='section'>
                <label htmlFor='input-contact-search'> </label>
                <InputElement
                    onInput={setInputValue}
                    value={inputValue}
                    maxLength={100}
                    placeholder={'Search events'}
                    autoFocus={true}
                />
            </div>
            <div className='buttons'>
                <button type='submit' className='primary'>{("Search")}</button>
                <button type='button' onClick={() => setIsVisible(false)}>
                    {("Close")}
                </button>
            </div>
        </form>
    )
}