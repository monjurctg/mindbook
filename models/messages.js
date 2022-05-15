const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = Schema({
    message: {
    text: {
      type: String,
      require: true,
    },
  },
  users: Array,
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
},
{
    timestampps:true
}
);

const Massage = mongoose.model("messages", messageSchema);

module.exports = Massage;
