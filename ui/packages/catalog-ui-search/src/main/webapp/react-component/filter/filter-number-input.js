import React, {useState, useEffect} from 'react'


const NumberInput = (props) => {
    const [value, setValue] = useState(props.value || '')

    useEffect(()=> {
        props.onChange(value)
    }, [value])

    return <input type='number' value={value} onChange={e=> setValue(e.target.value)} />
}

export default NumberInput