/* eslint-disable no-unused-vars */

/**
 * @typedef {object} ChatMessageType
 * @property {string} cid
 * @property {string} content 
 * @property {string} from
 * @property {number} timestamp
 */

/**
 * @typedef {object} ChatType
 * @property {string} topic
 * @property {string} cid
 * @property {Array<ChatMessageType>} messages
 * @property {Array<any>} assignedUsers
 */

/** @typedef {{ username: string }} SelfInfoType */

/**
 * @typedef {object} SkypeAccountType
 * @property {SelfInfoType} selfInfo
 */

/** @type {string} */