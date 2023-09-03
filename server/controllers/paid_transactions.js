
async function getPaidTransactions(req, res){
    const query = `
    query MyQuery {
        payments(where: {from: "${req.params.address}"}) {
            txHash
            amount
            timestamp
        }
      }
    `;

    try {
        const response = await fetch("https://api.thegraph.com/subgraphs/name/requestnetwork/request-payments-goerli", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                query : query
            }),
        });

        const data = await response.json();
        res.status(200)
        res.json(data)

    } catch (error) {
        res.status(500)
        res.json({error : error.message})
    }
}

module.exports = {
    getPaidTransactions
}

