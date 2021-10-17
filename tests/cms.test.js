/**
 * This file is designed to use Jest to test the CMS component of the Molecule of the Month application. The CMS abstractly is designed to:
 *
 * -Allow a user to register an account
 * -Allow a registered user to log in
 * -Allow a registered user to submit a file
 * -Allow any user to download a file corresponding to the current month
 *
 * In addition to these, several other functions are noted:
 *
 * -Multiple users can be registered
 * -Passwords are encrypted before they are stored
 * -Multiple files can be uploaded
 *
 * This gives us a distinct set of tests to run on the application.
 */
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})
const functions = require('../static/routes/cms.js');

test('Adding a user', async () => {
    expect(functions.addUser('test', 'test', 'test', 'test@test')).toBeTruthy(JSON.stringify(client.query('select * from users where user_id=test')) == { user_id: "test", username: "test", password: "test", email: "test@test" })
})
