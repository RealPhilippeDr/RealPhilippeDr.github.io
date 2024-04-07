// rscript.js

let myChart; // Define myChart globally for chart manipulation
let rotationDegree = 0; // Initialize the degree of rotation for the background gradient

// Rotate the background gradient continuously
setInterval(function() {
    // Increment rotationDegree by 1 and keep it within the range of 0 to 359
    rotationDegree = (rotationDegree + 1) % 360;
    // Apply the background gradient with the updated rotation degree
    document.body.style.background = `linear-gradient(${rotationDegree}deg, #000000 0%, #313131 100%)`;
}, 150); // Change every 150 milliseconds

// Fetch the stock data for one day and graph it
async function fetchStockDataForOneDay() {
    const symbol = document.getElementById('stockSymbol').value.toUpperCase();
    // Exit the function early if the symbol is empty to save API credits
    if (symbol.trim() === '') {
        return;
    }

    // Call the updateLogo function when needed, passing the stock symbol as an argument
    updateLogo(symbol);

    const historicalUrl = `https://${rConfig.rapidAPIHost}/api/v1/historical/stock?interval=${rConfig.intervals.fiveDays}&symbol=${symbol}`;
    const realtimeUrl = `https://${rConfig.rapidAPIHost}/api/v1/realtime/stock?symbols=${symbol}`;
    const options = getFetchOptions();

    // Display loading timer
    const loadingTimer = document.getElementById('loadingTimer');
    loadingTimer.style.display = 'block';

    // Display loading timer in the bottom left corner
    const loadingTime = document.getElementById('loadingTime');
    const loadingStartTime = Date.now();

    // Start the timer
    let startTime = Date.now();
    const timerInterval = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000; // Calculate elapsed time in seconds
        loadingTimer.innerText = `Laden... ${elapsedTime.toFixed(2)}s`; // Display elapsed time with 2 decimal places
    }, 10); // Update every 10 milliseconds

    try {
        // Fetch historical data for the chart
        const historicalResponse = await fetch(historicalUrl, options);

        if (historicalResponse.status === 404) {
            throw new Error('Stock not found');
        }

        // Check if the response status is 429 (Too Many Requests)
        if (historicalResponse.status === 429) {
            document.getElementById('errorMessage').innerText = 'API Requests Exceeded. Please try again later.';
            return; // Exit the function early
        }

        const historicalData = await historicalResponse.json();

        // Get today's date in the format "YYYY-MM-DD"
        const today = new Date().toISOString().split('T')[0];

        // Get date 5 days ago in the format "YYYY-MM-DD"
        const fiveDaysAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Filter historical data for the last 5 days
        const filteredData = historicalData.filter(item => item.date.split(' ')[0] >= fiveDaysAgo && item.date.split(' ')[0] <= today);

        const timestamps = filteredData.map(item => item.date);
        const closePrices = filteredData.map(item => parseFloat(item.close));

        // Reverse the stock arrays (Reverse how the graph is displayed)
        reverseArrays([timestamps, closePrices]);

        // Calculate stock progress
        const initialPrice = closePrices[0];
        const currentPrice = closePrices[closePrices.length - 1];
        const progress = currentPrice - initialPrice;
        const progressPercentage = ((currentPrice - initialPrice) / initialPrice) * 100;

        // Display the stocks progress using the function
        displayProgress(progress, progressPercentage);

        // Show the stock progress information
        document.getElementById('stockProgress').style.display = 'block';

        // Destroy the existing stock chart
        destroyChart(myChart);

        // Creating a new stock Chart
        myChart = createChart(timestamps, closePrices, symbol);

        // Fetch realtime data for the current price
        await fetchAndUpdateRealtimeData(realtimeUrl, options);

        // Hide the loading timer
        loadingTimer.style.display = 'none';
        clearInterval(timerInterval); // Stop the timer interval
        const loadingEndTime = Date.now();
        const loadingTimeInSeconds = (loadingEndTime - loadingStartTime) / 1000;
        loadingTime.innerText = `Ladezeit: ${loadingTimeInSeconds.toFixed(2)}s`; // Display loading time in the bottom left corner
    } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors...
        clearInterval(timerInterval); // Stop the timer interval in case of error
        loadingTime.style.display = 'none'; // Hide the loading timer
    }
}

// Fetch the stock data for five days and graph it
async function fetchStockDataForFiveDays() {
    const symbol = document.getElementById('stockSymbol').value.toUpperCase();
    // Exit the function early if the symbol is empty to save API credits
    if (symbol.trim() === '') {
        return;
    }

    // Call the updateLogo function when needed, passing the stock symbol as an argument
    updateLogo(symbol);

    const historicalUrl = `https://${rConfig.rapidAPIHost}/api/v1/historical/stock?interval=${rConfig.intervals.fiveDays}&symbol=${symbol}`;
    const realtimeUrl = `https://${rConfig.rapidAPIHost}/api/v1/realtime/stock?symbols=${symbol}`;
    const options = getFetchOptions();

    // Display loading timer
    const loadingTimer = document.getElementById('loadingTimer');
    loadingTimer.style.display = 'block';

    // Display loading timer in the bottom left corner
    const loadingTime = document.getElementById('loadingTime');
    const loadingStartTime = Date.now();

    // Start the timer
    let startTime = Date.now();
    const timerInterval = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000; // Calculate elapsed time in seconds
        loadingTimer.innerText = `Laden... ${elapsedTime.toFixed(2)}s`; // Display elapsed time with 2 decimal places
    }, 10); // Update every 10 milliseconds

    try {
        // Fetch historical data for the chart
        const historicalResponse = await fetch(historicalUrl, options);

        if (historicalResponse.status === 404) {
            throw new Error('Stock not found');
        }

        // Check if the response status is 429 (Too Many Requests)
        if (historicalResponse.status === 429) {
            document.getElementById('errorMessage').innerText = 'API Requests Exceeded. Please try again later.';
            return; // Exit the function early
        }

        const historicalData = await historicalResponse.json();

        // Get today's date in the format "YYYY-MM-DD"
        const today = new Date().toISOString().split('T')[0];

        // Get date 5 days ago in the format "YYYY-MM-DD"
        const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Filter historical data for the last 5 days
        const filteredData = historicalData.filter(item => item.date.split(' ')[0] >= fiveDaysAgo && item.date.split(' ')[0] <= today);

        const timestamps = filteredData.map(item => item.date);
        const closePrices = filteredData.map(item => parseFloat(item.close));

        // Reverse the stock arrays (Reverse how the graph is displayed)
        reverseArrays([timestamps, closePrices]);

        // Calculate stock progress
        const initialPrice = closePrices[0];
        const currentPrice = closePrices[closePrices.length - 1];
        const progress = currentPrice - initialPrice;
        const progressPercentage = ((currentPrice - initialPrice) / initialPrice) * 100;

        // Display the stocks progress using the function
        displayProgress(progress, progressPercentage);

        // Show the stock progress information
        document.getElementById('stockProgress').style.display = 'block';

        // Destroy the existing stock chart
        destroyChart(myChart);

        // Creating a new stock Chart
        myChart = createChart(timestamps, closePrices, symbol);

        // Fetch realtime data for the current price
        await fetchAndUpdateRealtimeData(realtimeUrl, options);

        // Hide the loading timer
        loadingTimer.style.display = 'none';
        clearInterval(timerInterval); // Stop the timer interval
        const loadingEndTime = Date.now();
        const loadingTimeInSeconds = (loadingEndTime - loadingStartTime) / 1000;
        loadingTime.innerText = `Ladezeit: ${loadingTimeInSeconds.toFixed(2)}s`; // Display loading time in the bottom left corner
    } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors...
        clearInterval(timerInterval); // Stop the timer interval in case of error
        loadingTime.style.display = 'none'; // Hide the loading timer
    }
}

// Fetch the stock data for one month and graph it
async function fetchStockDataForOneMonth() {
    const symbol = document.getElementById('stockSymbol').value.toUpperCase();
    // Exit the function early if the symbol is empty to save API credits
    if (symbol.trim() === '') {
        return;
    }

    // Call the updateLogo function when needed, passing the stock symbol as an argument
    updateLogo(symbol);

    const historicalUrl = `https://${rConfig.rapidAPIHost}/api/v1/historical/stock?interval=${rConfig.intervals.oneMonth}&symbol=${symbol}`;
    const realtimeUrl = `https://${rConfig.rapidAPIHost}/api/v1/realtime/stock?symbols=${symbol}`;
    const options = getFetchOptions();

    // Display loading timer
    const loadingTimer = document.getElementById('loadingTimer');
    loadingTimer.style.display = 'block';

    // Display loading timer in the bottom left corner
    const loadingTime = document.getElementById('loadingTime');
    const loadingStartTime = Date.now();

    // Start the timer
    let startTime = Date.now();
    const timerInterval = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000; // Calculate elapsed time in seconds
        loadingTimer.innerText = `Laden... ${elapsedTime.toFixed(2)}s`; // Display elapsed time with 2 decimal places
    }, 10); // Update every 10 milliseconds

    try {
        // Fetch historical data for the chart
        const historicalResponse = await fetch(historicalUrl, options);

        if (historicalResponse.status === 404) {
            throw new Error('Stock not found');
        }

        // Check if the response status is 429 (Too Many Requests)
        if (historicalResponse.status === 429) {
            document.getElementById('errorMessage').innerText = 'API Requests Exceeded. Please try again later.';
            return; // Exit the function early
        }

        const historicalData = await historicalResponse.json();

        // Get today's date in the format "YYYY-MM-DD"
        const today = new Date().toISOString().split('T')[0];

        // Filter historical data for the last month
        const oneMonthAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const filteredData = historicalData.filter(item => item.date.split(' ')[0] >= oneMonthAgo && item.date.split(' ')[0] <= today);

        const timestamps = filteredData.map(item => item.date);
        const closePrices = filteredData.map(item => parseFloat(item.close));

        // Reverse the stock arrays (Reverse how the graph is displayed)
        reverseArrays([timestamps, closePrices]);

        // Calculate stock progress
        const initialPrice = closePrices[0];
        const currentPrice = closePrices[closePrices.length - 1];
        const progress = currentPrice - initialPrice;
        const progressPercentage = ((currentPrice - initialPrice) / initialPrice) * 100;

        // Display the stocks progress using the function
        displayProgress(progress, progressPercentage);

        // Show the stock progress information
        document.getElementById('stockProgress').style.display = 'block';

        // Destroy the existing stock chart
        destroyChart(myChart);

        // Creating a new stock Chart
        myChart = createChart(timestamps, closePrices, symbol);

        // Fetch realtime data for the current price
        await fetchAndUpdateRealtimeData(realtimeUrl, options);

        // Hide the loading timer
        loadingTimer.style.display = 'none';
        clearInterval(timerInterval); // Stop the timer interval
        const loadingEndTime = Date.now();
        const loadingTimeInSeconds = (loadingEndTime - loadingStartTime) / 1000;
        loadingTime.innerText = `Ladezeit: ${loadingTimeInSeconds.toFixed(2)}s`; // Display loading time in the bottom left corner
    } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors...
        clearInterval(timerInterval); // Stop the timer interval in case of error
        loadingTime.style.display = 'none'; // Hide the loading timer
    }
}

// Fetch the stock data for six months and graph it
async function fetchStockDataForSixMonths() {
    const symbol = document.getElementById('stockSymbol').value.toUpperCase();
    // Exit the function early if the symbol is empty to save API credits
    if (symbol.trim() === '') {
        return;
    }

    // Call the updateLogo function when needed, passing the stock symbol as an argument
    updateLogo(symbol);

    const historicalUrl = `https://${rConfig.rapidAPIHost}/api/v1/historical/stock?interval=${rConfig.intervals.sixMonths}&symbol=${symbol}`;
    const realtimeUrl = `https://${rConfig.rapidAPIHost}/api/v1/realtime/stock?symbols=${symbol}`;
    const options = getFetchOptions();

    // Display loading timer
    const loadingTimer = document.getElementById('loadingTimer');
    loadingTimer.style.display = 'block';

    // Display loading timer in the bottom left corner
    const loadingTime = document.getElementById('loadingTime');
    const loadingStartTime = Date.now();

    // Start the timer
    let startTime = Date.now();
    const timerInterval = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000; // Calculate elapsed time in seconds
        loadingTimer.innerText = `Laden... ${elapsedTime.toFixed(2)}s`; // Display elapsed time with 2 decimal places
    }, 10); // Update every 10 milliseconds

    try {
        // Fetch historical data for the chart
        const historicalResponse = await fetch(historicalUrl, options);

        if (historicalResponse.status === 404) {
            throw new Error('Stock not found');
        }

        // Check if the response status is 429 (Too Many Requests)
        if (historicalResponse.status === 429) {
            document.getElementById('errorMessage').innerText = 'API Requests Exceeded. Please try again later.';
            return; // Exit the function early
        }

        const historicalData = await historicalResponse.json();

        // Get today's date in the format "YYYY-MM-DD"
        const today = new Date().toISOString().split('T')[0];

        // Filter historical data for the last six months
        const sixMonthsAgo = new Date(new Date() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const filteredData = historicalData.filter(item => item.date.split(' ')[0] >= sixMonthsAgo && item.date.split(' ')[0] <= today);

        const timestamps = filteredData.map(item => item.date);
        const closePrices = filteredData.map(item => parseFloat(item.close));

        // Reverse the stock arrays (Reverse how the graph is displayed)
        reverseArrays([timestamps, closePrices]);

        // Calculate stock progress
        const initialPrice = closePrices[0];
        const currentPrice = closePrices[closePrices.length - 1];
        const progress = currentPrice - initialPrice;
        const progressPercentage = ((currentPrice - initialPrice) / initialPrice) * 100;

        // Display the stocks progress using the function
        displayProgress(progress, progressPercentage);

        // Show the stock progress information
        document.getElementById('stockProgress').style.display = 'block';

        // Destroy the existing stock chart
        destroyChart(myChart);

        // Creating a new stock Chart
        myChart = createChart(timestamps, closePrices, symbol);

        // Fetch realtime data for the current price
        await fetchAndUpdateRealtimeData(realtimeUrl, options);

        // Hide the loading timer
        loadingTimer.style.display = 'none';
        clearInterval(timerInterval); // Stop the timer interval
        const loadingEndTime = Date.now();
        const loadingTimeInSeconds = (loadingEndTime - loadingStartTime) / 1000;
        loadingTime.innerText = `Ladezeit: ${loadingTimeInSeconds.toFixed(2)}s`; // Display loading time in the bottom left corner
    } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors...
        clearInterval(timerInterval); // Stop the timer interval in case of error
        loadingTime.style.display = 'none'; // Hide the loading timer
    }
}

// Implement fetchStockData for tracking functionality
async function fetchStockData() {
}