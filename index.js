const axios = require('axios')
const { rotate270, vflip } = require('2d-array-rotation')
const { JSDOM } = require('jsdom')
const { stringify } = require('querystring')
require('dotenv').config()

const url = 'https://www.kroky.si/2016/'

const login = async (username, password) => {

    console.log(`Logging in as ${username}`)

    const response = await axios.post(url,
        stringify({
            username,
            password,
        }), {
        params: {
            mod: 'register',
            action: 'login',
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })

    if (response.data.includes('Dostop zavrnjen, preverite ali ste vpisali pravilne podatke')) {
        throw {
            statusCode: 401,
            name: 'unauthorized',
            message: 'Wrong login credentials'
        }
    }

    axios.defaults.headers.common['cookie'] = response.headers['set-cookie'][0]

    console.log('Successfully logged in')

}

const getMeals = async (week) => {

    const response = await axios.get(url, {
        params: {
            mod: 'register',
            action: 'order',
            pos: parseInt(week),
        }
    })

    const { window } = new JSDOM(response.data)
    
    const out = Array.from(window.document.getElementsByClassName('fancytable')[0].children[1].children)
        .map(row => Array.from(row.children)
            .map(cell => {
                const properties = cell.children[0]
                return {
                    id: parseInt(properties?.getAttribute('cat_id')),
                    name: cell.children[1]?.children[2]?.textContent.replace(/\t|\n/g, ''),
                    date: properties?.getAttribute('name'),
                    selected: properties?.getAttribute('checked') != undefined,
                }
            })
            .slice(1, -1)
            .filter(cell => cell.id)
        )
        .filter(row => row.length)
    
    if (!out.length)
        return []
    
    return vflip(rotate270(out))

}

const selectMeal = async (date, id, xl) => {

    const response = await axios.post(url,
        stringify({
            date,
            c: id,
            xl: xl ? 1 : 0,
        }), {
        params: {
            mod: 'register',
            action: 'user2date2menu',
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })

    if (response.data.includes('category_id')) {
        throw {
            statusCode: 404,
            name: 'not_found',
            message: 'Category id not found'
        }
    }

    if (response.data.includes('Izbiraš lahko samo jedilnik za prihajajoči teden')) {
        throw {
            statusCode: 400,
            name: 'bad_request',
            message: 'Wrong date'
        }
    }

}

module.exports = {
    login,
    getMeals,
    selectMeal,
}