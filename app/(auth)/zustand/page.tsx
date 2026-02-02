'use client'

import {useCounterStore} from "@/(auth)/zustand/_store";

const logCount = () => {
    const count = useCounterStore.getState().count;
    useCounterStore.setState({count: 1})
    useCounterStore.setState((state) => ({count: state.count + 1}));

}

export default function Zustand(){
    const count = useCounterStore((state) => state.count);

    return (
        <div>
            <SomeComponent count={count}></SomeComponent>
        </div>
    )

}

const SomeComponent = ({ count }: {count: number}) => {
    const incrementAsync = useCounterStore((state) => state.incrementAsync);
    const decrement = useCounterStore((state) => state.decrement);


    return (
        <div>
            {count}
            <div>
                <button onClick={incrementAsync}>Increment</button>
                <button onClick={decrement}>Decrement</button>
            </div>
        </div>
    )
}