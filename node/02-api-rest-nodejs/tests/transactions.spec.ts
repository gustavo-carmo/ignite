import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import supertest from 'supertest'
import { app } from '../src/app'
import TestAgent from 'supertest/lib/agent'
import { execSync } from 'child_process'

describe('Transactions routes', () => {
  let request: TestAgent

  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    request = supertest(app.server)
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new transaction', async () => {
    await request
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request.post('/transactions').send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit',
    })

    const cookies = createTransactionResponse.get('Set-Cookie') ?? []

    const listTransactionsResponse = await request
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    ])
  })

  it('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await request.post('/transactions').send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit',
    })

    const cookies = createTransactionResponse.get('Set-Cookie') ?? []

    const listTransactionsResponse = await request
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        id: transactionId,
        title: 'New transaction',
        amount: 5000,
      }),
    )
  })

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request.post('/transactions').send({
      title: 'Credit transaction',
      amount: 5000,
      type: 'credit',
    })

    const cookies = createTransactionResponse.get('Set-Cookie') ?? []

    await request
      .post('/transactions')
      .send({
        title: 'Debit transaction',
        amount: 2000,
        type: 'debit',
      })
      .set('Cookie', cookies)

    const summaryTransactionsResponse = await request
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryTransactionsResponse.body.summary).toEqual({ amount: 3000 })
  })
})
