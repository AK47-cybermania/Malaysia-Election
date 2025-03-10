document.getElementById("calculator").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const parties = document.getElementById("party").value.split(",").map(p => p.trim());
    const votes = document.getElementById("votes").value.split(",").map(v => parseInt(v.trim()));
    
    const totalVotes = votes.reduce((a, b) => a + b, 0);
    const seatCount = Math.floor(totalVotes / 100); // Total seats, adjust based on requirements
    const threshold = totalVotes * 0.045; // 4.5% threshold
    
    const results = calculateSeats(parties, votes, threshold, seatCount);
    displayResults(results);
});

function calculateSeats(parties, votes, threshold, seatCount) {
    let results = {};
  
    parties.forEach((party, index) => {
        if (votes[index] >= threshold) {
            results[party] = 0;
        }
    });

    for (let i = 0; i < seatCount; i++) {
        let maxVotes = 0;
        let selectedParty = "";
        
        parties.forEach((party, index) => {
            if (votes[index] >= threshold) {
                const currentVotes = votes[index] / (results[party] + 1);
                if (currentVotes > maxVotes) {
                    maxVotes = currentVotes;
                    selectedParty = party;
                }
            }
        });

        if (selectedParty) {
            results[selectedParty]++;
        }
    }

    return results;
}

function displayResults(results) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "<h2>Results:</h2><ul>";
    
    for (let party in results) {
        resultDiv.innerHTML += `<li>${party}: ${results[party]} seats</li>`;
    }
    
    resultDiv.innerHTML += "</ul>";
}
const results = {};

document.getElementById("addParty").addEventListener("click", function () {
    const partyName = document.getElementById("partyName").value.trim();
    const votes = parseInt(document.getElementById("votes").value, 10);

    if (partyName && !isNaN(votes) && votes > 0) {
        results[partyName] = (results[partyName] || 0) + votes;
        document.getElementById("partyName").value = "";
        document.getElementById("votes").value = "";
    }
});

document.getElementById("calculate").addEventListener("click", function () {
    displayResults(results);
});

function displayResults(results) {
    const resultDiv = document.getElementById("results");
    resultDiv.innerHTML = "<h2>Results:</h2><ul>";

    const labels = [];
    const data = [];

    for (let party in results) {
        labels.push(party);
        data.push(results[party]);
        resultDiv.innerHTML += `<li>${party}: ${results[party]} votes</li>`;
    }

    resultDiv.innerHTML += "</ul>";

    // Draw the Chart
    const ctx = document.getElementById("resultsChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Votes",
                    data: data,
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}