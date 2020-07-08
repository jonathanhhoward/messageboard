/*
*
*
*       Complete the API routing below
*
*
*/

'use strict'

const api = require('../handlers')

const router = require('express').Router()

router.route('/threads/:board')
  .post(api.addNewThread)

router.route('/replies/:board')

module.exports = router
