const express = require('express')
const app = express()
const port = 3000
const birds = require('./birds')

// ...

app.use('/birds', birds)


app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// app.post('/', (req, res) => {
//   res.send('The Response is send by the post method!')
// })

// app.put('/', (req, res) => {
//   res.send('The Response is send by the put method!')
// })
// app.patch('/', (req, res) => {
//   res.send('The Response is send by the patch method!')
// })
// app.delete('/', (req, res) => {
//   res.send('The Response is send by the delate method!')

// })
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
