const numbers = [5, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 22, 24, 16, 33, 1, 20, 14, 31, 9, 0, 18, 29, 7, 28, 12, 35, 3, 26];
const rouletteWheel = document.querySelector('.numbers-container');

// Voeg nummers toe en plaats ze op de juiste positie
numbers.forEach((number, index) => {
    const numberDiv = document.createElement('div');
    numberDiv.classList.add('number');
    numberDiv.innerText = number;

    // Bepaal de hoek voor elk nummer
    const angle = (index / numbers.length) * 360;
    numberDiv.style.transform = `rotate(${angle+3}deg) translate(175px) rotate(-${angle+3}deg)`;

    rouletteWheel.appendChild(numberDiv);
});
