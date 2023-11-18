const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema ({
    title: { type: String },
    description: { type: String },
    short_description: { type: String },
    platform: { type: String },
    host: { type: String },
    policy: { type: String },
    eventType: { type: String },
    image: { type: String },
    imageKey:{ type: String},
    date: { type: Date },
    time: { type: String },
    price: { type: String },
    sales: { type: Number, default: 0},
    url: { type: String, default: '' },
    published: { type: Boolean, default: true}
});

module.exports = mongoose.model('events', eventSchema);
