const getRandomInit = (max: number) => {
    return Math.floor(Math.random() * max);
}

export default function ErrorPage3() {
    // const random = getRandomInit(2);
    // if (random === 1) {
    //     throw new Error("Error in page 3");
    // }
    return <h1>Error 3</h1>;
}