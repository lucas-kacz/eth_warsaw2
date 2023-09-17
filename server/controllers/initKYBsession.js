async function initSession (req, res) {
    const { body } = req
    console.log(body)

    const response = await fetch('https://api.synaps.io/v4/session/init', {
        method: 'POST',
        headers: {
            'Api-Key': process.env.SYNAPS_API_KEY,
        },
        body: {
            alias: 'MY_ALIAS',
        },
    })

    console.log(response)

    const data = await response.json()

    console.log(data)

    res.json(data)
}