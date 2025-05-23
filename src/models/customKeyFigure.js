const mongoose = require("mongoose")


const customKeyFigureSchema = new mongoose.Schema({
    name: {type: String, required: true},
    formula: {type: String, required: true},
    type: {type: String, required: true},
    reference_value: {type: String}
})

const CustomKeyFigure = mongoose.model('CustomKeyFigure', customKeyFigureSchema, "customKeyFigure")

module.exports = CustomKeyFigure